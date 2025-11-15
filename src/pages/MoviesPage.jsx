import { useQuery } from '@tanstack/react-query'
import { moviesApi } from '../api/movies'
import { Link } from 'react-router-dom'

export default function MoviesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: () => moviesApi.getAll({ page: 1, limit: 10 }),
  })

  if (isLoading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Movies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.map(movie => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold">{movie.title}</h3>
            <p className="text-gray-600">{movie.year} • {movie.format}</p>
            <p className="text-sm text-gray-500 mt-2">
              {movie.actors?.slice(0, 2).join(', ')}{movie.actors?.length > 2 && '...'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}