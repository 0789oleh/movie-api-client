import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { moviesApi } from '../api/movies'

export default function MovieDetail() {
  const { id } = useParams()
  const [isEdit, setIsEdit] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => moviesApi.getById(id),
  })

  const movie = data?.data

  const updateMutation = useMutation({
    mutationFn: (data) => moviesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['movie', id])
      queryClient.invalidateQueries(['movies'])
      setIsEdit(false)
    },
  })

  if (isLoading) return <div className="p-8 text-center">Loading...</div>
  if (!movie) return <div className="p-8 text-center">Movie not found</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <div className="space-x-2">
            <button
              onClick={() => setIsEdit(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <Link
              to="/"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Back
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Year:</span> {movie.year}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Format:</span> {movie.format}
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">Actors:</p>
            <p className="text-gray-600">
              {movie.actors?.length > 0 ? movie.actors.join(', ') : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEdit && (
        <EditModal
          movie={movie}
          onClose={() => setIsEdit(false)}
          onSave={(data) => updateMutation.mutate(data)}
          isSaving={updateMutation.isPending}
        />
      )}
    </div>
  )
}

// Модалка редактирования
function EditModal({ movie, onClose, onSave, isSaving }) {
  const [form, setForm] = useState({
    title: movie.title,
    releaseYear: movie.year,
    format: movie.format,
    genres: movie.genres?.join(', ') || '',
    actors: movie.actors?.join(', ') || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      title: form.title,
      releaseYear: parseInt(form.releaseYear),
      format: form.format,
      genres: form.genres.split(',').map(s => s.trim()).filter(Boolean),
      actors: form.actors.split(',').map(s => s.trim()).filter(Boolean),
    }
    onSave(data)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Edit Movie</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Year</label>
            <input
              type="number"
              value={form.releaseYear}
              onChange={(e) => setForm({ ...form, releaseYear: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Format</label>
            <select
              value={form.format}
              onChange={(e) => setForm({ ...form, format: e.target.value })}
              className="input"
            >
              <option>DVD</option>
              <option>VHS</option>
              <option>Blu-ray</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Genres (comma separated)</label>
            <input
              value={form.genres}
              onChange={(e) => setForm({ ...form, genres: e.target.value })}
              className="input"
              placeholder="Sci-Fi, Thriller"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Actors (comma separated)</label>
            <input
              value={form.actors}
              onChange={(e) => setForm({ ...form, actors: e.target.value })}
              className="input"
              placeholder="Leonardo DiCaprio, Tom Hanks"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 btn btn-primary disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}