interface WebSocketMessage {
  type: string
  [key: string]: any
}

class WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners: Map<string, Function[]> = new Map()

  connect(token: string) {
    try {
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? 'wss://api.henmo.ai/ws' 
        : 'ws://localhost:3001/ws'
      
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
        this.authenticate(token)
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (error) {
          console.error('WebSocket message parse error:', error)
        }
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.attemptReconnect(token)
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
    }
  }

  private authenticate(token: string) {
    this.send({
      type: 'auth',
      token
    })
  }

  private handleMessage(message: WebSocketMessage) {
    const listeners = this.listeners.get(message.type) || []
    listeners.forEach(listener => listener(message))
  }

  private attemptReconnect(token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect(token)
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  joinRoom(roomId: string) {
    this.send({
      type: 'join_room',
      roomId
    })
  }

  sendMessage(content: string, roomId: string) {
    this.send({
      type: 'message',
      content,
      roomId
    })
  }

  startTyping(roomId: string) {
    this.send({
      type: 'typing_start',
      roomId
    })
  }

  stopTyping(roomId: string) {
    this.send({
      type: 'typing_stop',
      roomId
    })
  }

  on(eventType: string, callback: Function) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    this.listeners.get(eventType)!.push(callback)
  }

  off(eventType: string, callback: Function) {
    const listeners = this.listeners.get(eventType) || []
    const index = listeners.indexOf(callback)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }
}

export const websocketClient = new WebSocketClient()