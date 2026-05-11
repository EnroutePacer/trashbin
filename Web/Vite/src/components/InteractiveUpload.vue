<!--
  组件说明：InteractiveUpload (交互式上传组件)
  功能：提供文件上传交互区，处理用户的拖拽/选择文件等操作行为，属于特定的交互类功能组件。
-->
<template>
  <div class="interactive-part" ref="partRef">
    <h3>{{ t('interactive.p1.title') }}</h3>
    <p class="subtitle">{{ t('interactive.p1.desc') }}</p>
    <div class="upload-area">
      <form @submit.prevent="handleSubmit">
        <input
          type="text"
          v-model="location"
          :placeholder="t('interactive.placeholder')"
          required
        />
        <label for="photo-upload" class="upload-btn">{{ t('interactive.uploadBtn') }}</label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          style="display:none"
          @change="onFileChange"
          required
        />
        <div class="file-name-display">{{ fileName || t('interactive.noFile') }}</div>
        <button type="submit" class="btn btn-submit">{{ t('interactive.submit') }}</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n.js'
import { useScrollAnimation } from '../composables/useScrollAnimation.js'
import { uploadApi } from '../api/upload.js'

const { t } = useI18n()
const location = ref('')
const fileName = ref('')
const fileData = ref(null)
const partRef = ref(null)
const { observeElement } = useScrollAnimation()

onMounted(() => {
  if (partRef.value) observeElement(partRef.value)
})

function onFileChange(e) {
  if (e.target.files?.length > 0) {
    fileData.value = e.target.files[0]
    fileName.value = '已选择: ' + e.target.files[0].name
  }
}

async function handleSubmit() {
  if (!fileData.value) {
    alert(t('alert.nofile'))
    return
  }
  // TODO: 接入后端 API
  // const formData = new FormData()
  // formData.append('photo', fileData.value)
  // formData.append('location', location.value)
  // await uploadApi.uploadOceanMark(formData)
  alert(`【${location.value}】 - ${t('alert.success')}`)
  location.value = ''
  fileName.value = ''
  fileData.value = null
  const fileInput = document.getElementById('photo-upload')
  if (fileInput) fileInput.value = ''
}
</script>
