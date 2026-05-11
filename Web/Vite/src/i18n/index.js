import zhCN from './zh-CN.js'
import en from './en.js'
import ja from './ja.js'

export const messages = {
  'zh-CN': zhCN,
  en,
  ja
}

export const languageList = [
  { code: 'zh-CN', label: '中' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: 'JP' }
]

export function getDefaultLanguage() {
  return localStorage.getItem('siteLang') || 'zh-CN'
}
