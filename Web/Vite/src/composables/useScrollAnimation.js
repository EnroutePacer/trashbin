import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 滚动动画 composable - 使用 IntersectionObserver
 * @param {Object} options - observer options
 * @returns {Object} { observeElement, cleanup }
 */
export function useScrollAnimation(options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  }

  let observer = null

  function observeElement(el, callback) {
    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            if (callback) callback(entry.target)
            observer.unobserve(entry.target)
          }
        })
      }, { ...defaultOptions, ...options })
    }
    if (el) observer.observe(el)
  }

  function cleanup() {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onUnmounted(cleanup)

  return { observeElement, cleanup }
}

/**
 * 直接绑定 ref 元素的滚动动画指令
 */
export const vScrollReveal = {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          if (binding.value?.callback) binding.value.callback(entry.target)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })
    el._scrollObserver = observer
    observer.observe(el)
  },
  unmounted(el) {
    if (el._scrollObserver) {
      el._scrollObserver.disconnect()
    }
  }
}
