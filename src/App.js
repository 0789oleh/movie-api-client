import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import MoviesPage from './pages/MoviesPage'
import LoginPage from './pages/LoginPage'
import MovieDetail from './pages/MovieDetail'
import ImportPage from './pages/ImportPage'
import RequireAuth from './components/RequireAuth'
import { authApi } from './api/auth'

const queryClient = new QueryClient()

function App() {
  const token = authApi.getAccessToken()

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          {token && (
            <nav className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between">
                <Link to="/" className="text-xl font-bold text-blue-600">Movies SPA</Link>
                <div className="space-x-4">
                  <Link to="/" className="text-gray-700 hover:text-blue-600">Movies</Link>
                  <Link to="/import" className="text-gray-700 hover:text-blue-600">Import</Link>
                  <button
                    onClick={() => authApi.logout().then(() => window.location.href = '/login')}
                    className="text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </nav>
          )}

          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<RequireAuth />}>
              <Route path="/" element={<MoviesPage />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/import" element={<ImportPage />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App