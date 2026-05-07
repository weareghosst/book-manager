// frontend/src/services/livros.js
import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default {
  listar: () => api.get('/livros'),
  buscar: (id) => api.get(`/livros/${id}`),
  criar: (dados) => api.post('/livros', dados),
  atualizar: (id, dados) => api.put(`/livros/${id}`, dados),
  remover: (id) => api.delete(`/livros/${id}`),
}