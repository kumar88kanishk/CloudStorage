const minio = require('@magcentre/minio-helper');
const fs = require('fs');
const { getRichError } = require('@magcentre/response-helper');

const { model } = require('../model/registry.model');

/**
 * upload encrypted file to minio and get the minio response
 * @param {Object} file file object with file meta data
 * @param {String} filePath
 * @returns
 */
const uploadToMinio = (file, filePath) => {
  const fileConfig = {
    name: file.name,
    bucket: file.bucket,
    type: file.mimetype,
    size: file.size,
    filePath,
  };
  return minio.putObject(fileConfig);
};

// /**
//  * create registry entry api
//  * @param {Object} minioResponse response from minio upload
//  * @returns FileModel
//  */

// const createRegistryEntry = (fileConfig) => models.registry.create({
//   name: fileConfig.originalname,
//   type: fileConfig.mimetype,
//   size: fileConfig.size,
//   url: fileConfig.tag,
//   bucket: fileConfig.bucket,
// })
//   .then(() => fileConfig.response)
//   .catch((err) => getRichError('System', 'error while creating new entry for writer registry', { fileConfig }, err, 'error', null));

/**
 * encrypt the file
 * @param {String} filePath
 * @returns String encrypted filepath
 */
const processFile = (filePath, encKey) => minio.processfile(filePath, encKey);

/**
 * delete cached file
 * @param {String} filePath
 * @returns String encrypted filepath
 */
const deleteCacheFile = (filePath, entryResponse) => fs.promises.unlink(`${filePath}.enc`)
  .then(() => entryResponse)
  .catch((err) => getRichError('Parameter', 'error while clearing cache', { filePath, entryResponse }, err, 'error', null));

/**
 * Upload object of minio
 * @param {String} filePath file path
 * @param {*} encKey key to encrypt the file
 * @param {*} fileConfig fileconfig from file data
 * @returns Promise
 */
const upload = (filePath, encKey, fileConfig) => processFile(filePath, encKey)
  .then((response) => uploadToMinio(fileConfig, response))
  .then((response) => model.createRegistryEntry({ ...fileConfig, tag: response.ETag, response }))
  .then((entryResponse) => deleteCacheFile(filePath, entryResponse))
  .then(() => ({ ...fileConfig }))
  .catch((err) => getRichError('Parameter', 'error while uploading the object to registry writer', { filePath, encKey, fileConfig }, err, 'error', null));

module.exports = {
  upload,
};
