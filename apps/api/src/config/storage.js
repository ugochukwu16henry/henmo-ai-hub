const multer = require('multer');

// Note: multer-s3 doesn't support AWS SDK v3
// Using memory storage instead - files will be uploaded via file-storage.service.js
// This is more compatible with AWS SDK v3
const s3Upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|mp4|mov/;
    const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Local storage fallback
const localStorage = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// Export appropriate storage based on environment
module.exports = process.env.NODE_ENV === 'production' ? s3Upload : localStorage;