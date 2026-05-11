# 渊海微澜 — The Profound Ocean 🌊

一个以海洋为主题的学术型全栈 Web 应用，基于 **Vue 3 + Vite + Pinia + Vue Router** 构建，展示海洋知识、学术讨论与交互式海洋体验。

## 功能概览

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | Hero 横幅 + 三大板块（海洋知识、学术讨论、互动体验） |
| 知识谱系 | `/knowledge` | 三模块长文：海洋起源、海洋生命、生态危机 |
| 学术长廊 | `/academic` | 论文文献、先驱学者、权威数据门户入口 |
| 用户登录 | `/login` | 登录表单（预留后端 API） |

### 全局功能

- 🌓 **暗/亮双主题** — 一键切换，自动持久化到 `localStorage`
- 🌐 **中/英/日三语** — 覆盖全部页面内容，语言偏好持久化
- 🎞️ **滚动动画** — IntersectionObserver 驱动的潮汐浮动 & 淡入效果
- 🗺️ **Leaflet 水汽溯源地图** — 模拟积雨云标记，悬停查看水汽来源

## 项目结构

```
src/
├── main.js                  # 入口：挂载 Pinia + Router
├── App.vue                  # 根组件
├── style.css                # 全局样式 & CSS 变量（深/浅主题）
├── router/index.js          # 路由配置
├── stores/
│   ├── theme.js             # 主题状态管理
│   └── i18n.js              # 多语言状态管理
├── i18n/                    # 中/英/日 词典
├── composables/
│   ├── useI18n.js           # i18n 组合函数
│   └── useScrollAnimation.js # 滚动动画组合函数
├── components/
│   ├── NavBar.vue           # 导航栏 + 设置下拉菜单
│   ├── HeroSection.vue      # 首屏横幅
│   ├── ContentSection.vue   # 通用区块容器
│   ├── ModuleCard.vue       # 图文模块卡片
│   ├── InteractiveUpload.vue # 照片上传表单
│   ├── WeatherMap.vue       # Leaflet 地图组件
│   └── FooterSection.vue    # 页脚
├── views/
│   ├── Home.vue             # 首页
│   ├── Knowledge.vue        # 知识谱系页
│   ├── Academic.vue         # 学术长廊页
│   └── Login.vue            # 登录页
└── api/                     # 后端接口层（预留）
    ├── index.js             # Axios 实例 & 拦截器
    ├── auth.js              # 认证 API
    ├── papers.js            # 论文 API
    ├── upload.js            # 上传 API
    └── ocean.js             # 海洋数据 API
```

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build
```

开发服务器默认运行在 `http://localhost:5173`。

## 后端对接

所有 API 调用已封装在 `src/api/` 目录下，基地址通过环境变量配置：

```bash
# .env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

当前接口处于预留状态（标记 `// TODO`），只需取消注释并启动后端服务即可联调。

### 已有接口骨架

- `authApi` — 登录/注册/OAuth/Token 刷新/个人资料
- `papersApi` — 论文 CRUD/搜索/收藏
- `uploadApi` — 海洋印记照片上传/地图标记
- `oceanApi` — 知识模块/实时海洋数据/水汽溯源/评论

## 技术栈

- **Vue 3** — `<script setup>` Composition API
- **Vite 8** — 构建工具
- **Pinia** — 状态管理
- **Vue Router 4** — 路由
- **Axios** — HTTP 客户端
- **Leaflet** — 交互地图

---

## 🔀 迁移对照：原始静态站 → Vue 工程

> 以下逐个列出原项目 `firstwork/` 中的每个文件、每段代码，说明它们在新 Vue 工程中被拆分到了哪个文件、为什么这样拆分、拆分后的工作逻辑是什么。

### 一、文件级映射总览

| 原文件 | 迁移去向 | 拆分方式 |
|--------|----------|----------|
| `index.html`（首页） | `views/Home.vue` + 6 个子组件 | 按区块拆为独立组件 |
| `academic.html` | `views/Academic.vue` | 独立路由页面 |
| `knowledge.html` | `views/Knowledge.vue` | 独立路由页面 |
| `login.html` | `views/Login.vue` | 独立路由页面 |
| `style.css`（全部样式） | `src/style.css` | 保持全局 CSS，不做 scoped 隔离 |
| `script.js`（全部逻辑） | 按职责拆入 `stores/` + `composables/` + `components/` | 按「状态 / 行为 / 视图」三层分离 |

---

### 二、原始 HTML 页面逐元素拆解

#### 2.1 `index.html` → `views/Home.vue`

原 `index.html` 是一个单页长卷，包含四个 section：`#knowledge`、`#academic`、`#interactive`，外加 Hero 横幅和 Footer。

**为什么不直接放在 `Home.vue` 一个文件里，而要拆出 6 个组件？**

因为原页面虽然是一个文件，但每个 section 语义独立、样式独立、逻辑独立。Vue 推崇 **"一个组件只做一件事"**——拆分后的好处是：

- 每个组件可以独立复用（如 `ModuleCard` 在首页和知识页都能用）
- 每个组件可以独立维护样式和动画逻辑
- 后续拓展时只需修改对应组件，不影响其他部分

**逐元素对照：**

```
原 index.html 元素                        →  新 Vue 组件
═══════════════════════════════════════════════════════════
<nav class="navbar">                     →  components/NavBar.vue
  ├── .logo                             →  内嵌在 NavBar 模板中
  ├── .nav-links (溯源/求索/共境)        →  内嵌，点击时调用 scrollToSection()
  └── .settings-menu                     →  内嵌，主题/语言/跳转链接
       ├── #theme-toggle                 →  themeStore.toggleTheme()
       └── #lang-toggle                  →  i18nStore.cycleLang()

<header class="hero">                    →  components/HeroSection.vue
  └── #page-transition                   →  components/PageTransition.vue

<section id="knowledge">                 →  components/ContentSection.vue
  ├── h2.section-title                  →  组件 props: title
  ├── .module (×3)                       →  components/ModuleCard.vue (×3 实例)
  └── 每张图片                           →  props: image

<section id="academic">                  →  components/ContentSection.vue (variant="light")
  ├── .scholar-card                     →  内联在 Home.vue 中（仅首页特有）
  ├── .paper-list                       →  内联在 Home.vue 中
  └── .official-links                   →  内联在 Home.vue 中

<section id="interactive">              →  components/ContentSection.vue
  ├── #ocean-form                       →  components/InteractiveUpload.vue
  └── #weather-map                      →  components/WeatherMap.vue

<footer>                                →  components/FooterSection.vue
```

#### 2.2 `academic.html` → `views/Academic.vue`

原 `academic.html` 有独立的 `<style>` 块（定义 `.paper-card-large`、`.portal-links` 等），还有与 `index.html` 完全重复的 `<nav>` 和 `<footer>`。

**拆分方式：**

| 原 HTML 部分 | 去向 | 原因 |
|-------------|------|------|
| `<nav class="navbar">` | `NavBar.vue`（全局共享） | 四页共用同一导航，只写一份 |
| `#page-transition` | `PageTransition.vue`（全局共享） | 页面切换遮罩逻辑完全相同 |
| `section > h1` + 三个子区域 | `views/Academic.vue` | 正文内容页特有，放入独立视图 |
| `<footer>` | `FooterSection.vue`（全局共享） | 四页共用同一页脚 |
| 页面内嵌 `<style>` | 合并到 `src/style.css` | 所有全局样式集中管理，便于维护 |

**关键变化：**

- 原页面的 `<style>` 块（`.paper-card-large:hover`、`.portal-btn` 等）全部提取到全局 `style.css`，因为这些样式在将来可能被多个页面使用
- 学术页面专属的 `.academic-page-spacer` 也进了全局样式，因为 Knowledge 页同样需要

#### 2.3 `knowledge.html` → `views/Knowledge.vue`

结构与 `Academic.vue` 几乎一致，差异仅在于正文内容区域换成了三个 `.long-text-module`。因此拆分策略完全相同，共享 NavBar / PageTransition / FooterSection。

#### 2.4 `login.html` → `views/Login.vue`

原 `login.html` 的导航和过渡是用内嵌 `<script>` 手写的，没有复用外部的 `script.js`。

**拆分方式：**

| 原内容 | 去向 |
|--------|------|
| `.login-container` + `.input-group` + `#login-form` | `views/Login.vue` 模板内 |
| `#page-transition` | `PageTransition.vue`（统一复用） |
| 登录表单提交逻辑 | `views/Login.vue` 的 `<script setup>` |
| 内嵌 `<style>` | 全部提取到全局 `style.css` |
| 用户名/密码输入框 | `v-model` 绑定替代原生 DOM 查询 |

---

### 三、原始 `style.css` → `src/style.css`

**迁移方式：直接平迁，不拆分 Scoped CSS。**

选择全放在一个全局 CSS 文件而不是拆到每个组件的 `<style scoped>` 中的原因：

1. **CSS 变量系统**（`:root` / `[data-theme='light']`）必须在全局生效，scope 隔离会让变量失效
2. **原站设计高度统一**——所有组件的视觉风格共享同一套色彩、间距、字体，拆散反而导致重复定义
3. **Leaflet 地图**的 `.simulated-cloud`、`.origin-tooltip` 等样式由 JS 动态创建 DOM，必须用全局选择器
4. **滚动动画类**（`.visible`、`.tide-slide`）由 IntersectionObserver 通过 `classList.add('visible')` 触发，如果样式 scoped 就无法匹配到运行时添加的 class

每段 CSS 在原文件和新文件中的行号完全对应、注释保留，可逐行对照。

---

### 四、原始 `script.js` 的功能拆分

原 `script.js` 约 400 行，集成了 **6 种完全不相关的职责**。Vue 工程将它们按"数据 / 行为 / 视图"三层架构彻底解耦：

#### 4.1 多语言字典 → `src/i18n/zh-CN.js` + `en.js` + `ja.js` + `index.js`

```
原 script.js 结构:
  const i18n = {
    'zh-CN': { /* 73 个翻译条目 */ },
    'en':    { /* 73 个翻译条目 */ },
    'ja':    { /* 73 个翻译条目 */ }
  }
```

**为什么拆成 3 个独立文件？**

- 每增加一种语言，只需新增一个文件，不碰已有语言
- 每个语言文件可独立交给翻译人员维护
- `index.js` 作为聚合层，统一导出接口

**工作逻辑：**

`stores/i18n.js` 的 `t(key)` 函数根据 `currentLang` 的值动态查找对应词典 → 组件通过 `composables/useI18n.js` 获取 `t` 函数 → 模板中 `{{ t('key') }}` 即返回当前语言的翻译。

#### 4.2 主题切换逻辑 → `stores/theme.js`

```
原代码:
  let currentTheme = localStorage.getItem('siteTheme') || 'dark';
  themeBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', ...);
    localStorage.setItem('siteTheme', ...);
  });
```

**为什么拆成独立的 Pinia Store？**

- 主题状态是"全局共享的 UI 状态"，任何组件都可能需要读取/修改
- Pinia 保证所有组件看到的是同一份 `theme` 值，且自动响应式更新
- 主题持久化逻辑封装在 Store 内部，外部只调用 `toggleTheme()`

**工作流程：**

`themeStore.toggleTheme()` → 修改 `theme.value` → `watch(theme, applyTheme)` 自动更新 `<html data-theme>` → CSS 变量自动切换 → 全局视觉即时变化。

#### 4.3 语言切换逻辑 → `stores/i18n.js`

同样拆为 Pinia Store，理由相同：全局共享 + 响应式 + 持久化。

#### 4.4 滚动动画 → `composables/useScrollAnimation.js`

```
原代码:
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  modules.forEach(mod => observer.observe(mod));
```

**为什么拆成 Composable？**

- IntersectionObserver 的创建/销毁逻辑与 UI 组件无关，是可复用的"能力"
- 任何组件调用 `observeElement(ref)` 即可获得滚动动画，不需要重复写 Observer 代码
- `onUnmounted` 时自动 `disconnect()` 防止内存泄漏

#### 4.5 导航栏平滑滚动 + 下拉菜单 → `components/NavBar.vue`

```
原代码:
  settingsBtn.addEventListener('click', () => settingsDropdown.classList.toggle('active'));
  settingsMenu.addEventListener('mouseleave', () => settingsDropdown.classList.remove('active'));
  navLinks.forEach(link => link.addEventListener("click", function(e) { ... }));
  loginLink.addEventListener('click', (e) => { ... });
```

**为什么用 Vue 响应式替代 `addEventListener`？**

- `dropdownOpen` 用 `ref(false)` 管理 → `:class="{ active: dropdownOpen }"` 自动绑定，比手动 `classList.toggle` 更清晰
- 鼠标离开用 `@mouseleave` 模板事件，逻辑声明在同一处
- 跨页导航用 Vue Router 的 `router.push()`，单页应用不再需要 `window.location.href`

#### 4.6 照片上传 + Leaflet 地图 → `components/InteractiveUpload.vue` + `WeatherMap.vue`

```
原代码:
  fileInput.addEventListener("change", function() { ... });
  form.addEventListener("submit", (e) => { ... });
  initWeatherMap() { ... }  // 约 50 行 Leaflet 初始化
```

**为什么拆成两个独立组件？**

- 上传和地图是两种完全不同的交互，互不依赖
- 地图组件使用 `onUnmounted` 生命周期自动销毁 Leaflet 实例，原代码没有清理逻辑
- 地图采用"进入视口时才初始化"的懒加载策略（`observeElement` 回调 → `initMap()`），首屏不再加载 Leaflet JS，提升性能
- 上传表单的 `v-model` 替代了 `document.getElementById`，数据流单向绑定更安全

---

### 五、架构设计原则总结

```
原项目架构（单体）:
  HTML ←── CSS ←── JS（600 行，6 种职责混在一起）
    ↑                ↑
    └─ data-i18n ────┘  (属性绑定)
    └─ class 操作 ─────┘  (classList.add/remove)

Vue 项目架构（三层分离）:
  ┌─ Stores (Pinia) ─────────────┐   ← 全局状态：theme / i18n
  ├─ Composables ────────────────┤   ← 可复用行为：滚动动画 / i18n
  ├─ Components (7个) ───────────┤   ← UI 单元：NavBar / Hero / ModuleCard ...
  ├─ Views (4个) ────────────────┤   ← 页面：Home / Academic / Knowledge / Login
  └─ API Layer ──────────────────┘   ← 数据通信：auth / papers / upload / ocean
```

| 维度 | 原项目 | Vue 重构 |
|------|--------|----------|
| 代码复用 | 4 个 HTML 各写一遍 navbar/footer | 全局注册 1 份 NavBar + 1 份 Footer |
| 状态管理 | `localStorage` + 手动 DOM 操作 | Pinia 响应式 Store，自动同步 |
| 数据流 | 双向 `addEventListener` | 单向 `props down, events up` |
| 可测试性 | 难以单元测试 | 每个 Store / Composable / Component 可独立测试 |
| 可扩展性 | 新增页面需复制全部样板 | 新增路由 + 视图即可，自动继承导航和页脚 |

