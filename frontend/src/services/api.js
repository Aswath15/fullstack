import axios from 'axios'

const API_BASE = '/api'

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
})

export const uploadFiles = async (files) => {
  const formData = new FormData()
  files.forEach(file => {
    formData.append('files', file)
  })

  try {
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

export const fetchDocuments = async () => {
  try {
    const response = await apiClient.get('/documents')
    return response.data
  } catch (error) {
    console.error('Fetch documents error:', error)
    throw error
  }
}

export const downloadDocument = async (id) => {
  try {
    const response = await apiClient.get(`/download/${id}`, {
      responseType: 'blob',
    })
    return response.data
  } catch (error) {
    console.error('Download error:', error)
    throw error
  }
}

export const fetchNotifications = async () => {
  try {
    const response = await apiClient.get('/notifications')
    return response.data
  } catch (error) {
    console.error('Fetch notifications error:', error)
    throw error
  }
}

export const markNotificationAsRead = async (id) => {
  try {
    const response = await apiClient.put(`/notifications/${id}/read`)
    return response.data
  } catch (error) {
    console.error('Mark as read error:', error)
    throw error
  }
}

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await apiClient.put('/notifications/read-all')
    return response.data
  } catch (error) {
    console.error('Mark all as read error:', error)
    throw error
  }
}

export default apiClient
