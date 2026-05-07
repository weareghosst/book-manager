// frontend/src/services/auth.js
import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000' })

export default {
  registrar: (dados) => api.post('/auth/register', dados),
  login: (dados) => api.post('/auth/login', dados),
}