# HenMo AI Mobile App

React Native mobile application for iOS and Android with AI chat, camera integration, and offline capabilities.

## Features

- **Mobile-Optimized Chat**: Touch-friendly interface with voice input
- **Camera Integration**: Street photo capture and upload
- **Biometric Authentication**: Fingerprint/Face ID login
- **Offline Mode**: Queue actions when offline, sync when online
- **Push Notifications**: Real-time notifications for chat and updates
- **Voice Input**: Speech-to-text for hands-free messaging

## Setup

```bash
# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Architecture

- **Screens**: Chat, Camera, Authentication
- **Services**: Auth, Chat, Street, Offline, Notifications
- **Navigation**: React Navigation stack
- **Storage**: AsyncStorage for offline data
- **Camera**: React Native Camera for photo capture
- **Voice**: React Native Voice for speech input
- **Biometrics**: React Native Biometrics for secure auth

## Permissions Required

- Camera access for street photos
- Microphone access for voice input
- Biometric access for authentication
- Push notification permissions
- Network access for API calls

## Offline Capabilities

- Queue chat messages when offline
- Cache conversation history
- Store photos for later upload
- Sync all data when connection restored