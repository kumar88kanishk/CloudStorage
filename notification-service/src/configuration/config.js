const DEFAULT_CONFIG_VERSION = 'v1.0.0';

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5003,
  database: {
    url: process.env.URL || "mongodb://localhost:27017/magcentre"
  },
  firebase: {
    serverKey: process.env.FIREBASE_SERVER_KEY
  },
  email: {
    from: process.env.EMAIL_FROM,
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      username: process.env.SMTP_USERNAME,
      password: process.env.SMTP_PASSWORD,
    }
  }
}
