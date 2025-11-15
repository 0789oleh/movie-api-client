import api from './axios'

export const moviesApi = {
  getAll: (params) => api.get('/movies', { params }).then(res => res.data),
  getById: (id) => api.get(`/movies/${id}`).then(res => res.data),
  create: (data) => api.post('/movies', data).then(res => res.data),
  update: (id, data) => api.put(`/movies/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/movies/${id}`),
  import: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/movies/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data)
  },
}