import apiClient from './index.js'

/**
 * 学术论文相关 API
 */
export const papersApi = {
  /**
   * 获取论文列表
   * @param {Object} params - { page, pageSize, category?, keyword? }
   * @returns {Promise<{ list: Array, total: number, page: number }>}
   */
  getList(params) {
    return apiClient.get('/papers', { params })
  },

  /**
   * 获取论文详情
   * @param {string} id
   * @returns {Promise<{ id, title, abstract, authors, journal, year, doi, fullText }>}
   */
  getDetail(id) {
    return apiClient.get(`/papers/${id}`)
  },

  /**
   * 获取学者的论文列表
   * @param {string} scholarId
   * @param {Object} params
   */
  getByScholar(scholarId, params) {
    return apiClient.get(`/scholars/${scholarId}/papers`, { params })
  },

  /**
   * 全文搜索论文
   * @param {string} query
   * @param {Object} params
   */
  search(query, params) {
    return apiClient.get('/papers/search', { params: { q: query, ...params } })
  },

  /**
   * 用户收藏/取消收藏论文 (需登录)
   * @param {string} paperId
   */
  toggleFavorite(paperId) {
    return apiClient.post(`/papers/${paperId}/favorite`)
  },

  /**
   * 获取用户收藏列表 (需登录)
   */
  getFavorites() {
    return apiClient.get('/user/favorites/papers')
  }
}

/**
 * 学者资料 API
 */
export const scholarsApi = {
  /**
   * 获取学者列表
   * @param {Object} params
   */
  getList(params) {
    return apiClient.get('/scholars', { params })
  },

  /**
   * 获取学者详情
   * @param {string} id
   */
  getDetail(id) {
    return apiClient.get(`/scholars/${id}`)
  }
}
