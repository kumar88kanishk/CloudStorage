const minioHelper = require('@magcentre/minio-helper');
const { getRichError } = require('@magcentre/response-helper');
const utils = require('@magcentre/api-utils');

const fs = require('fs');

const FormData = require('form-data');

const path = require('path');

const config = require('../configuration/config');

const { model } = require('../models/objects.model');
const { folderModel } = require('../models/folder.model');

const { writerUpload } = require('../constants');
// const bucketCreate = (bucketName) => minioHelper.bucketCreate(bucketName);

/**
 * Create new bucket in minio
 * @param {String} bucketName Bucket name to be created
 * @returns response
 */
const bucketCreate = (bucketName) => minioHelper.bucketCreate(bucketName)
  .then((response) => response)
  .catch((err) => {
    throw getRichError('Parameter', 'Bucket already exists', { message: 'Unable to create bucket', bucketName }, err, 'error', null);
  });

/**
 * Check if bucket exists with provided name
 * @param {String} bucketName bucket name to check if exists in minio
 * @returns true if bucket exists
 */
const bucketExists = (bucketName) => minioHelper.bucketExists(bucketName)
  .then((exists) => {
    if (!exists) return false;
    throw getRichError('Parameter', 'Bucket already exists', { message: 'Unable to check if bucket exists', bucketName }, null, 'error', null);
  })
  .catch((err) => {
    throw getRichError('Parameter', 'error while checking if bucket exists', { bucketName }, err, 'error', null);
  });

/**
 * verify if the bucket exists
 * if not, new bucjet will be created with bucketName
 * @param {String} bucketName Bucket name to be created
 * @returns Bucket create responsee
 */
const checkAndCreateBucket = (bucketName) => bucketExists(bucketName)
  .then(() => bucketCreate(bucketName));

/**
 * clean up the cache, return the seprate list of files and folder.
 * @param {String} filePath filePath of the file uploaded
 * @param {Axios<Response>} response axios response from the object-registry-writer
 * @param {Object} fileObject file object from the front-end
 * @returns List of file
 */
const postProcess = (filePath, response, fileObject) => fs.promises.unlink(filePath)
  .then(() => model.keyExists(response.name, response.bucket))
  .then((exists) => {
    const data = {
      key: response.name.replace('//', '/'),
      user: response.bucket,
      writerBody: response,
      fileObject,
      size: fileObject.size,
      extension: path.extname(fileObject.originalname || ''),
    };
    if (exists.length === 1) {
      delete data.key;
      delete data.user;
      return model.updateObjectWithKey(response.name, response.bucket, data);
    }
    return model.create(data);
  })
  .then(() => {
    response.Key = utils.encrypt(response.name, config.container.enckey);
    return response;
  });
/**
 * upload file inside the bucket
 * @param {String} filePath file path where the file is uploaded
 * @param {Object} fileConfig file config from multer
 * @param {String} userId mongo user id where the file is uploaded
 * @param {object} header req headers
 * @returns bucketUpload response
 */
const bucketUpload = (filePath, fileConfig, userId, header) => {
  const uploadedFile = fs.createReadStream(`${filePath}`);

  const fileData = new FormData();

  fileData.append('file', uploadedFile);

  fileData.append('fileConfig', JSON.stringify(fileConfig));

  const uploadHeader = fileData.getHeaders();

  uploadHeader['x-correlation-id'] = header['x-correlation-id'] || Date.now();

  uploadHeader.authorization = header.authorization;

  return utils.connect(writerUpload(userId), 'post', fileData, uploadHeader)
    .catch((error) => {
      throw getRichError('System', 'Processor Bucket Upload', { message: 'Unable to upload' }, error, 'error', null);
    });
};

const folderCreate = (bucketName, folderName, pathKey) => {
  const currentPath = utils.decrypt(pathKey, config.container.enckey);
  return minioHelper.putObject({
    name: `/${currentPath + folderName}/.new-folder`,
    bucket: bucketName,
    type: 'application/octet-stream',
    size: 0,
    filePath: 'uploads/.new-folder',
  });
};

const folderRename = (bucketName, folderName, pathKey, parentKey) => {
  const currentPath = utils.decrypt(pathKey, config.container.enckey);
  const parent = utils.decrypt(parentKey, config.container.enckey);
  return minioHelper.renameFolder(bucketName, currentPath, parent + folderName);
};

/**
 * update state of the folder
 * @param {String} folderKeyHash hash generated from containg key
 * @param {String} userId userid access the folder update
 * @param {Object} properties properties of the folder to be updated
 * @returns promise
 */
const folderUpdate = (folderKeyHash, userId, properties) => {
  let folderKey = utils.decrypt(folderKeyHash, config.container.enckey);
  if (folderKey.startsWith('//')) folderKey = folderKey.replace('//', '/');
  return folderModel.updateFolderState(`/${folderKey}`, userId, properties)
    .then((e) => {
      if (e) return e;
      return folderModel.createFolderEntry(`/${folderKey}`, { user: userId, bucket: userId, ...properties });
    })
    .then(() => folderModel.findOne({ key: `/${folderKey}`, user: userId }))
    .then((folder) => {
      folder = folder.toObject();
      const sp = folder.key.split('/');
      return {
        ...folder,
        prefix: `${sp[sp.length - 2]}/`,
        path: folder.key,
        key: utils.encrypt(folder.key, config.container.enckey),
      };
    });
};

/**
 * rename the file uploaded into the minio
 * @param {String} bucketName bucket name in which the filehas to renami
 * @param {String} newFileName new filename
 * @param {String} pathKey encrypted filepath of which the filehas to be renamed
 * @param {String} parentKey encrypted filepath of the parent in which the fileexists
 * @returns promise
 */
const fileRename = (bucketName, newFileName, pathKey, parentKey) => {
  let currentPath = utils.decrypt(pathKey, config.container.enckey);
  const parent = utils.decrypt(parentKey, config.container.enckey);
  return minioHelper.renameFile(bucketName, currentPath, parent + newFileName)
    .catch((err) => {
      throw getRichError('System', 'error while renaming the file', {
        bucketName, newFileName, pathKey, parentKey, currentPath, parent,
      }, err, 'error', null);
    })
    .then(() => {
      if (!currentPath.startsWith('/')) {
        currentPath = `/${currentPath}`;
      }
      return model.updateObjectByKey(currentPath, bucketName, { key: `/${parent}${newFileName}` });
    })
    .then(() => model.findOne({ key: `/${parent}${newFileName}`, user: bucketName }))
    .then((update) => {
      update = update.toObject();
      update.type = update.fileObject.mimetype;
      delete update.fileObject;
      delete update.writerBody;
      return {
        name: newFileName,
        size: update.Size,
        hash: utils.encrypt(update.key, config.container.enckey),
        ...update,
      };
    });
};

/**
 * update state of the file
 * @param {String} fileKeyHash hash generated from containg key
 * @param {String} userId userid access the file update
 * @param {Object} properties properties of the file to be updated
 * @returns promise
 */
const fileUpdate = (fileKeyHash, userId, properties) => {
  let fileKey = utils.decrypt(fileKeyHash, config.container.enckey);
  if (fileKey.startsWith('//')) fileKey = fileKey.replace('//', '/');
  if (!fileKey.startsWith('/')) fileKey = `/${fileKey}`;
  return model.updateObjectByKey(`${fileKey}`, userId, properties)
    .then(() => model.findOne({ key: `${fileKey}`, user: userId }))
    .then((update) => {
      update = update.toObject();
      update.type = update.fileObject.mimetype;
      delete update.fileObject;
      delete update.writerBody;
      return {
        name: update.key.split('/').slice(-1).pop(),
        size: update.Size,
        hash: fileKeyHash,
        ...update,
      };
    });
};

/**
 * Verify  if the bucket already exists or not
 * @param {String} bucketName bucket name to verify if exists or not
 * @returns return true if bucket exists otherwise throw error
 */
const verifyBucket = (bucketName) => minioHelper.bucketExists(bucketName)
  .then((exists) => {
    if (exists === true) return true;
    throw getRichError('NotFound', 'Bucket does not exists', { bucketName }, null, 'error', null);
  });

module.exports = {
  checkAndCreateBucket,
  verifyBucket,
  bucketUpload,
  postProcess,
  folderCreate,
  folderUpdate,
  folderRename,
  fileRename,
  fileUpdate,
};
