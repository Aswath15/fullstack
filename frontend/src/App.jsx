import { useState, useEffect } from 'react'
import UploadArea from './components/UploadArea'
import NotificationCenter from './components/NotificationCenter'
import DocumentList from './components/DocumentList'
import { fetchDocuments } from './services/api'

function App() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadDocuments()
    setupWebSocket()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const data = await fetchDocuments()
      setDocuments(data)
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/notifications`)
    
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data)
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
      loadDocuments()
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }

  const handleUploadSuccess = () => {
    loadDocuments()
  }

  const handleNotificationsUpdate = (newNotifications, unread) => {
    setNotifications(newNotifications)
    setUnreadCount(unread)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
              <p className="text-gray-600 mt-1">Manage and track your PDF documents</p>
            </div>
            <NotificationCenter 
              unreadCount={unreadCount}
              notifications={notifications}
              onNotificationsUpdate={handleNotificationsUpdate}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Documents</h2>
              <UploadArea onUploadSuccess={handleUploadSuccess} />
            </div>
          </div>

          {/* Documents Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Documents</h2>
              <DocumentList documents={documents} loading={loading} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
