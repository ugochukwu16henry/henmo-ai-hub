const AWS = require('aws-sdk')
const multer = require('multer')
const path = require('path')

class FileStorageService {
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    })
    
    this.bucket = process.env.S3_BUCKET_NAME || 'henmo-ai-uploads'
  }

  getMulterConfig() {
    return multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = allowedTypes.test(file.mimetype)
        
        if (mimetype && extname) {
          return cb(null, true)
        } else {
          cb(new Error('Invalid file type'))
        }
      }
    })
  }

  async uploadFile(file, folder = 'uploads') {
    try {
      const key = `${folder}/${Date.now()}-${file.originalname}`
      
      const params = {
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
      }

      const result = await this.s3.upload(params).promise()
      
      return {
        success: true,
        url: result.Location,
        key: result.Key,
        size: file.size
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async deleteFile(key) {
    try {
      await this.s3.deleteObject({
        Bucket: this.bucket,
        Key: key
      }).promise()
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async getSignedUrl(key, expires = 3600) {
    try {
      const url = await this.s3.getSignedUrlPromise('getObject', {
        Bucket: this.bucket,
        Key: key,
        Expires: expires
      })
      
      return { success: true, url }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async listFiles(folder = 'uploads', maxKeys = 100) {
    try {
      const params = {
        Bucket: this.bucket,
        Prefix: folder,
        MaxKeys: maxKeys
      }

      const result = await this.s3.listObjectsV2(params).promise()
      
      const files = result.Contents.map(obj => ({
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified,
        url: `https://${this.bucket}.s3.amazonaws.com/${obj.Key}`
      }))

      return { success: true, files }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

module.exports = new FileStorageService()