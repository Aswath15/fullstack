import { useState, useEffect } from 'react'
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/api'
import NotificationPanel from './NotificationPanel'

function NotificationCenter({ unreadCount, notifications, onNotificationsUpdate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [localNotifications, setLocalNotifications] = useState(notifications)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLocalNotifications(notifications)
  }, [notifications])

  const handleOpen = async () => {
    setIsOpen(!isOpen)
    if (!isOpen && localNotifications.length === 0) {
      loadNotifications()
    }
  }

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await fetchNotifications()
      setLocalNotifications(data)
      
      const unread = data.filter(n => !n.isRead).length
      onNotificationsUpdate(data, unread)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id)
      const updated = localNotifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
      setLocalNotifications(updated)
      
      const unread = updated.filter(n => !n.isRead).length
      onNotificationsUpdate(updated, unread)
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      const updated = localNotifications.map(n => ({ ...n, isRead: true }))
      setLocalNotifications(updated)
      onNotificationsUpdate(updated, 0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={handleOpen}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <NotificationPanel
          notifications={localNotifications}
          loading={loading}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default NotificationCenter
