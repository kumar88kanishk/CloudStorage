FROM node:slim

WORKDIR /app

COPY package.json .

RUN npm set registry 'http://185.213.175.212:4873/'

RUN npm install

COPY . .

ENV \
  NODE_ENV='development' \
  PORT=5005 \
  URL='mongodb://object-container-db:27017/magcentre' \
  minio_accesskey='AKIAIOSFODNN7EXAMPLE' \
  minio_secretkey='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY' \
  minio_endpoint='http://185.213.175.212:9000/'\
  minio_bucket='test'\
  minio_encryptionKey='jhL4qpnhqpuJq5VENASWtFVylscVjZHX'\
  JWT_SECRET='5avo57Ive6RawrejEspow0prO6risl' \
  JWT_ACCESS_EXPIRATION_MINUTES=30 \
  JWT_REFRESH_EXPIRATION_DAYS=30 \
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10 \
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10 \
  ENC_KEY='5avo57Ive6Rawrisl' \
  API_GATEWAY='http://api-gateway-service:5000'

EXPOSE 5005

CMD [ "node", "src/index.js" ]
