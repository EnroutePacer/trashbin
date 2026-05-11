import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(localStorage.getItem('siteTheme') || 'dark')

  function applyTheme() {
    if (theme.value === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('siteTheme', theme.value)
    applyTheme()
  }

  // Initialize on creation
  applyTheme()

  watch(theme, applyTheme)

  return { theme, toggleTheme }
})
