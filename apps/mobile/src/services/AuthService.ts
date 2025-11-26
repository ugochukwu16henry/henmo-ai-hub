import AsyncStorage from '@react-native-async-storage/async-storage'
import ReactNativeBiometrics from 'react-native-biometrics'

export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token'
  private static readonly USER_KEY = 'user_data'

  static async login(email: string, password: string) {
    try {
      const response = await fetch('https://api.henmo.ai/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      
      if (data.token) {
        await AsyncStorage.setItem(this.TOKEN_KEY, data.token)
        await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(data.user))
        return data
      }
      
      throw new Error(data.message || 'Login failed')
    } catch (error) {
      throw error
    }
  }

  static async biometricLogin() {
    try {
      const rnBiometrics = new ReactNativeBiometrics()
      const { available } = await rnBiometrics.isSensorAvailable()
      
      if (!available) {
        throw new Error('Biometric authentication not available')
      }

      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate with biometrics'
      })

      if (success) {
        const token = await AsyncStorage.getItem(this.TOKEN_KEY)
        const userData = await AsyncStorage.getItem(this.USER_KEY)
        
        if (token && userData) {
          return { token, user: JSON.parse(userData) }
        }
      }
      
      throw new Error('Biometric authentication failed')
    } catch (error) {
      throw error
    }
  }

  static async logout() {
    await AsyncStorage.multiRemove([this.TOKEN_KEY, this.USER_KEY])
  }

  static async getToken() {
    return await AsyncStorage.getItem(this.TOKEN_KEY)
  }

  static async getUser() {
    const userData = await AsyncStorage.getItem(this.USER_KEY)
    return userData ? JSON.parse(userData) : null
  }

  static async isAuthenticated() {
    const token = await this.getToken()
    return !!token
  }
}