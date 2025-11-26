import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ChatScreen } from './src/screens/ChatScreen'
import { CameraScreen } from './src/screens/CameraScreen'
import { NotificationService } from './src/services/NotificationService'
import { OfflineService } from './src/services/OfflineService'

const Stack = createStackNavigator()

const App = () => {
  useEffect(() => {
    NotificationService.init()
    
    // Process offline queue when app starts
    OfflineService.processQueue()
    
    // Set up periodic sync
    const syncInterval = setInterval(() => {
      OfflineService.processQueue()
    }, 30000) // Every 30 seconds

    return () => clearInterval(syncInterval)
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Chat">
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen}
          options={{ title: 'HenMo AI Chat' }}
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen}
          options={{ title: 'Street Photos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App