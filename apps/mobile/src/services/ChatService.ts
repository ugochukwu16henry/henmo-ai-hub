import { AuthService } from './AuthService'
import { OfflineService } from './OfflineService'
import NetInfo from '@react-native-netinfo/netinfo'

export class ChatService {
  private static readonly API_BASE = 'https://api.henmo.ai'

  static async sendMessage(message: string): Promise<string> {
    try {
      const netInfo = await NetInfo.fetch()
      
      if (!netInfo.isConnected) {
        await OfflineService.addToQueue({
          type: 'chat',
          data: { message, timestamp: new Date() }
        })
        return 'Message queued for when you\'re back online'
      }

      const token = await AuthService.getToken()
      const response = await fetch(`${this.API_BASE}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      })

      const data = await response.json()
      return data.response || 'No response received'
    } catch (error) {
      console.error('Chat service error:', error)
      throw error
    }
  }

  static async getConversationHistory(): Promise<any[]> {
    try {
      const netInfo = await NetInfo.fetch()
      
      if (!netInfo.isConnected) {
        return await OfflineService.getCachedData('conversations') || []
      }

      const token = await AuthService.getToken()
      const response = await fetch(`${this.API_BASE}/chat/conversations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const conversations = await response.json()
      await OfflineService.cacheData('conversations', conversations)
      return conversations
    } catch (error) {
      console.error('Failed to get conversation history:', error)
      return []
    }
  }
}