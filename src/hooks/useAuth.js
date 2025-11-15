import { useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth'

export const useAuth = () => {
  const queryClient = useQueryClient()

  const login = async (email, password) => {
    const data = await authApi.login(email, password)
    authApi.setAccessToken(data.token)
    return data
  }

  const logout = async () => {
    await authApi.logout()
    queryClient.clear()
    authApi.setAccessToken('')
  }

  return { login, logout }
}