const WebSocket = require('ws')
const jwt = require('jsonwebtoken')

class WebSocketService {
  constructor() {
    this.wss = null
    this.clients = new Map()
    this.rooms = new Map()
    this.typingUsers = new Map()
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ server })
    
    this.wss.on('connection', (ws, req) => {
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message)
          this.handleMessage(ws, data)
        } catch (error) {
          console.error('WebSocket message error:', error)
        }
      })

      ws.on('close', () => {
        this.handleDisconnect(ws)
      })
    })
  }

  handleMessage(ws, data) {
    switch (data.type) {
      case 'auth':
        this.authenticateClient(ws, data.token)
        break
      case 'join_room':
        this.joinRoom(ws, data.roomId)
        break
      case 'typing_start':
        this.handleTypingStart(ws, data.roomId)
        break
      case 'typing_stop':
        this.handleTypingStop(ws, data.roomId)
        break
      case 'message':
        this.broadcastMessage(ws, data)
        break
    }
  }

  authenticateClient(ws, token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      ws.userId = decoded.userId
      ws.user = decoded
      
      this.clients.set(ws.userId, {
        ws,
        user: decoded,
        lastSeen: new Date(),
        status: 'online'
      })

      this.broadcastPresence(ws.userId, 'online')
      
      ws.send(JSON.stringify({
        type: 'auth_success',
        userId: decoded.userId
      }))
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'auth_error',
        message: 'Invalid token'
      }))
    }
  }

  joinRoom(ws, roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set())
    }
    
    this.rooms.get(roomId).add(ws.userId)
    ws.currentRoom = roomId
    
    ws.send(JSON.stringify({
      type: 'room_joined',
      roomId
    }))
  }

  handleTypingStart(ws, roomId) {
    if (!this.typingUsers.has(roomId)) {
      this.typingUsers.set(roomId, new Set())
    }
    
    this.typingUsers.get(roomId).add(ws.userId)
    
    this.broadcastToRoom(roomId, {
      type: 'typing_start',
      userId: ws.userId,
      user: ws.user
    }, ws.userId)
  }

  handleTypingStop(ws, roomId) {
    if (this.typingUsers.has(roomId)) {
      this.typingUsers.get(roomId).delete(ws.userId)
    }
    
    this.broadcastToRoom(roomId, {
      type: 'typing_stop',
      userId: ws.userId
    }, ws.userId)
  }

  broadcastMessage(ws, data) {
    const message = {
      type: 'new_message',
      id: Date.now().toString(),
      content: data.content,
      userId: ws.userId,
      user: ws.user,
      timestamp: new Date().toISOString(),
      roomId: data.roomId
    }

    this.broadcastToRoom(data.roomId, message)
  }

  broadcastToRoom(roomId, message, excludeUserId = null) {
    if (!this.rooms.has(roomId)) return

    const roomUsers = this.rooms.get(roomId)
    
    roomUsers.forEach(userId => {
      if (userId !== excludeUserId && this.clients.has(userId)) {
        const client = this.clients.get(userId)
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(JSON.stringify(message))
        }
      }
    })
  }

  broadcastPresence(userId, status) {
    const message = {
      type: 'presence_update',
      userId,
      status,
      timestamp: new Date().toISOString()
    }

    this.clients.forEach((client, clientId) => {
      if (clientId !== userId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message))
      }
    })
  }

  handleDisconnect(ws) {
    if (ws.userId) {
      // Update presence
      if (this.clients.has(ws.userId)) {
        this.clients.get(ws.userId).status = 'offline'
        this.broadcastPresence(ws.userId, 'offline')
      }

      // Remove from rooms
      if (ws.currentRoom) {
        const room = this.rooms.get(ws.currentRoom)
        if (room) {
          room.delete(ws.userId)
          if (room.size === 0) {
            this.rooms.delete(ws.currentRoom)
          }
        }
      }

      // Remove from typing users
      this.typingUsers.forEach((users, roomId) => {
        if (users.has(ws.userId)) {
          users.delete(ws.userId)
          this.broadcastToRoom(roomId, {
            type: 'typing_stop',
            userId: ws.userId
          })
        }
      })

      this.clients.delete(ws.userId)
    }
  }

  getOnlineUsers() {
    const online = []
    this.clients.forEach((client, userId) => {
      if (client.status === 'online') {
        online.push({
          userId,
          user: client.user,
          lastSeen: client.lastSeen
        })
      }
    })
    return online
  }

  sendToUser(userId, message) {
    if (this.clients.has(userId)) {
      const client = this.clients.get(userId)
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message))
        return true
      }
    }
    return false
  }
}

module.exports = new WebSocketService()