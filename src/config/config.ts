export default () => ({
  servicePort: parseInt(process.env.SERVICE_PORT, 10) || 8000,
  logDirectory: process.env.LOG_DIRECTORY || './logs',
  logFileName: process.env.LOG_FILE_NAME || 'loggerapp',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 102400000, // 100 MB
  fileAgeLimit: parseInt(process.env.FILE_AGE_LIMIT, 10) || 3600, // 1 hour in seconds
  JWT_SECRET: process.env.JWT_SECRET || 'defaultSecret',
  secretExpiration: process.env.SECRET_EXPIRATION || '1h',
});
