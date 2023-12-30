const minioHelper = require('@magcentre/minio-helper');

const utils = require('@magcentre/api-utils');

const { getRichError } = require('@magcentre/response-helper');
const config = require('../configuration/config');

const { model } = require('../models/objects.model');

const { model: folderModel } = require('../models/folder.model');

/**
 * attach the folder state to the provided keys of folder presnet in current minio response
 * @param {Object} minioList response from minio for the specified path
 * @param {List} folderKeyList List of folder keys from the minio response
 * @param {String} user userid of which the files are processed
 * @returns Promise
 */
const processFolders = (minioList, folderKeyList, user) => {
  const dirList = [];
  return folderModel.getFoldersFromFoldersList(folderKeyList, user)
    .then((folderList) => {
      if (minioList && minioList.CommonPrefixes) {
        minioList.CommonPrefixes.forEach((dir) => {
          // fetching the folder from the folder list from folders collection
          let state = folderList.find((e) => e.key === `/${dir.Prefix.toString().replace('//', '/')}`);
          // check if mode exists
          if (state) {
            state = state.toObject();
          }
          else {
            // default state of folder will be applied in case no model found in database
            state = {
              isTrashed: false,
              isStared: false,
            };
          }
          if (state && !state.isTrash) {
            dirList.push({
              ...state,
              prefix: dir.Prefix.toString().replace(minioList.Prefix, ''),
              key: utils.encrypt(dir.Prefix, config.container.enckey),
            });
          }
        });
      }
      return dirList;
    });
};

/**
 * attach the file state to the provided keys of file presnet in current minio response
 * @param {Object} minioList response from minio for the specified path
 * @param {List} objectKeyList List of file keys from the minio response
 * @param {String} user userid of which the files are processed
 * @returns Promise
 */
const processFiles = (minioList, objectKeyList, user) => {
  const filesList = [];
  return model.getObjectsFromKeys(objectKeyList, user)
    .then((objectList) => {
      if (minioList && minioList.Contents) {
        minioList.Contents.forEach((object) => {
          const state = objectList.find((e) => e.key === `/${object.Key.replace('//', '/')}`);
          const objectName = object.Key.toString().replace(minioList.Prefix, '');
          if (state && !state.isTrash) {
            filesList.push({
              name: objectName,
              size: object.Size,
              hash: utils.encrypt(object.Key, config.container.enckey),
              lastModified: object.LastModified,
              key: utils.encrypt(object.Key, config.container.enckey),
              type: state.fileObject.mimetype,
              ...state.toObject(),
            });
          }
        });
      }
      return filesList;
    });
};

/**
 * process the list from minio this involves following states
 * processing the files and attaching the file state
 * processing the folders and appending the folder state to it
 * @param {object} list response from listObject
 * @returns Promise
 */
const processList = (minioList, user) => {
  const response = {
    prefix: minioList.Prefix,
    prefixKey: utils.encrypt(minioList.Prefix, config.container.enckey),
    files: [],
    dir: [],
  };

  const objectKeyList = minioList.Contents.map((e) => `/${e.Key.replace('//', '/')}`);

  const folderKeyList = minioList.CommonPrefixes.map((e) => `/${e.Prefix}`);

  return processFiles(minioList, objectKeyList, user)
    .then((fileList) => {
      response.files = fileList;
      return processFolders(minioList, folderKeyList, user);
    }).then((folderList) => {
      response.dir = folderList;
      return response;
    });
};

/**
 * List Object from the particular bucket
 * @param {String} bucketName name of bucket to list out all objects
 * @param {String} prefix prefix to start with
 * @returns List of objects
 */
const listObjects = (bucketName, prefix) => {
  const prefixDecrypt = utils.decrypt(prefix, config.container.enckey);
  return minioHelper.listObjects({ Bucket: bucketName, Prefix: prefixDecrypt, Delimiter: '/' })
    .then((list) => processList(list, bucketName))
    .catch((err) => {
      throw getRichError('System', 'error fetching list of objects', { err, bucketName, prefix }, err, 'error', null);
    });
};

const processFolderList = (list) => {
  const folderList = [];
  if (list && list.length > 0) {
    list.forEach((folder) => {
      const folderSplit = folder.key.split('/');
      const folderName = folderSplit[folderSplit.length - 2];
      folderList.push({
        ...folder.toObject(),
        prefix: folderName,
        path: folder.key,
        key: utils.encrypt(folder.key, config.container.enckey),
      });
    });
  }
  return folderList;
};

const processFilesList = (list) => {
  const fileList = [];
  if (list && list.length > 0) {
    list.forEach((file) => {
      const pathSplit = file.key.split('/');
      const fileName = pathSplit[pathSplit.length - 1];
      fileList.push({
        name: fileName,
        size: file.Size,
        hash: utils.encrypt(file.key, config.container.enckey),
        type: file.fileObject.mimetype,
        ...file.toObject(),
      });
    });
  }
  return fileList;
};

/**
 * fetch recently modified folders
 * @param {String} userId userid to filter
 * @returns List
 */
const getRecentFolders = (userId) => folderModel.getRecentFolders(userId)
  .then((list) => {
    const folderList = processFolderList(list);
    return folderList;
  });

/**
 * fetch recently modified files
 * @param {String} userId userid to filter
 * @returns List
 */
const getRecentFiles = (userId) => model.getRecentObjects(userId)
  .then((list) => processFilesList(list)).catch((err) => {
    throw getRichError('System', 'error fetching recent files', { err }, err, 'error', null);
  });

/**
 * Loads the recent files and folders from the model
 * process the recent folders
 * process the recent files
 * @param {String} userId userid to load the recent files of
 * @returns Promise
 */
const recentList = (userId) => {
  const response = {
    dir: [],
    files: [],
  };
  return getRecentFolders(userId)
    .catch((err) => {
      throw getRichError('System', 'error while loading recent folders', { err }, err, 'error', null);
    })
    .then((folderList) => {
      response.dir = folderList;
      return getRecentFiles(userId);
    })
    .then((fileList) => {
      response.files = fileList;
      return response;
    });
};

/**
 * fetch recently modified folders
 * @param {String} userId userid to filter
 * @returns List
 */
const getStarredFolders = (userId) => folderModel.getStarredFolders(userId)
  .then((list) => {
    return processFolderList(list);
  }).catch((err) => {
    throw getRichError('System', 'error while loading recent folders', { err }, err, 'error', null);
  });

/**
* fetch recently modified files
* @param {String} userId userid to filter
* @returns List
*/
const getStarredFiles = (userId) => model.getStarredObjects(userId)
  .then((list) => {
    return processFilesList(list);
  });

/**
 * Load starred files and foldrs from the model
 * process the stared folders
 * process the stared files
 * @param {String} userId userid to load the stared files of
 * @returns Promise
 */
const staredList = (userId) => {
  const response = {
    dir: [],
    files: [],
  };
  return getStarredFolders(userId)
    .catch((err) => {
      throw getRichError('System', 'error while loading starred file and folders', { err }, err, 'error', null);
    })
    .then((folderList) => {
      response.dir = folderList;
      return getStarredFiles(userId);
    })
    .then((fileList) => {
      response.files = fileList;
      return response;
    });
};

/**
  * fetch trashed folders
  * @param {String} userId userid to filter
  * @returns List
  */
const getTrashedFolders = (userId) => folderModel.getTrashedFolders(userId)
  .then((list) => {
    const folderList = processFolderList(list);
    return folderList;
  }).catch((err) => {
    throw getRichError('System', 'error while loading trashed folders', { err }, err, 'error', null);
  });

/**
 * fetch trashed files
 * @param {String} userId userid to filter
 * @returns List
 */
const getTrashedFiles = (userId) => model.getTrashedFiles(userId)
  .then((list) => {
    const fileList = processFilesList(list);
    return fileList;
  })
  .catch((err) => {
    throw getRichError('System', 'error while loading trsahed files', { err }, err, 'error', null);
  });

/**
 * Load trashed files and foldrs from the model
 * process the trashed folders
 * process the trashed files
 * @param {String} userId userid to load the trashed files of
 * @returns Promise
 */
const trashList = (userId) => {
  const response = {
    dir: [],
    files: [],
  };
  return getTrashedFolders(userId)
    .catch((err) => {
      throw getRichError('System', 'error while loading starred file and folders', { err }, err, 'error', null);
    })
    .then((folderList) => {
      response.dir = folderList;
      return getTrashedFiles(userId);
    })
    .then((fileList) => {
      response.files = fileList;
      return response;
    });
};

module.exports = {
  listObjects,
  processList,
  recentList,
  staredList,
  trashList,
};
