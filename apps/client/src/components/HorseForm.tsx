import React, { useState } from 'react'
import { horses } from '../api'

interface HorseFormProps {
  onSuccess: () => void
}

export default function HorseForm({ onSuccess }: HorseFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    color: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name || !formData.breed || !formData.age) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      await horses.create({
        name: formData.name,
        breed: formData.breed,
        age: parseInt(formData.age),
        color: formData.color || undefined
      })
      onSuccess()
    } catch (err) {
      setError('Failed to create horse')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gray-50 rounded-lg border border-gray-200"
    >
      <h2 className="text-2xl font-semibold mb-4">Add New Horse</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Thunder"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Breed *
          </label>
          <select
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a breed</option>
            <option value="Arabian">Arabian</option>
            <option value="Thoroughbred">Thoroughbred</option>
            <option value="Quarter Horse">Quarter Horse</option>
            <option value="Mustang">Mustang</option>
            <option value="Paint">Paint</option>
            <option value="Warmblood">Warmblood</option>
            <option value="Draft">Draft</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Age *
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 5"
            min="0"
            max="50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Black, Chestnut"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Create Horse'}
        </button>
      </div>
    </form>
  )
}
