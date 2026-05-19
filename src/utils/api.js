import axios from 'axios'

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

// Attach token from localStorage to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken')
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

export default api
