const express = require('express')
const http = require('http')
const cors = require('cors')
const helmet = require('helmet')
const websocketService = require('./services/websocket.service')
const WebSocketController = require('./controllers/websocket.controller')
const EmailController = require('./controllers/email.controller')
const EmailScheduler = require('./jobs/email-scheduler')
const PaymentController = require('./controllers/payment.controller')
const AnalyticsController = require('./controllers/analytics.controller')
const UploadController = require('./controllers/upload.controller')
const AuthMiddleware = require('./middleware/auth.middleware')
const fileStorageService = require('./services/file-storage.service')
const AIController = require('./controllers/ai.controller')

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

// Payment routes
app.post('/api/payment/subscription', AuthMiddleware.authenticate, PaymentController.createSubscription)
app.post('/api/payment/initialize', AuthMiddleware.authenticate, PaymentController.initializePayment)
app.post('/api/payment/webhook/stripe', PaymentController.handleStripeWebhook)
app.post('/api/payment/webhook/paystack', PaymentController.handlePaystackWebhook)
app.post('/api/payment/invoice', AuthMiddleware.authenticate, PaymentController.generateInvoice)
app.post('/api/payment/payout', AuthMiddleware.authenticate, AuthMiddleware.authorize(['admin']), PaymentController.processContributorPayout)
app.delete('/api/payment/subscription', AuthMiddleware.authenticate, PaymentController.cancelSubscription)
app.get('/api/payment/subscription/:subscriptionId', AuthMiddleware.authenticate, PaymentController.getSubscriptionStatus)

// Analytics routes
app.post('/api/analytics/track', AuthMiddleware.authenticate, AnalyticsController.trackEvent)
app.get('/api/analytics/user-stats', AuthMiddleware.authenticate, AnalyticsController.getUserStats)
app.get('/api/analytics/system-stats', AuthMiddleware.authenticate, AuthMiddleware.authorize(['admin']), AnalyticsController.getSystemStats)
app.get('/api/analytics/conversation-trends', AuthMiddleware.authenticate, AnalyticsController.getConversationTrends)

// Upload routes
const upload = fileStorageService.getMulterConfig()
app.post('/api/upload', AuthMiddleware.authenticate, upload.single('file'), UploadController.uploadFile)
app.delete('/api/upload/:key', AuthMiddleware.authenticate, UploadController.deleteFile)
app.get('/api/upload/signed-url/:key', AuthMiddleware.authenticate, UploadController.getSignedUrl)
app.get('/api/upload/list', AuthMiddleware.authenticate, UploadController.listFiles)

// AI routes
app.post('/api/ai/stream', AuthMiddleware.authenticate, AIController.streamChat)
app.post('/api/ai/rag', AuthMiddleware.authenticate, AIController.ragQuery)
app.post('/api/ai/memory', AuthMiddleware.authenticate, AIController.storeMemory)
app.get('/api/ai/memory/search', AuthMiddleware.authenticate, AIController.searchMemories)
app.post('/api/ai/summarize', AuthMiddleware.authenticate, AIController.summarizeConversation)
app.post('/api/ai/extract-points', AuthMiddleware.authenticate, AIController.extractKeyPoints)
app.post('/api/ai/detect-language', AuthMiddleware.authenticate, AIController.detectLanguage)
app.post('/api/ai/translate', AuthMiddleware.authenticate, AIController.translateText)
app.post('/api/ai/chat-lang', AuthMiddleware.authenticate, AIController.chatInLanguage)
app.get('/api/ai/languages', AIController.getSupportedLanguages)
app.post('/api/ai/personality', AuthMiddleware.authenticate, AIController.chatWithPersonality)
app.get('/api/ai/personalities', AIController.getPersonalities)
app.post('/api/ai/personality/custom', AuthMiddleware.authenticate, AIController.createCustomPersonality)
app.get('/api/ai/costs', AuthMiddleware.authenticate, AIController.getUserCosts)
app.get('/api/ai/limits', AuthMiddleware.authenticate, AIController.checkUserLimits)
app.get('/api/ai/cost-report', AuthMiddleware.authenticate, AIController.generateCostReport)
app.post('/api/ai/estimate-cost', AuthMiddleware.authenticate, AIController.estimateCost)

// Initialize WebSocket service
websocketService.initialize(server)

// Initialize email scheduler
EmailScheduler.init()

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`WebSocket server initialized`)
})