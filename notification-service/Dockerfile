FROM node:slim

WORKDIR /app

COPY package.json .

RUN npm set registry 'http://185.213.175.212:4873/'

RUN npm install

ENV \
  NODE_ENV='development' \
  PORT=5003 \
  URL='mongodb://notification-db:27017/magcentre' \
  EMAIL_FROM='alvena.greenfelder5@ethereal.email' \
  SMTP_HOST='smtp.ethereal.email' \
  SMTP_PORT=587 \
  SMTP_USERNAME='alvena.greenfelder5@ethereal.email' \
  SMTP_PASSWORD='Wz8rd5898yEwVTKYby' \
  FIREBASE_SERVER_KEY='AAAAGi6prN0:APA91bFqTcF0v4dZxn-3uKVy83NP_953Ouep-IlLBm2OEeCvqgf7uJTQ9ixau97sIQbwRf4qR1QSJ18HxzUumd_IyvweGbrNUbq0XAm-Qvyt7x-EIF7pPe2kavLnspVgLlvtMIBG0xj6' \
  API_GATEWAY='http://api-gateway-service:5000'

COPY . .

EXPOSE 5003

CMD [ "node", "src/index.js" ]
