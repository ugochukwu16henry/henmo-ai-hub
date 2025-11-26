import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-netinfo/netinfo'

interface OfflineAction {
  id: string
  type: 'chat' | 'upload' | 'sync'
  data: any
  timestamp: Date
}

export class OfflineService {
  private static readonly OFFLINE_QUEUE_KEY = 'offline_queue'
  private static readonly CACHED_DATA_KEY = 'cached_data'

  static async addToQueue(action: Omit<OfflineAction, 'id' | 'timestamp'>) {
    try {
      const queue = await this.getQueue()
      const newAction: OfflineAction = {
        ...action,
        id: Date.now().toString(),
        timestamp: new Date()
      }
      
      queue.push(newAction)
      await AsyncStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(queue))
    } catch (error) {
      console.error('Failed to add to offline queue:', error)
    }
  }

  static async getQueue(): Promise<OfflineAction[]> {
    try {
      const queueData = await AsyncStorage.getItem(this.OFFLINE_QUEUE_KEY)
      return queueData ? JSON.parse(queueData) : []
    } catch (error) {
      return []
    }
  }

  static async processQueue() {
    try {
      const netInfo = await NetInfo.fetch()
      if (!netInfo.isConnected) return

      const queue = await this.getQueue()
      const processedIds: string[] = []

      for (const action of queue) {
        try {
          await this.processAction(action)
          processedIds.push(action.id)
        } catch (error) {
          console.error('Failed to process action:', error)
        }
      }

      // Remove processed actions
      const remainingQueue = queue.filter(action => !processedIds.includes(action.id))
      await AsyncStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(remainingQueue))
    } catch (error) {
      console.error('Failed to process offline queue:', error)
    }
  }

  private static async processAction(action: OfflineAction) {
    switch (action.type) {
      case 'chat':
        // Process offline chat messages
        break
      case 'upload':
        // Process offline uploads
        break
      case 'sync':
        // Process sync actions
        break
    }
  }

  static async cacheData(key: string, data: any) {
    try {
      const cached = await this.getCachedData()
      cached[key] = { data, timestamp: new Date() }
      await AsyncStorage.setItem(this.CACHED_DATA_KEY, JSON.stringify(cached))
    } catch (error) {
      console.error('Failed to cache data:', error)
    }
  }

  static async getCachedData(key?: string) {
    try {
      const cachedData = await AsyncStorage.getItem(this.CACHED_DATA_KEY)
      const parsed = cachedData ? JSON.parse(cachedData) : {}
      return key ? parsed[key]?.data : parsed
    } catch (error) {
      return key ? null : {}
    }
  }

  static async clearCache() {
    await AsyncStorage.removeItem(this.CACHED_DATA_KEY)
  }
}