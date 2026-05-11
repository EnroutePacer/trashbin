import { defineStore } from 'pinia'
import { ref } from 'vue'
import { messages } from '../i18n/index.js'

export const useI18nStore = defineStore('i18n', () => {
  const currentLang = ref(localStorage.getItem('siteLang') || 'zh-CN')

  function t(key) {
    const dict = messages[currentLang.value]
    return dict?.[key] ?? key
  }

  function setLang(lang) {
    currentLang.value = lang
    localStorage.setItem('siteLang', lang)
    document.documentElement.lang = lang
  }

  function cycleLang() {
    const langs = ['zh-CN', 'en', 'ja']
    const idx = langs.indexOf(currentLang.value)
    setLang(langs[(idx + 1) % langs.length])
  }

  const langLabels = { 'zh-CN': 'EN', en: 'JP', ja: '中' }

  return { currentLang, t, setLang, cycleLang, langLabels }
})
