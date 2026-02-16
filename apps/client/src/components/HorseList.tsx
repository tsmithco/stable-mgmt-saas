import React, { useState, useEffect } from 'react'
import { Horse, horses } from '../api'
import HorseForm from './HorseForm'

export default function HorseList() {
  const [horseList, setHorseList] = useState<Horse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const loadHorses = async () => {
    try {
      setLoading(true)
      const response = await horses.list()
      setHorseList(response.data.data)
      setError(null)
    } catch (err) {
      setError('Failed to load horses')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHorses()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this horse?')) return

    try {
      await horses.delete(id)
      setHorseList(horseList.filter((h) => h.id !== id))
    } catch (err) {
      setError('Failed to delete horse')
      console.error(err)
    }
  }

  const handleHorseCreated = () => {
    setShowForm(false)
    loadHorses()
  }

  if (loading) {
    return <div className="text-center py-8">Loading horses...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Horses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Horse'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {showForm && <HorseForm onSuccess={handleHorseCreated} />}

      {horseList.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No horses yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {horseList.map((horse) => (
            <div
              key={horse.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{horse.name}</h2>
                  <p className="text-gray-600">
                    {horse.breed} • Age: {horse.age} • Color: {horse.color}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(horse.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
