const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

class FileService {
  constructor() {
    // Initialize S3 client
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    });
    
    this.bucketName = process.env.S3_BUCKET_NAME;
  }

  async uploadFile(file, folder) {
    try {
      const fileName = `${folder}/${Date.now()}-${file.originalname}`;
      
      const params = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private'
      };

      const result = await this.s3.upload(params).promise();
      
      return result.Location;
    } catch (error) {
      console.error('S3 upload error:', error);
      // Fallback to local storage for development
      return this.uploadFileLocal(file, folder);
    }
  }

  async uploadFileLocal(file, folder) {
    try {
      const uploadDir = path.join(__dirname, '../uploads', folder);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, file.buffer);

      return `/uploads/${folder}/${fileName}`;
    } catch (error) {
      console.error('Local upload error:', error);
      throw new Error('File upload failed');
    }
  }

  async deleteFile(fileUrl) {
    try {
      if (fileUrl.includes('amazonaws.com')) {
        // S3 file
        const key = fileUrl.split('/').pop();
        await this.s3.deleteObject({
          Bucket: this.bucketName,
          Key: key
        }).promise();
      } else {
        // Local file
        const filePath = path.join(__dirname, '..', fileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
      console.error('File deletion error:', error);
    }
  }
}

module.exports = new FileService();
