const utils = require('@magcentre/api-utils');

const { getRichError } = require('@magcentre/response-helper');

const path = require('path');

const config = require('../configuration/config');

const { readerDownload } = require('../constants');

/**
 * Fetch file form registry reader
 * @param {String} key encrypted base64 path of the file to fetch from reader
 * @param {*} head header of the req with jwt
 * @returns axios stream response
 */
const getObjectFromRegistry = (key, head) => {
  const header = {
    'x-correlation-id': head['x-correlation-id'] || Date.now(),
    ...head,
  };
  return utils.connect(readerDownload(key), 'get', {}, header, 'stream');
};

/**
 * Download the file from the minio with key and userid
 * @param {String} key Key generated from the container
 * @param {String} userId session userid also used as bucket
 * @param {Object} headers current request headers
 * @returns Promise
 */
const download = (key, token, headers) => {
  let readerKey = utils.decrypt(key, config.container.enckey);

  const fileName = readerKey;

  readerKey = Buffer.from(readerKey).toString('base64');

  headers.Authorization = `Bearer ${token}`;

  return getObjectFromRegistry(readerKey, headers)
    .then((readerResponse) => ({ readerResponse, fileName: path.basename(fileName), extension: path.extname(key) }))
    .catch((err) => {
      throw getRichError('System', 'error while fetching file from reader', { readerKey, headers }, err, 'error', null);
    });
};

module.exports = {
  getObjectFromRegistry,
  download,
};
