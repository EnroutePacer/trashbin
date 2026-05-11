import apiClient from './index.js'

/**
 * 海洋数据相关 API
 */
export const oceanApi = {
  /**
   * 获取海洋知识模块列表
   * @returns {Promise<Array>}
   */
  getKnowledgeModules() {
    return apiClient.get('/ocean/knowledge-modules')
  },

  /**
   * 获取单个知识模块详情
   * @param {string} id
   */
  getKnowledgeModuleDetail(id) {
    return apiClient.get(`/ocean/knowledge-modules/${id}`)
  },

  /**
   * 获取实时海洋数据 (如海温、洋流)
   * @param {Object} params - { lat, lng, type }
   * @returns {Promise<{ temperature, current, salinity, ... }>}
   */
  getRealtimeData(params) {
    return apiClient.get('/ocean/realtime', { params })
  },

  /**
   * 获取水汽溯源数据
   * @param {Object} params - { lat, lng }
   * @returns {Promise<{ origin, path, ... }>}
   */
  getVaporTrace(params) {
    return apiClient.get('/ocean/vapor-trace', { params })
  },

  /**
   * 获取官方海洋机构链接
   * @returns {Promise<Array<{ name, url, description }>>}
   */
  getOfficialLinks() {
    return apiClient.get('/ocean/official-links')
  },

  /**
   * 获取海洋统计数据概览
   * @returns {Promise<{ oceanArea, avgDepth, speciesCount, ... }>}
   */
  getStatistics() {
    return apiClient.get('/ocean/statistics')
  },

  /**
   * 提交用户评论/讨论
   * @param {Object} data - { paperId?, moduleId?, content }
   */
  submitComment(data) {
    return apiClient.post('/ocean/comments', data)
  },

  /**
   * 获取评论列表
   * @param {Object} params - { targetId, targetType, page }
   */
  getComments(params) {
    return apiClient.get('/ocean/comments', { params })
  }
}
