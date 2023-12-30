FROM node:slim

WORKDIR /app

COPY package.json .

RUN npm set registry 'http://185.213.175.212:4873/'

RUN npm install

ENV \
  NODE_ENV='development' \
  PORT=5006 \
  minio_accesskey='pr8tlf7erODravlyupho4acoxeSP9jEX' \
  minio_secretkey='Studr19rUfO8utR0cRlkAchoZipAcri2ri4orIstL0rabraC4x3RlwotRawevIPr' \
  minio_endpoint='http://185.213.175.212:9000/'\
  minio_bucket='media'\
  minio_encryptionKey='jhL4qpnhqpuJq5VENASWtFVylscVjZHX'\
  dbhost='object-media-db'\
  dbport=3306\
  dbname='media-registry'\
  dbuser='root'\
  dbpassword='magcentre'\
  API_GATEWAY='http://api-gateway-service:5000'
  
COPY . .

EXPOSE 5006

CMD [ "node", "src/index.js" ]
