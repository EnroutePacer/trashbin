import apiClient from './index.js'

/**
 * 文件上传相关 API
 */
export const uploadApi = {
  /**
   * 上传海洋照片/印记
   * @param {FormData} formData - { photo: File, location: string, description?: string, lat?, lng? }
   * @returns {Promise<{ id, photoUrl, location, createdAt }>}
   */
  uploadOceanMark(formData) {
    return apiClient.post('/ocean/marks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000
    })
  },

  /**
   * 获取海洋印记列表 (地图标记)
   * @param {Object} params - { bounds?, page, pageSize }
   * @returns {Promise<{ list: Array, total: number }>}
   */
  getOceanMarks(params) {
    return apiClient.get('/ocean/marks', { params })
  },

  /**
   * 获取单个海洋印记详情
   * @param {string} id
   */
  getOceanMarkDetail(id) {
    return apiClient.get(`/ocean/marks/${id}`)
  },

  /**
   * 删除自己的印记 (需登录)
   * @param {string} id
   */
  deleteOceanMark(id) {
    return apiClient.delete(`/ocean/marks/${id}`)
  },

  /**
   * 点赞某个印记
   * @param {string} id
   */
  likeOceanMark(id) {
    return apiClient.post(`/ocean/marks/${id}/like`)
  }
}
