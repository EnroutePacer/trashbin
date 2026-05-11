<!--
  组件说明：NavBar (顶部导航栏组件)
  功能：提供全站级别的菜单导航、Logo显示、多语言切换、暗黑模式切换等全局入口交互。
-->
<template>
  <nav class="navbar">
    <router-link to="/" class="logo-link">
      <div class="logo">{{ t('nav.title') }}</div>
    </router-link>
    <ul class="nav-links">
      <li><a href="/#knowledge" @click.prevent="scrollToSection('knowledge')">{{ t('nav.knowledge') }}</a></li>
      <li><a href="/#academic" @click.prevent="scrollToSection('academic')">{{ t('nav.academic') }}</a></li>
      <li><a href="/#interactive" @click.prevent="scrollToSection('interactive')">{{ t('nav.interactive') }}</a></li>
    </ul>
    <div class="settings-menu" @mouseleave="dropdownOpen = false">
      <div class="settings-btn" @click="dropdownOpen = !dropdownOpen">
        <span>☰</span> <i class="arrow"></i>
      </div>
      <div class="settings-dropdown" :class="{ active: dropdownOpen }">
        <div class="settings-dropdown-inner">
          <div class="dropdown-item">
            <span>{{ t('menu.theme') }}</span>
            <button class="ctrl-btn-small" @click="themeStore.toggleTheme()">
              {{ themeStore.theme === 'dark' ? '⚪' : '⚫' }}
            </button>
          </div>
          <div class="dropdown-item">
            <span>{{ t('menu.lang') }}</span>
            <div class="custom-lang-wrapper" @mouseleave="langDropdownOpen = false">
              <div class="lang-select-trigger" @click="langDropdownOpen = !langDropdownOpen">
                {{ langLabelsFull[i18nStore.currentLang] }} <span class="arrow-down">▼</span>
              </div>
              <ul class="custom-lang-options" :class="{ show: langDropdownOpen }">
                <li><a href="#" @click.prevent="selectLang('zh-CN')">中文</a></li>
                <li><a href="#" @click.prevent="selectLang('en')">Eng</a></li>
                <li><a href="#" @click.prevent="selectLang('ja')">日本語</a></li>
              </ul>
            </div>
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item">
            <router-link to="/knowledge" class="login-link" @click="dropdownOpen = false">
              <span>{{ t('nav.dropdown.knowledge') }}</span>
              <span class="arrow-right">→</span>
            </router-link>
          </div>
          <div class="dropdown-item">
            <router-link to="/academic" class="login-link" @click="dropdownOpen = false">
              <span>{{ t('nav.dropdown.academic') }}</span>
              <span class="arrow-right">→</span>
            </router-link>
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item">
            <router-link to="/login" class="login-link" @click="dropdownOpen = false">
              <span>{{ t('menu.login') }}</span>
              <span class="arrow-right">→</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme.js'
import { useI18nStore } from '../stores/i18n.js'
import { useI18n } from '../composables/useI18n.js'

const themeStore = useThemeStore()
const i18nStore = useI18nStore()
const { t } = useI18n()
const router = useRouter()
const dropdownOpen = ref(false)
const langDropdownOpen = ref(false)
const langLabelsFull = { 'zh-CN': '中文', en: 'English', ja: '日本語' }

function selectLang(val) {
  i18nStore.setLang(val)
  langDropdownOpen.value = false
}

function scrollToSection(id) {
  if (router.currentRoute.value.path !== '/') {
    router.push({ path: '/', hash: `#${id}` })
  } else {
    const el = document.getElementById(id)
    if (el) {
      const navHeight = document.querySelector('.navbar').offsetHeight
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navHeight, behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>
.logo-link { text-decoration: none; }
.custom-lang-wrapper {
  position: relative;
  display: inline-block;
}
.lang-select-trigger {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}
.lang-select-trigger:hover {
  border-color: var(--accent);
}
.arrow-down {
  font-size: 0.6rem;
  margin-left: 2px;
  vertical-align: middle;
}
.custom-lang-options {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--ocean-deep);
  list-style: none;
  padding: 0.8rem;
  margin: 0;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  display: none;
  flex-direction: column;
  gap: 0.8rem;
  min-width: 80px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 100;
  text-align: center;
}
/* 增加透明伪元素填补菜单悬浮的间隙，防止鼠标移出直接关闭 */
.custom-lang-options::before {
  content: '';
  position: absolute;
  top: -15px;
  left: 0;
  right: 0;
  height: 15px;
  background: transparent;
}
.custom-lang-options.show {
  display: flex;
}
.custom-lang-options a {
  position: relative; 
  color: var(--text-muted); 
  text-decoration: none;
  font-size: 0.95rem; 
  letter-spacing: 1px; 
  padding-bottom: 5px; 
  transition: color 0.4s ease;
}
.custom-lang-options a::after {
  content: ''; 
  position: absolute; 
  width: 0; 
  height: 2px; 
  bottom: 0; 
  left: 50%;
  background-color: var(--accent);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform: translateX(-50%); 
  border-radius: 2px;
}
.custom-lang-options a:hover { 
  color: var(--highlight); 
}
.custom-lang-options a:hover::after { 
  width: 100%; 
}
</style>
