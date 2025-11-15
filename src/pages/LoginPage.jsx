import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('petro@gmail.com')
  const [password, setPassword] = useState('super-password')
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (isRegister) {
        await fetch('http://localhost:8000/api/v1/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, password, confirmPassword: confirm }),
          credentials: 'include',
        })
      }
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Invalid credentials or server error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">{isRegister ? 'Register' : 'Login'}</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
          {isRegister && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="input"
              required
            />
          )}
          <button type="submit" className="w-full btn btn-primary">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 hover:underline"
          >
            {isRegister ? 'Already have account? Login' : "Don't have account? Register"}
          </button>
        </p>
      </div>
    </div>
  )
}