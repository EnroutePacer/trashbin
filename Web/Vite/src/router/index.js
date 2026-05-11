import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/Home.vue') },
  { path: '/academic', name: 'Academic', component: () => import('@/views/Academic.vue') },
  { path: '/knowledge', name: 'Knowledge', component: () => import('@/views/Knowledge.vue') },
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
  { path: '/weather', name: 'WeatherMap', component: () => import('@/views/WeatherMap.vue'), meta: { fullscreen: true }, props: { fullscreen: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

export default router
