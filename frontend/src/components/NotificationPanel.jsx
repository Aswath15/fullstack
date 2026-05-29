function NotificationPanel({
  notifications,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    
    return date.toLocaleDateString()
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      default:
        return 'ℹ'
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const getNotificationIconColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      case 'warning':
        return 'text-yellow-600'
      default:
        return 'text-blue-600'
    }
  }

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Toolbar */}
      {notifications.length > 0 && (
        <div className="border-b border-gray-200 px-4 py-2 bg-gray-50 flex justify-between items-center">
          <span className="text-xs text-gray-600">
            {notifications.filter(n => !n.isRead).length} unread
          </span>
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
      )}

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin-custom inline-block text-blue-600 text-2xl mb-2">⟳</div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
              onClick={() => {
                if (!notification.isRead) {
                  onMarkAsRead(notification.id)
                }
              }}
            >
              <div className="flex gap-3">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    getNotificationIcon(notification.type) === '✓'
                      ? 'bg-green-100 text-green-600'
                      : getNotificationIcon(notification.type) === '✕'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>

                {!notification.isRead && (
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-gray-200 p-3 text-center bg-gray-50">
          <button className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
            View all notifications
          </button>
        </div>
      )}
    </div>
  )
}

export default NotificationPanel
