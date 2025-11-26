const websocketService = require('../services/websocket.service')

class WebSocketController {
  static getOnlineUsers(req, res) {
    try {
      const onlineUsers = websocketService.getOnlineUsers()
      res.json({
        success: true,
        users: onlineUsers,
        count: onlineUsers.length
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get online users'
      })
    }
  }

  static sendNotification(req, res) {
    try {
      const { userId, message, type = 'notification' } = req.body
      
      const sent = websocketService.sendToUser(userId, {
        type,
        message,
        timestamp: new Date().toISOString()
      })

      res.json({
        success: sent,
        message: sent ? 'Notification sent' : 'User not online'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to send notification'
      })
    }
  }

  static broadcastMessage(req, res) {
    try {
      const { roomId, message, type = 'broadcast' } = req.body
      
      websocketService.broadcastToRoom(roomId, {
        type,
        message,
        timestamp: new Date().toISOString(),
        from: 'system'
      })

      res.json({
        success: true,
        message: 'Message broadcasted'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to broadcast message'
      })
    }
  }
}

module.exports = WebSocketController