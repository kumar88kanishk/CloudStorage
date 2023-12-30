const utils = require('@magcentre/api-utils');
const config = require('../configuration/config');

const constants = require('../constants');

const { model } = require('../models/share.model');

/**
 * Create or update entry to share the object across different users
 * @param {Object} body Object containing share information about the key
 * @returns
 */
const createOrUpdateShareEntry = (body, user) => model.createOrUpdate(body, user);

/**
 * Share the file
 * Create or update existing entry of the folder or file in model
 * send the notifications to the respective users
 * @param {String} key encrypted has containg object key
 * @param {List<String>} userIds List of mongoid's of users to whom the object is shared
 * @param {String} user Owner of the file
 * @returns object of new file entry
 */
const share = (key, userIds, user, headers) => {
  let path = utils.decrypt(key, config.container.enckey);
  if (path.startsWith('//')) path = path.replace('//', '/');
  if (!path.startsWith('/')) path = `/${path}`;
  return createOrUpdateShareEntry({
    key: path, userIds, bucket: user, user, sharedWith: userIds,
  }, user)
    .then(() => utils.connect(constants.id2object, 'POST', {
      ids: userIds,
      display: { email: 1, firstName: 1, lastName: 2 },
    }, headers))
    .then((userList) => {
      return userList;
    });
};

module.exports = {
  share,
};
