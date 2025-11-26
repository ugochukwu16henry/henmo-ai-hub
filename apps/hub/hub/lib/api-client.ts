class APIClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://api.henmo.ai' 
      : 'http://localhost:3001'
  }

  setToken(token: string) {
    this.token = token
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  // Analytics
  async trackEvent(event: string, properties: any = {}) {
    return this.request('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ event, properties })
    })
  }

  async getUserStats(days = 30) {
    return this.request(`/api/analytics/user-stats?days=${days}`)
  }

  async getConversationTrends(days = 7) {
    return this.request(`/api/analytics/conversation-trends?days=${days}`)
  }

  // Email
  async sendVerificationEmail(email: string) {
    return this.request('/api/email/verification', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  }

  async sendPasswordReset(email: string) {
    return this.request('/api/email/password-reset', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  }

  // File Upload
  async uploadFile(file: File, folder = 'uploads') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    return this.request('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {} // Remove Content-Type to let browser set it
    })
  }

  async deleteFile(key: string) {
    return this.request(`/api/upload/${key}`, {
      method: 'DELETE'
    })
  }

  // WebSocket
  async getOnlineUsers() {
    return this.request('/api/websocket/online-users')
  }

  async sendNotification(userId: string, message: string) {
    return this.request('/api/websocket/send-notification', {
      method: 'POST',
      body: JSON.stringify({ userId, message })
    })
  }
}

export const apiClient = new APIClient()