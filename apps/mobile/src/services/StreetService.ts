import { AuthService } from './AuthService'
import { OfflineService } from './OfflineService'
import NetInfo from '@react-native-netinfo/netinfo'

export class StreetService {
  private static readonly API_BASE = 'https://api.henmo.ai'

  static async uploadStreetPhoto(uri: string, base64?: string) {
    try {
      const netInfo = await NetInfo.fetch()
      
      if (!netInfo.isConnected) {
        await OfflineService.addToQueue({
          type: 'upload',
          data: { uri, base64, timestamp: new Date() }
        })
        return { success: true, message: 'Photo queued for upload' }
      }

      const token = await AuthService.getToken()
      const formData = new FormData()
      
      formData.append('image', {
        uri,
        type: 'image/jpeg',
        name: 'street-photo.jpg',
      } as any)

      const response = await fetch(`${this.API_BASE}/streets/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      return await response.json()
    } catch (error) {
      console.error('Street upload error:', error)
      throw error
    }
  }

  static async getStreetPhotos(location?: { lat: number, lng: number }) {
    try {
      const netInfo = await NetInfo.fetch()
      
      if (!netInfo.isConnected) {
        return await OfflineService.getCachedData('street-photos') || []
      }

      const token = await AuthService.getToken()
      const params = location ? `?lat=${location.lat}&lng=${location.lng}` : ''
      
      const response = await fetch(`${this.API_BASE}/streets${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const photos = await response.json()
      await OfflineService.cacheData('street-photos', photos)
      return photos
    } catch (error) {
      console.error('Failed to get street photos:', error)
      return []
    }
  }
}