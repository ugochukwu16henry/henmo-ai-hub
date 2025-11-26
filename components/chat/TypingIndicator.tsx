'use client'

import { useState, useEffect } from 'react'
import { websocketClient } from '@/lib/websocket'

interface TypingUser {
  userId: string
  user: {
    name: string
    avatar?: string
  }
}

export function TypingIndicator({ roomId }: { roomId: string }) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])

  useEffect(() => {
    const handleTypingStart = (message: any) => {
      if (message.roomId === roomId) {
        setTypingUsers(prev => {
          const exists = prev.find(u => u.userId === message.userId)
          if (!exists) {
            return [...prev, { userId: message.userId, user: message.user }]
          }
          return prev
        })
      }
    }

    const handleTypingStop = (message: any) => {
      setTypingUsers(prev => prev.filter(u => u.userId !== message.userId))
    }

    websocketClient.on('typing_start', handleTypingStart)
    websocketClient.on('typing_stop', handleTypingStop)

    return () => {
      websocketClient.off('typing_start', handleTypingStart)
      websocketClient.off('typing_stop', handleTypingStop)
    }
  }, [roomId])

  if (typingUsers.length === 0) return null

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].user.name} is typing...`
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].user.name} and ${typingUsers[1].user.name} are typing...`
    } else {
      return `${typingUsers.length} people are typing...`
    }
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span>{getTypingText()}</span>
    </div>
  )
}