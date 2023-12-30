# node configuration
export NODE_ENV='development'
export PORT=5002

# Minio server configuration
# Minio server configuration
export minio_accesskey='WR5ivhhHSb52aesU'
export minio_secretkey='bsiUPU3zBdmgJEAOqj9Vft0LLv2inLJ7'
export minio_endpoint='https://minio.srv9.co:9000'
export minio_bucket='testbucket'
export minio_port=9000
# export minio_encryptionKey='jhL4qpnhqpuJq5VENASWtFVylscVjZHX'
export minio_ssl=false

# JWT
# JWT secret key
export JWT_SECRET='5avo57Ive6RawrejEspow0prO6risl'

# database configuration
export dbhost='localhost'
export dbport=3306
export dbname='object-registry'
export dbuser='root'
export dbpassword='f3is4afiVihIplmadrLF12!'

export API_GATEWAY='http://localhost:5000/'

/usr/local/bin/node src/index.js