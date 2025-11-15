import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { moviesApi } from '../api/movies'

export default function ImportPage() {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const queryClient = useQueryClient()

  const importMutation = useMutation({
    mutationFn: (file) => moviesApi.import(file),
    onSuccess: () => {
      queryClient.invalidateQueries(['movies'])
      setFile(null)
    },
  })

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0]
      if (file.name.endsWith('.txt')) {
        setFile(file)
      } else {
        alert('Only .txt files allowed!')
      }
    }
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file && file.name.endsWith('.txt')) {
      setFile(file)
    } else {
      alert('Only .txt files allowed!')
    }
  }

  const handleSubmit = () => {
    if (file) {
      importMutation.mutate(file)
    }
  }

  const { data, isPending, isError, error } = importMutation

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Import Movies (.txt)</h1>

      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-6xl">Upload</div>
          <p className="text-gray-600">
            Drag & drop your .txt file here, or click to select
          </p>
          <input
            type="file"
            accept=".txt"
            onChange={handleChange}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Choose File
          </label>
        </div>
      </div>

      {file && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
          <span className="font-medium">{file.name}</span>
          <button
            onClick={() => setFile(null)}
            className="text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!file || isPending}
        className="mt-6 w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Importing...' : 'Start Import'}
      </button>

      {/* Результат */}
      {data && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            Import Complete!
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Imported:</span>{' '}
              <span className="text-green-700">{data.data.imported}</span>
            </div>
            <div>
              <span className="font-medium">Failed:</span>{' '}
              <span className="text-red-700">{data.data.failed}</span>
            </div>
          </div>
          {data.data.errors?.length > 0 && (
            <div className="mt-4">
              <p className="font-medium text-red-700 mb-2">
                First {data.data.errors.length} errors:
              </p>
              <ul className="text-xs space-y-1">
                {data.data.errors.map((err, i) => (
                  <li key={i} className="text-red-600">
                    <span className="font-mono bg-red-100 px-1 rounded">
                    {err.preview}
                    </span>{' '}
                    → {err.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {isError && (
        <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">
            {error?.response?.data?.message || 'Import failed'}
          </p>
        </div>
      )}
    </div>
  )
}