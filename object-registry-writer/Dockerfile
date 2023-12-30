FROM node:slim
WORKDIR /app

COPY package.json .

RUN npm set registry 'http://185.213.175.212:4873/'

RUN npm install

ENV \
  NODE_ENV='development' \
  PORT=5001 \
  minio_accesskey='WR5ivhhHSb52aesU' \
  minio_secretkey='bsiUPU3zBdmgJEAOqj9Vft0LLv2inLJ7' \
  minio_endpoint='https://minio.srv9.co:9000/'\
  minio_bucket='test'\
  minio_encryptionKey='jhL4qpnhqpuJq5VENASWtFVylscVjZHX'\
  dbhost='object-registry-writer-db'\
  dbport=3306\
  dbname='object-registry'\
  dbuser='root'\
  dbpassword='magcentre'\
  JWT_SECRET='5avo57Ive6RawrejEspow0prO6risl' \
  API_GATEWAY='http://185.213.175.212:5000'
  

COPY . .

EXPOSE 5001

CMD [ "node", "src/index.js" ]
