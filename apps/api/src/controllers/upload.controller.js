const fileStorageService = require('../services/file-storage.service')

class UploadController {
  static async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file provided' })
      }

      const folder = req.body.folder || 'uploads'
      const result = await fileStorageService.uploadFile(req.file, folder)
      
      if (result.success) {
        res.json({
          success: true,
          file: {
            url: result.url,
            key: result.key,
            size: result.size,
            originalName: req.file.originalname
          }
        })
      } else {
        res.status(500).json({ success: false, message: result.error })
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  static async deleteFile(req, res) {
    try {
      const { key } = req.params
      const result = await fileStorageService.deleteFile(key)
      
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  static async getSignedUrl(req, res) {
    try {
      const { key } = req.params
      const expires = parseInt(req.query.expires) || 3600
      
      const result = await fileStorageService.getSignedUrl(key, expires)
      
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  static async listFiles(req, res) {
    try {
      const folder = req.query.folder || 'uploads'
      const maxKeys = parseInt(req.query.limit) || 100
      
      const result = await fileStorageService.listFiles(folder, maxKeys)
      
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

module.exports = UploadController