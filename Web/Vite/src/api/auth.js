import apiClient from './index.js'

/**
 * 用户认证 API
 */
export const authApi = {
  /**
   * 用户登录
   * @param {Object} credentials - { username, password }
   * @returns {Promise<{ token: string, user: Object }>}
   */
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },

  /**
   * 用户注册
   * @param {Object} data - { username, password, email }
   * @returns {Promise<{ token: string, user: Object }>}
   */
  register(data) {
    return apiClient.post('/auth/register', data)
  },

  /**
   * 获取当前用户信息
   * @returns {Promise<{ id, username, email, avatar, role, createdAt }>}
   */
  getProfile() {
    return apiClient.get('/auth/profile')
  },

  /**
   * 更新用户信息
   * @param {Object} data - { username?, email?, avatar? }
   */
  updateProfile(data) {
    return apiClient.put('/auth/profile', data)
  },

  /**
   * 第三方 OAuth 登录 (预留)
   * @param {string} provider - 'google' | 'github' | 'wechat'
   * @returns {Promise<{ redirectUrl: string }>}
   */
  oauthLogin(provider) {
    return apiClient.get(`/auth/oauth/${provider}`)
  },

  /**
   * 退出登录
   */
  logout() {
    return apiClient.post('/auth/logout')
  },

  /**
   * 刷新 token
   * @param {string} refreshToken
   */
  refreshToken(refreshToken) {
    return apiClient.post('/auth/refresh', { refreshToken })
  }
}
