const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { GetObjectCommand } = require('@aws-sdk/client-s3')
const multer = require('multer')
const path = require('path')

class FileStorageService {
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
      }
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
      
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
      })

      await this.s3Client.send(command)
      
      // Construct the public URL
      const url = `https://${this.bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`
      
      return {
        success: true,
        url: url,
        key: key,
        size: file.size
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async deleteFile(key) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key
      })
      
      await this.s3Client.send(command)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async getSignedUrl(key, expires = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key
      })
      
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: expires })
      
      return { success: true, url }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async listFiles(folder = 'uploads', maxKeys = 100) {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: folder,
        MaxKeys: maxKeys
      })

      const result = await this.s3Client.send(command)
      
      const files = (result.Contents || []).map(obj => ({
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified,
        url: `https://${this.bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${obj.Key}`
      }))

      return { success: true, files }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

module.exports = new FileStorageService()