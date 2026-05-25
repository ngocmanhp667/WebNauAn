import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Tự động thêm Token JWT vào header nếu có trong localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token =
      window.localStorage.getItem('accessToken') ||
      window.localStorage.getItem('authToken') ||
      window.localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

export default api
