'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { websocketClient } from '@/lib/websocket'

interface User {
  userId: string
  user: {
    name: string
    avatar?: string
  }
  status: 'online' | 'offline'
  lastSeen?: string
}

export function PresenceIndicator() {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])

  useEffect(() => {
    const handlePresenceUpdate = (message: any) => {
      setOnlineUsers(prev => {
        const filtered = prev.filter(u => u.userId !== message.userId)
        if (message.status === 'online') {
          return [...filtered, {
            userId: message.userId,
            user: message.user,
            status: 'online'
          }]
        }
        return filtered
      })
    }

    websocketClient.on('presence_update', handlePresenceUpdate)

    // Fetch initial online users
    fetch('/api/websocket/online-users')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOnlineUsers(data.users.map((u: any) => ({
            ...u,
            status: 'online'
          })))
        }
      })
      .catch(console.error)

    return () => {
      websocketClient.off('presence_update', handlePresenceUpdate)
    }
  }, [])

  return (
    <div className="flex items-center gap-2 p-4 border-b">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-sm font-medium">
          {onlineUsers.length} online
        </span>
      </div>
      
      <div className="flex gap-1 overflow-x-auto">
        {onlineUsers.slice(0, 5).map(user => (
          <Badge key={user.userId} variant="secondary" className="text-xs">
            {user.user.name}
          </Badge>
        ))}
        {onlineUsers.length > 5 && (
          <Badge variant="outline" className="text-xs">
            +{onlineUsers.length - 5}
          </Badge>
        )}
      </div>
    </div>
  )
}