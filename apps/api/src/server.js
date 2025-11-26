const express = require('express')
const http = require('http')
const cors = require('cors')
const helmet = require('helmet')
const websocketService = require('./services/websocket.service')
const WebSocketController = require('./controllers/websocket.controller')
const EmailController = require('./controllers/email.controller')
const EmailScheduler = require('./jobs/email-scheduler')

const app = express()
const server = http.createServer(app)

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// WebSocket routes
app.get('/api/websocket/online-users', WebSocketController.getOnlineUsers)
app.post('/api/websocket/send-notification', WebSocketController.sendNotification)
app.post('/api/websocket/broadcast', WebSocketController.broadcastMessage)

// Email routes
app.post('/api/email/verification', EmailController.sendVerification)
app.post('/api/email/password-reset', EmailController.sendPasswordReset)
app.post('/api/email/notification', EmailController.sendNotification)
app.post('/api/email/weekly-digest', EmailController.sendWeeklyDigest)
app.post('/api/email/invoice', EmailController.sendInvoice)
app.post('/api/email/bulk', EmailController.sendBulk)

// Initialize WebSocket service
websocketService.initialize(server)

// Initialize email scheduler
EmailScheduler.init()

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`WebSocket server initialized`)
})