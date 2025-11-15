import api from './axios'

export const authApi = {
  login: (email, password) =>
    api.post('/sessions', { email, password }).then(res => res.data),

  register: (email, name, password, confirmPassword) =>
    api.post('/users', { email, name, password, confirmPassword }).then(res => res.data),

  logout: () => api.post('/auth/logout').then(() => {
    localStorage.removeItem('accessToken')
  }),

  // Токен храним в памяти
  setAccessToken: (token) => {
    localStorage.setItem('accessToken', token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  },

  getAccessToken: () => localStorage.getItem('accessToken'),
}