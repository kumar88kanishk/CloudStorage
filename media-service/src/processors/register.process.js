const logger = require('@magcentre/logger-helper');

const { models } = require('@magcentre/sequelize-helper');

const minio = require('@magcentre/minio-helper');

const utils = require('@magcentre/api-utils');

const path = require('path');

const { getRichError } = require('@magcentre/response-helper');


/**
 * upload encrypted file to minio and get the minio response
 * @param {Object} file file object with file meta data
 * @param {String} filePath 
 * @returns 
 */
const uploadToMinio = (file, filePath) => {
  const fileConfig = {
    name: utils.randomString(32) + path.extname(file.originalname),
    bucket: file.bucket,
    type: file.mimetype,
    size: file.size,
    filePath,
  };
  return minio.upload(fileConfig);
};

/**
 * create registry entry api
 * @param {Object} minioResponse response from minio upload
 * @returns FileModel
 */

const createRegistryEntry = (minioResponse) => models.registry.create({
  name: minioResponse.name,
  type: minioResponse.type,
  size: minioResponse.size,
  url: minioResponse.accessKey,
  bucket: minioResponse.bucket,
});

/**
 * Upload object to media bucket
 * @param {object} fileConfig file config object
 * @returns Promise
 */
const upload = (fileConfig) => uploadToMinio(fileConfig, fileConfig.path)
  .then((minioResponse) => createRegistryEntry(minioResponse))
  .catch((err) => getRichError('System', 'unable to upload file into media service', { fileConfig }, null, 'error', null))


/**
 * Download the file from minio
 * @param {String} fileKey file key generated from upload
 * @returns Stream
 */
const downloadFromMinio = (fileKey) => {
  try {
    let stream = minio.download(fileKey);
    if (stream) return stream;
  } catch (e) {
    logger.error(e);
    throw getRichError('System', 'unable to download file stream from server', { fileConfig }, null, 'error', null);
  }
  return;
}

module.exports = {
  upload,
  downloadFromMinio,
};
