import { storeToRefs } from 'pinia'
import { useI18nStore } from '../stores/i18n.js'

/**
 * i18n composable — provides reactive t() and lang ref
 */
export function useI18n() {
  const store = useI18nStore()
  const { currentLang: lang } = storeToRefs(store)
  return { t: store.t, lang, setLang: store.setLang, cycleLang: store.cycleLang, langLabels: store.langLabels }
}
