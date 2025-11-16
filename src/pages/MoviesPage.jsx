// src/pages/MoviesPage.jsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { moviesApi } from '../api/movies'
import { Link } from 'react-router-dom'

export default function MoviesPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', page],
    queryFn: () => moviesApi.getAll({ page, limit }),
    keepPreviousData: true, // Плавный переход между страницами
  })

  const movies = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  if (isLoading) return <div className="p-8 text-center">Loading...</div>
  if (isError) return <div className="p-8 text-center text-red-600">Error loading movies</div>

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Movies</h1>
        <Link
          to="/import"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Import
        </Link>
      </div>

      {/* Список */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {movies.map(movie => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-blue-700 hover:underline">
              {movie.title}
            </h3>
            <p className="text-gray-600">{movie.year} • {movie.format}</p>
            <p className="text-sm text-gray-500 mt-2">
              {movie.actors?.slice(0, 2).join(', ')}
              {movie.actors?.length > 2 && ` +${movie.actors.length - 2}`}
            </p>
          </Link>
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Previous
          </button>

          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}

      <p className="text-center text-sm text-gray-500 mt-4">
        Page {page} of {totalPages} ({total} movies)
      </p>
    </div>
  )
}