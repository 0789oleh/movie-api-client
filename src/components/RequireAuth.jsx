import { Navigate } from 'react-router-dom'
import { authApi } from './../api/auth'

export default function RequireAuth({ children }) {
  const token = authApi.getAccessToken()
  return token ? children : <Navigate to="/login" />
}