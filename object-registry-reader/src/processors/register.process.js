const minio = require('@magcentre/minio-helper');

const logger = require('@magcentre/logger-helper');


const getObject = (fileKey, userId) => {
  try {
    let key = Buffer.from(fileKey, 'base64').toString('ascii');
    let stream = minio.objectStream(key, userId);
    if(stream) return stream;
  } catch(e) {
    logger.error(e);
  }
  return;
}

module.exports = {
  getObject
};
