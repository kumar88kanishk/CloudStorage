/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const { mongoose } = require('@magcentre/mongoose-helper');
const { getRichError } = require('@magcentre/response-helper');

const folderSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    bucket: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    isTrash: {
      type: Boolean,
      default: false,
    },
    isStared: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

folderSchema.index({ key: 1, user: 1 }, { unique: 1 });

/**
 * @typedef Folders
 */
const Folders = mongoose.model('folders', folderSchema);

/**
 * fetch all folders from foldeer model
 * @param {List} keys keys of the folders to be fetched
 * @returns List of Folders
 */
Folders.getFoldersFromFoldersList = (keys, user) => Folders.find({ key: { $in: keys }, user }, { _id: 0, bucket: 0, user: 0 });

/**
 * check if folder with key exists in entried or not
 * @param {String} keys key of the folder
 * @returns Folders
 */
Folders.checkIfFolderExists = (key) => Folders.findOne({ key })
  .catch((err) => {
    throw getRichError('System', 'error matching creating new folder entry', { err }, err, 'error', null);
  });

/**
 * fetch all folders from foldeer model
 * @param {List} keys keys of the folders to be fetched
 * @returns List of Folders
 */
Folders.createFolderEntry = (key, properties) => Folders.create({ key, ...properties })
  .catch((err) => {
    throw getRichError('System', 'error matching creating new folder entry', { err }, err, 'error', null);
  });

/**
 * Update folder state stored in folder model
 * @param {String} key key of the folder
 * @param {String} userid user of which key has to update
 * @param {Object} properties properties of the folder to update
 * @returns Promise
 */
Folders.updateFolderState = (key, userid, properties) => Folders.findOneAndUpdate({ key, user: userid }, properties)
  .catch((err) => {
    throw getRichError('System', 'error updating folder state', { err }, err, 'error', null);
  });

/**
 * get recent folders of the user
 * sorted by updatedAt
 * @param {String} user userid to filter the folders
 * @returns Promise
 */
Folders.getRecentFolders = (user) => Folders.find({ user, isTrash: false }, { bucket: 0 }).sort({ updatedAt: -1 }).limit(5)
  .catch((err) => {
    throw getRichError('System', 'error matching updating folder state', { err }, err, 'error', null);
  });

/**
 * get starred folders of the user
 * @param {String} user userid to filter the folders
 * @returns Promise
 */

Folders.getStarredFolders = (user) => Folders.find({ user, isStared: true, isTrash: false }, { bucket: 0 })
  .catch((err) => {
    throw getRichError('System', 'error fethching stared folders', { err }, err, 'error', null);
  });

/**
 * get trashed folders of the user
 * @param {String} user userid to filter the folders
 * @returns Promise
 */
Folders.getTrashedFolders = (user) => Folders.find({ user, isTrash: true }, { bucket: 0 })
  .catch((err) => {
    throw getRichError('System', 'error fethching trashed folders', { err }, err, 'error', null);
  });

module.exports = {
  model: Folders,
};
