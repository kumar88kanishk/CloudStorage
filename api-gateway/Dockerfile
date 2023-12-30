FROM node:slim

WORKDIR /app

COPY package.json .

RUN npm set registry 'http://185.213.175.212:4873/'

RUN npm install

COPY . .

ENV PORT=5000 \
  OBJECT_WRITER='http://object-registry-writer-service:5001' \
  OBJECT_READER='http://object-registry-reader-service:5002' \
  OBJECT_IDENTITY='http://object-identity-service:5004' \
  OBJECT_CONTAINER='http://object-container-service:5005' \
  NOTIFICATION_SERVICE='http://object-notification-service:5003' \
  MEDIA_SERVICE='http://object-media-service:5006'

EXPOSE 5000

CMD [ "node", "src/index.js" ]