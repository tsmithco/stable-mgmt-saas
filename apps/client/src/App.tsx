import React, { useState } from 'react'
import HorseList from './components/HorseList'
import { setOrgContext } from './api'

function App() {
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId') || 'org-456')
  const [userId, setUserId] = useState(
    localStorage.getItem('userId') || 'user-123'
  )
  const [showOrgSettings, setShowOrgSettings] = useState(false)

  const handleOrgChange = () => {
    setOrgContext(orgId, userId)
    setShowOrgSettings(false)
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Stable Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">Org: {orgId}</p>
          </div>
          <button
            onClick={() => setShowOrgSettings(!showOrgSettings)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Settings
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {showOrgSettings && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Organization Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Organization ID
                </label>
                <input
                  type="text"
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User ID
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
                <p>
                  💡 Tip: Change the org ID to test multi-tenancy. Each org has
                  separate horses.
                </p>
              </div>
              <button
                onClick={handleOrgChange}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply Settings
              </button>
            </div>
          </div>
        )}

        <HorseList />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>Stable Management SaaS v0.1.0</p>
        </div>
      </footer>
    </div>
  )
}

export default App
