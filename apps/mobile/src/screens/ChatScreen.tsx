import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import Voice from '@react-native-voice/voice'
import { ChatService } from '../services/ChatService'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults
    Voice.onSpeechEnd = () => setIsListening(false)
    return () => Voice.destroy().then(Voice.removeAllListeners)
  }, [])

  const onSpeechResults = (e: any) => {
    setInputText(e.value[0])
  }

  const startListening = async () => {
    try {
      setIsListening(true)
      await Voice.start('en-US')
    } catch (error) {
      setIsListening(false)
    }
  }

  const sendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')

    try {
      const response = await ChatService.sendMessage(inputText)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Chat error:', error)
    }
  }

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          style={[styles.voiceButton, isListening && styles.listeningButton]}
          onPress={startListening}
        >
          <Text style={styles.buttonText}>🎤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  messagesList: { flex: 1, padding: 16 },
  message: { padding: 12, marginVertical: 4, borderRadius: 8, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#007AFF' },
  aiMessage: { alignSelf: 'flex-start', backgroundColor: '#fff' },
  messageText: { color: '#000' },
  inputContainer: { flexDirection: 'row', padding: 16, backgroundColor: '#fff' },
  textInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginRight: 8 },
  voiceButton: { padding: 12, backgroundColor: '#34C759', borderRadius: 8, marginRight: 8 },
  listeningButton: { backgroundColor: '#FF3B30' },
  sendButton: { padding: 12, backgroundColor: '#007AFF', borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
})