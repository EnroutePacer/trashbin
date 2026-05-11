<template>
  <div class="weather-map-view" ref="viewRef" :class="{ fullscreen: isFullscreen }">
    <!-- 加载遮罩 -->
    <div class="map-layer loading-overlay" v-if="loading">
      <div style="text-align:center">
        <div style="font-size:2rem;margin-bottom:8px">🌧️</div>
        <div v-html="loadingMsg"></div>
      </div>
    </div>

    <!-- 地图容器 -->
    <div id="weather-map" ref="mapRef"></div>

    <!-- 探照灯遮罩 (纯 CSS color-dodge) -->
    <div ref="spotlightRef" class="map-layer spotlight-overlay"></div>

    <!-- 降水雾气画布 -->
    <canvas ref="mistCanvasRef" class="map-layer mist-canvas"></canvas>

    <!-- 光标轨迹画布 -->
    <canvas ref="cursorCanvasRef" class="map-layer cursor-canvas"></canvas>

    <!-- 状态标签 -->
    <div class="weather-status" v-show="!loading" @click="reloadPage">RainViewer</div>

    <!-- 探照灯强度调节 -->
    <button class="torchlight-btn" :class="{ active: torchlightOpen }" @click="toggleTorchlight" v-show="!loading">
      🔦
    </button>
    <div class="torchlight-panel" :class="{ visible: torchlightOpen }" v-show="!loading" @mouseleave="onTorchlightLeave">
      <input
        type="range"
        :min="0.3"
        :max="2.0"
        :step="0.1"
        v-model.number="torchlightScale"
        @input="onTorchlightDrag"
      />
    </div>

    <!-- 卫星图切换 -->
    <button class="satellite-toggle active" @click="toggleSatellite" v-show="!loading">
      🛰️ {{ satLabels[satelliteMode] }}
    </button>

    <!-- 实时云图切换 -->
    <button class="cloud-toggle" :class="{ active: cloudOverlayMode }" @click="toggleCloud" v-show="!loading && cloudFrames.length > 0 && satelliteMode !== 2">
      ☁️ Cloud
    </button>

    <!-- 水汽溯源提示 -->
    <div
      ref="tooltipRef"
      class="vapor-tooltip"
      :class="{ visible: tooltipVisible }"
      :style="tooltipStyle"
    >
      {{ t('weather.vapor') }}<span class="ocean-name">{{ oceanName }}</span>{{ t('weather.vaporSuffix') }}
    </div>

    <!-- 帧时间线 -->
    <div class="timeline" v-show="!loading && frames.length > 0" :class="{ realtime: satelliteMode === 2 }">
      <div class="timeline-controls">
        <span class="time-edge">{{ fmtStart }}</span>
        <button
          class="play-btn"
          :class="{ preloading }"
          :disabled="preloading"
          @click="togglePlayback"
          :title="preloading ? '预加载中…' : playbackActive ? '暂停' : '播放'"
        >
          {{ preloading ? '⏳' : playbackActive ? '⏸' : '▶' }}
        </button>
        <input
          type="range"
          :min="0"
          :max="frames.length - 1"
          :value="currentIdx"
          @input="onSliderInput($event.target.value)"
        />
        <span class="time-edge">{{ fmtEnd }}</span>
      </div>
      <div class="time-label">{{ timeLabel }}</div>
    </div>
  </div>
</template>

<script setup>
// =================================================================
// WeatherMap.vue — 天气雷达可视化地图
// =================================================================
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from '../composables/useI18n.js'

// =================================================================
// 1. Props
// =================================================================
const props = defineProps({ fullscreen: { type: Boolean, default: false } })
const isFullscreen = props.fullscreen

// ---- i18n ----
const { t, lang } = useI18n()

const oceanName = computed(() => {
  const ocean = _currentOcean.value
  if (!ocean) return ''
  return lang.value === 'zh-CN' ? ocean.names[0] : ocean.names[1]
})

// =================================================================
// 2. DOM 引用
// =================================================================
const viewRef = ref(null)
const mapRef = ref(null)
const spotlightRef = ref(null)
const mistCanvasRef = ref(null)
const cursorCanvasRef = ref(null)
const tooltipRef = ref(null)

// =================================================================
// 3. 响应式状态
// =================================================================
const loading = ref(true)
const loadingMsg = ref('Loading...')
const frames = ref([])
const cloudFrames = ref([])
const currentIdx = ref(0)
const timeLabel = ref('--:-- UTC')
const tooltipVisible = ref(false)
const tooltipStyle = ref({})
const satelliteMode = ref(0)       // 0=Dark  1=Satellite  2=Realtime
const cloudOverlayMode = ref(false)
const satLabels = ['Dark', 'Satellite', 'Realtime']
const torchlightOpen = ref(false)
const torchlightScale = ref(1)
let _torchlightAdjusted = false
const playbackActive = ref(false)
const preloading = ref(false)
const fmtStart = computed(() => frames.value.length > 0 ? fmt(frames.value[0].time).time : '--:--')
const fmtEnd   = computed(() => frames.value.length > 0 ? fmt(frames.value[frames.value.length - 1].time).time : '--:--')

// =================================================================
// 4. 非响应式内部变量
// =================================================================
let mapInstance = null
let darkBaseLayer = null
let labelLayer = null
let radarLayer = null
let satelliteLayer = null
let realtimeLayer = null
let cloudLayer = null
let __rvHost = ''

// Canvas
let mistCtx = null
let cursorCtx = null
let maskCanvas = null
let maskCtx = null

// 鼠标 / 动画状态
let mouseX = -1000, mouseY = -1000
const targetPos = { x: -1000, y: -1000 }
const currentPos = { x: -1000, y: -1000 }
let isMapDragging = false
let isRainingLocally = false
const _currentOcean = ref(null)
let mistProgress = 0
let tooltipAccumulator = 0
let tooltipX = -1000, tooltipY = -1000
let lastTime = 0

const mouseTrail = []
const cursorTrail = []
let animFrameId = null
let sampleCache = { url: null, imgData: null, lastZ: -1 }

// 播放 / 缩放
let _playTimer = null
let _preloadTimer = null
let _preloadedLayers = []
let _playIdx = 0
let _preloadStartIdx = 0
let _zoomStableTimer = null
let _savedView = null
let _reloadGen = 0  // 重载计数，用于缓存破坏

// =================================================================
// 5. 常量
// =================================================================
const TRAIL_DURATION = 1500
const RADAR_MAX_ZOOM = 8
const REALTIME_MAX_ZOOM = 10

const OCEANS = [
  { names: ['太平洋', 'Pacific'],    lat: [-60, 65], lng: [-180,  -70] },
  { names: ['太平洋', 'Pacific'],    lat: [-60, 65], lng: [ 120,  180] },
  { names: ['大西洋', 'Atlantic'],   lat: [-60, 65], lng: [ -70,   20] },
  { names: ['印度洋', 'Indian'],     lat: [ -40, 30], lng: [  20,  120] },
  { names: ['南大洋', 'Southern'],   lat: [ -90,-45], lng: [-180,  180] },
  { names: ['北冰洋', 'Arctic'],     lat: [  65, 90], lng: [-180,  180] }
]

// =================================================================
// 6. 工具函数
// =================================================================
function getOcean(lat, lng) {
  for (const o of OCEANS) {
    if (lat >= o.lat[0] && lat <= o.lat[1] && lng >= o.lng[0] && lng <= o.lng[1]) return o
  }
  return null
}

function latToTileY(lat, z) {
  const n = Math.pow(2, z)
  const r = Math.tan(lat * Math.PI / 180)
  return n * (1 - Math.log(r + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2
}

function fmt(ts) {
  const d = new Date(ts * 1000)
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mm = String(d.getUTCMinutes()).padStart(2, '0')
  const M  = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  return { time: `${hh}:${mm} UTC`, dateStr: `${M}-${dd}` }
}

function isRadarSafe() {
  return mapInstance && mapInstance.getZoom() <= RADAR_MAX_ZOOM
}

function isRealtimeSafe() {
  return mapInstance && mapInstance.getZoom() <= REALTIME_MAX_ZOOM
}

/** 返回带缓存破坏参数的瓦片 URL 模板（Leaflet {z}/{x}/{y} 占位符） */
function _tileTemplate(f) {
  const cb = _reloadGen ? `?_r=${_reloadGen}` : ''
  return `${__rvHost}${f.path}/512/{z}/{x}/{y}/2/1_1.png${cb}`
}

// =================================================================
// 7. 图层辅助函数（消除 5+ 处重复的 bringToFront / 条件判断）
// =================================================================

/** 统一图层栈顺序：radar → label 置顶 */
function finalizeLayerOrder() {
  if (radarLayer && mapInstance.hasLayer(radarLayer)) radarLayer.bringToFront()
  if (labelLayer) labelLayer.bringToFront()
}

/** 若雷达不在图上且缩放安全，则恢复雷达图层 */
function restoreRadarIfSafe() {
  if (!radarLayer || !mapInstance) return
  if (isRadarSafe() && !mapInstance.hasLayer(radarLayer)) {
    radarLayer.addTo(mapInstance)
  }
}

// =================================================================
// 8. 探照灯控制
// =================================================================
function reloadPage() {
  _reloadGen++
  // 停止播放相关
  playbackActive.value = false
  preloading.value = false
  clearInterval(_playTimer)
  clearTimeout(_preloadTimer)
  clearTimeout(_zoomStableTimer)

  // 清理所有图层 + 画布
  if (animFrameId) cancelAnimationFrame(animFrameId)
  if (mapInstance) {
    _savedView = { center: [mapInstance.getCenter().lat, mapInstance.getCenter().lng], zoom: mapInstance.getZoom() }
    _preloadedLayers.forEach(l => mapInstance.removeLayer(l))
    if (radarLayer)     mapInstance.removeLayer(radarLayer)
    if (cloudLayer)     mapInstance.removeLayer(cloudLayer)
    if (satelliteLayer) mapInstance.removeLayer(satelliteLayer)
    if (realtimeLayer)  mapInstance.removeLayer(realtimeLayer)
    mapInstance.remove()
    mapInstance = null
  }
  _preloadedLayers = []
  radarLayer = null
  cloudLayer = null
  satelliteLayer = null
  realtimeLayer = null
  sampleCache = { url: null, imgData: null, lastZ: -1 }
  if (mistCtx) mistCtx.clearRect(0, 0, mistCtx.canvas.width, mistCtx.canvas.height)
  if (cursorCtx) cursorCtx.clearRect(0, 0, cursorCtx.canvas.width, cursorCtx.canvas.height)

  // 重置状态
  loading.value = true
  loadingMsg.value = 'Loading...'
  frames.value = []
  cloudFrames.value = []
  currentIdx.value = 0
  timeLabel.value = '--:-- UTC'
  playbackActive.value = false
  preloading.value = false
  satelliteMode.value = 0
  cloudOverlayMode.value = false

  // 重新初始化
  nextTick(() => initMap())
}

function toggleTorchlight() {
  torchlightOpen.value = !torchlightOpen.value
  if (torchlightOpen.value) _torchlightAdjusted = false
}

function onTorchlightDrag() {
  _torchlightAdjusted = true
}

function onTorchlightLeave() {
  if (_torchlightAdjusted) torchlightOpen.value = false
}

// =================================================================
// 9. 播放控制
// =================================================================
function togglePlayback() {
  if (preloading.value) return
  if (playbackActive.value) { _stopPlayback(); return }

  // 最新帧 → 从头播放；否则从当前帧开始
  _preloadStartIdx = (currentIdx.value === frames.value.length - 1) ? 0 : currentIdx.value

  // 预加载：创建全部帧的图层（添加到地图触发瓦片加载，初始 opacity:0）
  preloading.value = true
  _preloadedLayers = frames.value.map((f) =>
    L.tileLayer(_tileTemplate(f), {
      transparent: true, opacity: 0, crossOrigin: true, updateWhenZooming: true, keepBuffer: 8
    })
  )
  _preloadedLayers.forEach(l => l.addTo(mapInstance))

  // 隐藏当前雷达图层
  if (radarLayer) { mapInstance.removeLayer(radarLayer); radarLayer = null }

  // 预加载延迟让瓦片开始下载，然后启动
  _preloadTimer = setTimeout(() => {
    preloading.value = false
    _startPlayback()
  }, 1500)
}

function _startPlayback() {
  playbackActive.value = true
  isRainingLocally = false
  _currentOcean.value = null
  mouseTrail.length = 0
  cursorTrail.length = 0
  mistProgress = 0
  tooltipAccumulator = 0
  tooltipVisible.value = false

  _playIdx = _preloadStartIdx
  _preloadedLayers[_playIdx].setOpacity(0.65)
  finalizeLayerOrder()

  _playTimer = setInterval(() => {
    _preloadedLayers[_playIdx].setOpacity(0)
    _playIdx++
    if (_playIdx >= frames.value.length) { _stopPlayback(); return }
    _preloadedLayers[_playIdx].setOpacity(0.65)
    currentIdx.value = _playIdx
    const f = frames.value[_playIdx]
    const { time, dateStr } = fmt(f.time)
    timeLabel.value = `${time}  ${dateStr}`
    finalizeLayerOrder()
  }, 300)
}

function _stopPlayback() {
  playbackActive.value = false
  preloading.value = false
  clearInterval(_playTimer)
  clearTimeout(_preloadTimer)

  // 清理预加载图层
  _preloadedLayers.forEach(l => {
    l.setOpacity(0)
    if (mapInstance) mapInstance.removeLayer(l)
  })
  _preloadedLayers = []

  // 回到默认时间（最新帧），重建标准雷达图层
  const latest = frames.value.length - 1
  showFrame(latest)
}

// =================================================================
// 10. 雷达降水图层
// =================================================================
function showFrame(idx) {
  if (!mapInstance) return
  if (radarLayer) mapInstance.removeLayer(radarLayer)

  const f = frames.value[idx]
  if (!f) return

  currentIdx.value = idx
  const { time, dateStr } = fmt(f.time)
  timeLabel.value = `${time}  ${dateStr}`

  radarLayer = L.tileLayer(
    _tileTemplate(f),
    { transparent: true, opacity: 0.65, crossOrigin: true, updateWhenZooming: false, keepBuffer: 8 }
  )

  if (isRadarSafe()) {
    radarLayer.addTo(mapInstance)
    finalizeLayerOrder()
  }
}

function onSliderInput(val) {
  showFrame(Number(val))
}

// =================================================================
// 11. 卫星图层
// =================================================================
async function fetchZoomEarthTimes() {
  try {
    const r = await fetch('/zoom-earth/times/geocolor.json')
    const data = await r.json()
    const sats = ['goes-west', 'goes-east', 'mtg-zero', 'msg-iodc', 'himawari']
    const paths = {}
    sats.forEach(id => {
      const ts = data[id]?.at(-1)
      if (ts) {
        const d = new Date(ts * 1000)
        const dateStr = d.toISOString().substring(0, 10)
        const timeStr = d.toISOString().substring(11, 13) + d.toISOString().substring(14, 16)
        paths[id] = `${dateStr}/${timeStr}`
      }
    })
    return paths
  } catch { return {} }
}

const ZoomEarthLayer = L.TileLayer.extend({
  initialize(opts) { L.setOptions(this, opts) },
  getTileUrl(coords) {
    const n = Math.pow(2, coords.z)
    let lng = ((coords.x + 0.5) / n) * 360 - 180
    lng = ((lng + 540) % 360) - 180

    let sat = 'himawari'
    if (lng >= -180 && lng < -120) sat = 'goes-west'
    else if (lng >= -120 && lng < -30) sat = 'goes-east'
    else if (lng >= -30 && lng < 35) sat = 'mtg-zero'
    else if (lng >= 35 && lng < 80) sat = 'msg-iodc'

    const path = this.options.satPaths[sat] || this.options.satPaths['goes-east']
    return path
      ? `/zoom-earth/geocolor/${sat}/${path}/${coords.z}/${coords.y}/${coords.x}.jpg`
      : this.options.errorTileUrl
  }
})

async function toggleSatellite() {
  if (playbackActive.value) return
  if (!mapInstance) return
  const prev = satelliteMode.value
  satelliteMode.value = (prev + 1) % 3
  const mode = satelliteMode.value

  // 清除旧底图
  if (prev === 0) mapInstance.removeLayer(darkBaseLayer)
  else if (prev === 1 && satelliteLayer) mapInstance.removeLayer(satelliteLayer)
  else if (prev === 2 && realtimeLayer) mapInstance.removeLayer(realtimeLayer)

  if (mode === 0) {
    labelLayer.setOpacity(0.3)
    darkBaseLayer.addTo(mapInstance)
  } else if (mode === 1) {
    labelLayer.setOpacity(0.7)
    if (!satelliteLayer) {
      satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, attribution: '&copy; Esri' }
      )
    }
    satelliteLayer.addTo(mapInstance)
  } else {
    // Realtime — 保留降水图层
    labelLayer.setOpacity(0.7)
    if (cloudLayer) mapInstance.removeLayer(cloudLayer)
    if (!mapInstance.hasLayer(darkBaseLayer)) darkBaseLayer.addTo(mapInstance)

    const satPaths = await fetchZoomEarthTimes()
    if (Object.keys(satPaths).length > 0) {
      if (realtimeLayer) mapInstance.removeLayer(realtimeLayer)
      realtimeLayer = new ZoomEarthLayer({
        maxZoom: 12, satPaths, updateWhenZooming: false, keepBuffer: 8,
        attribution: 'Realtime Global | Zoom Earth',
        errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      })
      if (isRealtimeSafe()) realtimeLayer.addTo(mapInstance)
    }
  }

  // 恢复云图（非 Realtime）+ 雷达（始终）
  if (mode !== 2) {
    if (cloudOverlayMode.value && cloudLayer && !mapInstance.hasLayer(cloudLayer)) {
      cloudLayer.addTo(mapInstance)
      cloudLayer.bringToFront()
    }
  }
  restoreRadarIfSafe()
  finalizeLayerOrder()
}

function toggleCloud() {
  if (playbackActive.value) return
  if (!mapInstance) return
  cloudOverlayMode.value = !cloudOverlayMode.value

  if (cloudOverlayMode.value) {
    if (!cloudLayer && cloudFrames.value.length > 0) {
      const f = cloudFrames.value[cloudFrames.value.length - 1]
      cloudLayer = L.tileLayer(
        _tileTemplate(f),
        { transparent: true, opacity: 0.45, crossOrigin: true, updateWhenZooming: false, keepBuffer: 8 }
      )
    }
    if (cloudLayer && satelliteMode.value !== 2) cloudLayer.addTo(mapInstance)
  } else {
    if (cloudLayer) mapInstance.removeLayer(cloudLayer)
  }
  finalizeLayerOrder()
}

// =================================================================
// 12. Canvas 动画 & 降水采样
// =================================================================
function resizeCanvases() {
  const mc = mistCanvasRef.value
  const cc = cursorCanvasRef.value
  const vr = viewRef.value
  if (!mc || !cc || !vr) return
  const { width: w, height: h } = vr.getBoundingClientRect()
  mc.width = w; mc.height = h
  cc.width = w; cc.height = h
  if (maskCanvas) { maskCanvas.width = w; maskCanvas.height = h }
}

async function samplePrecipAlpha(lat, lng) {
  if (!mapInstance) return 0
  const z = Math.min(mapInstance.getZoom(), 10)
  const x = Math.floor((lng + 180) / 360 * Math.pow(2, z))
  const y = Math.floor(latToTileY(lat, z))
  const f = frames.value[currentIdx.value]
  if (!f) return 0
  const tileUrl = `${__rvHost}${f.path}/512/${z}/${x}/${y}/2/1_1.png${_reloadGen ? '?_r=' + _reloadGen : ''}`

  if (sampleCache.url !== tileUrl || sampleCache.lastZ !== z) {
    sampleCache = { url: tileUrl, lastZ: z, imgData: null }
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      // 3s 超时保护
      await new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error('timeout')), 3000)
        img.onload  = () => { clearTimeout(t); resolve() }
        img.onerror = () => { clearTimeout(t); reject(new Error('load')) }
        img.src = tileUrl
      })
      const c = document.createElement('canvas')
      c.width = img.width; c.height = img.height
      const ctx = c.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(img, 0, 0)
      sampleCache.imgData = ctx.getImageData(0, 0, img.width, img.height)
    } catch { return 0 }
  }

  const data = sampleCache.imgData
  if (!data || !data.width) return 0

  const n = Math.pow(2, z)
  const px = Math.floor(((lng + 180) / 360 * n - x) * 512)
  const py = Math.floor((latToTileY(lat, z) - y) * 512)
  if (px < 0 || px >= data.width || py < 0 || py >= data.height) return 0

  return data.data[(py * data.width + px) * 4 + 3] / 255
}

function animateMist(time) {
  if (!mistCtx || !cursorCtx || !maskCtx) {
    animFrameId = requestAnimationFrame(animateMist)
    return
  }

  const dt = time - lastTime
  lastTime = time

  // 播放期间跳过雾气渲染与 DOM 查询，仅保留光标
  if (playbackActive.value) {
    mistCtx.clearRect(0, 0, mistCtx.canvas.width, mistCtx.canvas.height)
    mistProgress = Math.max(0, mistProgress - dt / 600)
    tooltipAccumulator = 0
    tooltipVisible.value = false
  } else {

    // 雾气进度
  if (isRainingLocally && _currentOcean.value) {
    mistProgress = Math.min(1.0, mistProgress + dt / 2400)
    tooltipAccumulator += dt
  } else {
    mistProgress = Math.max(0.0, mistProgress - dt / 1200)
    tooltipAccumulator = 0
  }

  const mc = mistCtx.canvas
  mistCtx.clearRect(0, 0, mc.width, mc.height)

  if (isRainingLocally && _currentOcean.value) {
    mouseTrail.push({ x: mouseX, y: mouseY, time })
  }
  while (mouseTrail.length > 0 && time - mouseTrail[0].time > TRAIL_DURATION) {
    mouseTrail.shift()
  }

  // 渲染雾气到 canvas
  if ((mistProgress > 0 || mouseTrail.length > 0) && radarLayer) {
    mistCtx.globalCompositeOperation = 'source-over'
    const container = radarLayer.getContainer()
    if (container && viewRef.value) {
      const { left: ox, top: oy } = viewRef.value.getBoundingClientRect()
      container.querySelectorAll('img').forEach(img => {
        const { left, top, width, height } = img.getBoundingClientRect()
        mistCtx.drawImage(img, left - ox, top - oy, width, height)
      })
    }

    mistCtx.globalCompositeOperation = 'source-in'
    mistCtx.fillStyle = 'rgba(225, 240, 255, 0.70)'
    mistCtx.fillRect(0, 0, mc.width, mc.height)

    maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height)
    maskCtx.globalCompositeOperation = 'source-over'

    for (const pt of mouseTrail) {
      const age = time - pt.time
      const intensity = Math.max(0, 1 - age / TRAIL_DURATION)
      const lp = mistProgress * intensity
      if (lp <= 0) continue

      const radius = Math.max(0.1, lp * 140 + Math.sin((time - pt.time) / 200) * 8 * lp)
      const grad = maskCtx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, radius)
      grad.addColorStop(0,   `rgba(255,255,255,${Math.min(0.8, lp * 0.8)})`)
      grad.addColorStop(0.3, `rgba(255,255,255,${Math.min(0.5, lp * 0.5)})`)
      grad.addColorStop(0.7, `rgba(255,255,255,${Math.min(0.15, lp * 0.15)})`)
      grad.addColorStop(1,   'rgba(255,255,255,0)')
      maskCtx.fillStyle = grad
      maskCtx.beginPath()
      maskCtx.arc(pt.x, pt.y, radius, 0, Math.PI * 2)
      maskCtx.fill()
    }

    mistCtx.globalCompositeOperation = 'destination-in'
    mistCtx.drawImage(maskCanvas, 0, 0)
  }

  // Tooltip
  if (tooltipAccumulator >= 1000 && _currentOcean.value) {
    if (!tooltipVisible.value) {
      tooltipVisible.value = true
    }
    tooltipX = mouseX; tooltipY = mouseY
    tooltipStyle.value = { left: mouseX + 'px', top: (mouseY - 60) + 'px' }
  } else {
    tooltipVisible.value = false
  }

  } // end playbackActive guard

  // 光标轨迹
  const cc = cursorCtx.canvas
  cursorCtx.clearRect(0, 0, cc.width, cc.height)

  if (targetPos.x > 0) {
    if (currentPos.x === -1000) { currentPos.x = targetPos.x; currentPos.y = targetPos.y }

    currentPos.x += (targetPos.x - currentPos.x) * 0.3
    currentPos.y += (targetPos.y - currentPos.y) * 0.3

    if (spotlightRef.value) {
      spotlightRef.value.style.setProperty('--mouse-x', currentPos.x + 'px')
      spotlightRef.value.style.setProperty('--mouse-y', currentPos.y + 'px')
      spotlightRef.value.style.setProperty('--spotlight-scale', torchlightScale.value)
    }

    if (!isMapDragging) {
      cursorTrail.push({ x: currentPos.x, y: currentPos.y, time })
    } else {
      cursorTrail.length = 0
      currentPos.x = targetPos.x; currentPos.y = targetPos.y
    }
    while (cursorTrail.length > 0 && time - cursorTrail[0].time > 400) cursorTrail.shift()

    if (cursorTrail.length > 1) {
      cursorCtx.lineWidth = 4
      cursorCtx.lineCap = cursorCtx.lineJoin = 'round'
      for (let i = 1; i < cursorTrail.length; i++) {
        cursorCtx.beginPath()
        const p0 = cursorTrail[i - 1], p1 = cursorTrail[i]
        if (i === 1) cursorCtx.moveTo(p0.x, p0.y)
        else { const pr = cursorTrail[i - 2]; cursorCtx.moveTo((p0.x + pr.x) / 2, (p0.y + pr.y) / 2) }
        cursorCtx.quadraticCurveTo(p0.x, p0.y, (p1.x + p0.x) / 2, (p1.y + p0.y) / 2)
        if (i === cursorTrail.length - 1) cursorCtx.lineTo(p1.x, p1.y)
        cursorCtx.strokeStyle = `rgba(124,200,240,${Math.pow(i / cursorTrail.length, 1.2) * 0.45})`
        cursorCtx.stroke()
      }
    }

    cursorCtx.beginPath()
    cursorCtx.arc(targetPos.x, targetPos.y, 6, 0, Math.PI * 2)
    cursorCtx.strokeStyle = 'rgba(124,200,240,0.9)'
    cursorCtx.lineWidth = 1.5
    cursorCtx.stroke()

    cursorCtx.beginPath()
    cursorCtx.arc(targetPos.x, targetPos.y, 1.5, 0, Math.PI * 2)
    cursorCtx.fillStyle = 'rgba(220,240,255,0.9)'
    cursorCtx.fill()
  }

  animFrameId = requestAnimationFrame(animateMist)
}

// =================================================================
// 13. 地图初始化
// =================================================================
async function initMap() {
  if (typeof L === 'undefined') { loadingMsg.value = '❌ Leaflet 未加载'; return }

  const mapEl = mapRef.value
  if (!mapEl) return

  mapInstance = L.map(mapEl, {
    center: _savedView ? _savedView.center : [20, 0],
    zoom: _savedView ? _savedView.zoom : 2,
    worldCopyJump: true, zoomControl: false, attributionControl: false
  })
  _savedView = null

  darkBaseLayer = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
    { subdomains: 'abcd', maxZoom: 19, attribution: '&copy; OSM | CartoDB' }
  ).addTo(mapInstance)

  labelLayer = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/only_labels/{z}/{x}/{y}.png',
    { subdomains: 'abcd', maxZoom: 19, opacity: 0.3, errorTileUrl: '' }
  ).addTo(mapInstance)

  // 获取雷达数据
  try {
    const data = await fetch('https://api.rainviewer.com/public/weather-maps.json').then(r => r.json())
    frames.value = data.radar.past || []
    cloudFrames.value = data.satellite?.past || []
    __rvHost = data.host
  } catch {
    loadingMsg.value = '❌ 无法获取雷达数据<br><span style="font-size:0.8rem">请检查网络连接</span>'
    return
  }

  if (frames.value.length === 0) { loadingMsg.value = '⚠️ 暂无雷达数据'; return }

  loading.value = false
  currentIdx.value = frames.value.length - 1
  showFrame(currentIdx.value)

  // Canvas 初始化
  await nextTick()
  if (!mistCanvasRef.value || !cursorCanvasRef.value) return
  mistCtx = mistCanvasRef.value.getContext('2d')
  cursorCtx = cursorCanvasRef.value.getContext('2d')
  maskCanvas = document.createElement('canvas')
  maskCtx = maskCanvas.getContext('2d')
  resizeCanvases()
  window.addEventListener('resize', resizeCanvases)

  // 事件绑定
  const mapContainer = mapInstance.getContainer()
  mapInstance.on('dragstart', () => { isMapDragging = true })
  mapInstance.on('dragend',   () => { isMapDragging = false; cursorTrail.length = 0 })
  mapInstance.on('zoomend', handleZoomEnd)

  mapContainer.addEventListener('mousemove', async (e) => {
    const cp = mapInstance.mouseEventToContainerPoint(e)
    mouseX = cp.x; mouseY = cp.y
    const vr = viewRef.value
    if (vr) {
      const { left, top } = vr.getBoundingClientRect()
      targetPos.x = e.clientX - left
      targetPos.y = e.clientY - top
    } else {
      targetPos.x = e.clientX; targetPos.y = e.clientY
    }

    const latlng = mapInstance.containerPointToLatLng(cp)
    const ocean = getOcean(latlng.lat, latlng.lng)
    if (!ocean) { isRainingLocally = false; _currentOcean.value = null; return }

    // 播放期间跳过瓦片采样，避免与帧切换争抢网络/CPU
    if (playbackActive.value) return

    const alpha = await samplePrecipAlpha(latlng.lat, latlng.lng)
    isRainingLocally = (alpha > 0.04)
    _currentOcean.value = isRainingLocally ? ocean : null
  })

  mapContainer.addEventListener('mouseleave', () => {
    isRainingLocally = false
    targetPos.x = targetPos.y = -1000
    if (spotlightRef.value) {
      spotlightRef.value.style.setProperty('--mouse-x', '-1000px')
      spotlightRef.value.style.setProperty('--mouse-y', '-1000px')
    }
  })

  document.addEventListener('keydown', handleKeydown)

  lastTime = performance.now()
  animFrameId = requestAnimationFrame(animateMist)
}

// =================================================================
// 14. 缩放安全控制
// =================================================================
function handleZoomEnd() {
  if (!mapInstance) return
  const z = mapInstance.getZoom()
  clearTimeout(_zoomStableTimer)

  // 播放期间：仅隐藏/恢复活动预加载层，不移除
  if (playbackActive.value && _preloadedLayers.length > 0) {
    if (z > RADAR_MAX_ZOOM) _preloadedLayers[_playIdx].setOpacity(0)
    else _preloadedLayers[_playIdx].setOpacity(0.65)
    labelLayer.bringToFront()
    return
  }

  if (z > REALTIME_MAX_ZOOM && realtimeLayer && mapInstance.hasLayer(realtimeLayer))
    mapInstance.removeLayer(realtimeLayer)
  if (z > RADAR_MAX_ZOOM && radarLayer && mapInstance.hasLayer(radarLayer))
    mapInstance.removeLayer(radarLayer)

  _zoomStableTimer = setTimeout(() => {
    if (!mapInstance) return
    const curZ = mapInstance.getZoom()

    if (satelliteMode.value === 2) {
      if (curZ <= REALTIME_MAX_ZOOM && realtimeLayer && !mapInstance.hasLayer(realtimeLayer)) {
        realtimeLayer.addTo(mapInstance)
        labelLayer.bringToFront()
      }
    } else {
      if (curZ <= RADAR_MAX_ZOOM && (!radarLayer || !mapInstance.hasLayer(radarLayer))) {
        showFrame(currentIdx.value)
      }
    }
  }, 1000)
}

// =================================================================
// 15. 键盘控制
// =================================================================
function handleKeydown(e) {
  if (e.key === 'ArrowLeft'  && currentIdx.value > 0) showFrame(currentIdx.value - 1)
  if (e.key === 'ArrowRight' && currentIdx.value < frames.value.length - 1) showFrame(currentIdx.value + 1)
  if (e.key === ' ') {
    e.preventDefault()
    togglePlayback()
  }
}

// =================================================================
// 16. 生命周期
// =================================================================
onMounted(() => { initMap() })

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId)
  clearInterval(_playTimer)
  clearTimeout(_preloadTimer)
  clearTimeout(_zoomStableTimer)
  if (mapInstance) { mapInstance.remove(); mapInstance = null }
  window.removeEventListener('resize', resizeCanvases)
  document.removeEventListener('keydown', handleKeydown)
})
</script>
