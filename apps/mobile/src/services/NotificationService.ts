import PushNotification from 'react-native-push-notification'

export class NotificationService {
  static init() {
    PushNotification.configure({
      onRegister: (token) => {
        console.log('Push token:', token)
        this.sendTokenToServer(token.token)
      },
      
      onNotification: (notification) => {
        console.log('Notification received:', notification)
        
        if (notification.userInteraction) {
          // Handle notification tap
          this.handleNotificationTap(notification)
        }
      },
      
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      
      popInitialNotification: true,
      requestPermissions: true,
    })

    this.createChannels()
  }

  private static createChannels() {
    PushNotification.createChannel(
      {
        channelId: 'henmo-chat',
        channelName: 'Chat Messages',
        channelDescription: 'Notifications for new chat messages',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      () => {}
    )

    PushNotification.createChannel(
      {
        channelId: 'henmo-system',
        channelName: 'System Updates',
        channelDescription: 'System notifications and updates',
        soundName: 'default',
        importance: 3,
        vibrate: false,
      },
      () => {}
    )
  }

  static showLocalNotification(title: string, message: string, channelId = 'henmo-system') {
    PushNotification.localNotification({
      channelId,
      title,
      message,
      playSound: true,
      soundName: 'default',
      actions: ['Reply', 'Dismiss'],
    })
  }

  static scheduleNotification(title: string, message: string, date: Date) {
    PushNotification.localNotificationSchedule({
      channelId: 'henmo-system',
      title,
      message,
      date,
      playSound: true,
      soundName: 'default',
    })
  }

  private static async sendTokenToServer(token: string) {
    try {
      await fetch('https://api.henmo.ai/notifications/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, platform: 'mobile' })
      })
    } catch (error) {
      console.error('Failed to register push token:', error)
    }
  }

  private static handleNotificationTap(notification: any) {
    // Navigate to appropriate screen based on notification type
    if (notification.data?.type === 'chat') {
      // Navigate to chat screen
    } else if (notification.data?.type === 'street') {
      // Navigate to street verification
    }
  }

  static clearAllNotifications() {
    PushNotification.cancelAllLocalNotifications()
  }
}