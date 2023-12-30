# node configuration
export NODE_ENV='development'
export PORT=5001

# mongo connection string
export URL='mongodb://localhost:27017/magcentre'

# JWT
# JWT secret key
export JWT_SECRET='5avo57Ive6RawrejEspow0prO6risl'
# Number of minutes after which an access token expires
export JWT_ACCESS_EXPIRATION_MINUTES=30
# Number of days after which a refresh token expires
export JWT_REFRESH_EXPIRATION_DAYS=30
# Number of minutes after which a reset password token expires
export JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
# Number of minutes after which a verify email token expires
export JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10

# Minio server configuration
export minio_accesskey='WR5ivhhHSb52aesU'
export minio_secretkey='bsiUPU3zBdmgJEAOqj9Vft0LLv2inLJ7'
export minio_endpoint='https://minio.srv9.co:9000'
export minio_bucket='testbucket'
export minio_port=9000
# export minio_encryptionKey='jhL4qpnhqpuJq5VENASWtFVylscVjZHX'
export minio_ssl=false

export ENC_KEY='5avo57Ive6Rawrisl'

export API_GATEWAY='http://localhost:5000'

/usr/local/bin/node src/index.js