<template>
  <div>
    <PageTransition />
    <div class="login-page">
      <div class="login-container">
        <h2>{{ t('login.header') }}</h2>
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <label for="username">{{ t('login.username') }}</label>
            <input id="username" v-model="username" type="text" required />
          </div>
          <div class="input-group">
            <label for="password">{{ t('login.password') }}</label>
            <input id="password" v-model="password" type="password" required />
          </div>
          <button type="submit" class="btn login-btn">{{ t('login.submit') }}</button>
        </form>
        <router-link to="/" class="back-link">{{ t('login.back') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '../composables/useI18n.js'
import { authApi } from '../api/auth.js'
import PageTransition from '../components/PageTransition.vue'

const { t } = useI18n()
const router = useRouter()
const username = ref('')
const password = ref('')

async function handleLogin() {
  try {
    // TODO: 接入后端登录 API
    // const res = await authApi.login({ username: username.value, password: password.value })
    // localStorage.setItem('authToken', res.token)
    alert('登录成功！')
    router.push('/')
  } catch (err) {
    alert('登录失败：' + (err.response?.data?.message || err.message))
  }
}
</script>
