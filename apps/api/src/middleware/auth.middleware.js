const jwt = require('jsonwebtoken')
const { RateLimiterMemory } = require('rate-limiter-flexible')

const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
})

const authRateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 5, // Number of requests
  duration: 60, // Per 60 seconds
})

class AuthMiddleware {
  static async authenticate(req, res, next) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '')
      
      if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      next()
    } catch (error) {
      res.status(400).json({ message: 'Invalid token.' })
    }
  }

  static authorize(roles = []) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: 'Access denied.' })
      }

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Insufficient permissions.' })
      }

      next()
    }
  }

  static async rateLimit(req, res, next) {
    try {
      await rateLimiter.consume(req.ip)
      next()
    } catch (rejRes) {
      res.status(429).json({
        message: 'Too many requests',
        retryAfter: Math.round(rejRes.msBeforeNext / 1000)
      })
    }
  }

  static async authRateLimit(req, res, next) {
    try {
      await authRateLimiter.consume(req.ip)
      next()
    } catch (rejRes) {
      res.status(429).json({
        message: 'Too many authentication attempts',
        retryAfter: Math.round(rejRes.msBeforeNext / 1000)
      })
    }
  }

  static validateApiKey(req, res, next) {
    const apiKey = req.header('X-API-Key')
    
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({ message: 'Invalid API key' })
    }
    
    next()
  }
}

module.exports = AuthMiddleware