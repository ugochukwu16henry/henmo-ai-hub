import { useEffect, useRef } from 'react'
import { websocketClient } from '@/lib/websocket'
import { useAuthStore } from '@/lib/auth'

export function useWebSocket() {
  const { user } = useAuthStore()
  const isConnected = useRef(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (user && !isConnected.current) {
      // Connect with user token
      websocketClient.connect(user.token || '')
      isConnected.current = true

      // Join default room (user's personal room)
      websocketClient.joinRoom(`user-${user.id}`)
    }

    return () => {
      if (isConnected.current) {
        websocketClient.disconnect()
        isConnected.current = false
      }
    }
  }, [user])

  const sendMessage = (content: string, roomId: string) => {
    websocketClient.sendMessage(content, roomId)
  }

  const startTyping = (roomId: string) => {
    websocketClient.startTyping(roomId)
    
    // Auto-stop typing after 3 seconds
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      websocketClient.stopTyping(roomId)
    }, 3000)
  }

  const stopTyping = (roomId: string) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    websocketClient.stopTyping(roomId)
  }

  const joinRoom = (roomId: string) => {
    websocketClient.joinRoom(roomId)
  }

  const onMessage = (callback: (message: any) => void) => {
    websocketClient.on('new_message', callback)
    return () => websocketClient.off('new_message', callback)
  }

  const onTyping = (callback: (data: any) => void) => {
    const startCallback = (data: any) => callback({ ...data, typing: true })
    const stopCallback = (data: any) => callback({ ...data, typing: false })
    
    websocketClient.on('typing_start', startCallback)
    websocketClient.on('typing_stop', stopCallback)
    
    return () => {
      websocketClient.off('typing_start', startCallback)
      websocketClient.off('typing_stop', stopCallback)
    }
  }

  const onPresence = (callback: (data: any) => void) => {
    websocketClient.on('presence_update', callback)
    return () => websocketClient.off('presence_update', callback)
  }

  return {
    sendMessage,
    startTyping,
    stopTyping,
    joinRoom,
    onMessage,
    onTyping,
    onPresence,
    isConnected: websocketClient.isConnected()
  }
}