import React, { useRef, useState } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { StreetService } from '../services/StreetService'

export const CameraScreen = () => {
  const cameraRef = useRef<RNCamera>(null)
  const [isUploading, setIsUploading] = useState(false)

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const options = { quality: 0.8, base64: true }
        const data = await cameraRef.current.takePictureAsync(options)
        
        setIsUploading(true)
        await StreetService.uploadStreetPhoto(data.uri, data.base64)
        Alert.alert('Success', 'Street photo uploaded successfully!')
      } catch (error) {
        Alert.alert('Error', 'Failed to upload photo')
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.auto}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.captureButton, isUploading && styles.disabledButton]}
          onPress={takePicture}
          disabled={isUploading}
        >
          <Text style={styles.captureText}>
            {isUploading ? 'Uploading...' : '📷'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  preview: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  controls: { position: 'absolute', bottom: 50, alignSelf: 'center' },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#007AFF'
  },
  disabledButton: { opacity: 0.5 },
  captureText: { fontSize: 24 }
})