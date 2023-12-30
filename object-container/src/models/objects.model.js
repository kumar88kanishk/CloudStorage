const { mongoose } = require('@magcentre/mongoose-helper');
const { getRichError } = require('@magcentre/response-helper');

const objectSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    writerBody: {
      type: mongoose.Schema.Types.Mixed,
    },
    fileObject: {
      type: mongoose.Schema.Types.Mixed,
    },
    size: {
      type: mongoose.Schema.Types.Number,
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
    extension: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

objectSchema.index({ key: 1, user: 1 }, { unique: 1 });

/**
 * return if the user is owner of the object
 * @param {String} hash - object hash generated at time of file upload
 * @returns {Promise<Objects>} -
 */
objectSchema.statics.isOwner = function (user, hash, cb) {
  return this.findOne({ user, hash }, { bucket: 0 });
};

/**
 * return the object hash
 * @param {String} hash - object hash generated at time of file upload
 * @returns {Promise<Objects>} -
 */
objectSchema.statics.getObjectByHash = function (hash, cb) {
  return this.findOne({ hash }, { bucket: 0 });
};

/**
 * return the trash object for the user
 * @param {String} userId - object hash generated at time of file upload
 * @returns {Promise<Objects>} -
 */
objectSchema.statics.getTrashObjects = function (user, cb) {
  return this.find({ isTrash: true, user, isDeleted: false }, { bucket: 0 });
};

/**
 * move the object in trash
 * @param {String} hash - object hash generated at time of file upload
 * @returns {Promise<Objects>} -
 */
objectSchema.statics.moveToTrash = function (hash, cb) {
  return this.updateOne({ hash }, { $set: { isTrash: true } });
};

/**
 * mark object as deleted
 * @param {String} hash - object hash generated at time of file upload
 * @returns {Promise<Objects>} -
 */
objectSchema.statics.deleteObject = function (hash, cb) {
  return this.update({ hash }, { $set: { isDeleted: true } });
};

/**
 * get started objects of the user
 * @param {String} hash - object hash generated at time of file upload
 * * @param {String} userId - userid
 * @returns {Promise<Objects>} -
 */
objectSchema.statics.getStaredFile = function (user, cb) {
  return this.find({
    user, isStared: true, isDeleted: false, isTrash: false,
  }, { writerBody: 0, bucket: 0 });
};

/**
 * get recently updated objects by the
 * @param {String} hash - object hash generated at time of object upload
 * * @param {String} user - userid requesting recent objects
 * @returns {Promise<Objects>} -
 */
objectSchema.statics.getRecentObjects = function (user, cb) {
  return this.find({ user, isTrash: false, isDeleted: false }, { writerBody: 0, bucket: 0 }).sort({ updatedAt: -1 }).limit(10);
};

/**
 * return files by folder hash
 * @param {Object} folderHash - folder hash generated during folder creation
 * * @param {Object} user - user id
 * @returns {Promise<Objects>} -
 */
objectSchema.statics.getFilesByFolderHash = function (folderHash, user, cb) {
  return this.find({
    folderHash, $or: [{ user: { $eq: user } }, { sharedWith: { $in: [user] } }], isTrash: false, isDeleted: false,
  }, { writerBody: 0, bucket: 0 });
};


/**
 * check if file already exists with the key
 * @param {String} key - key to verify
 * @param {String} user - user id generated from identity
 * @returns {Promise<Objects>} - boolean
 */
objectSchema.statics.keyExists = function (key, user) {
  return this.find({ key, user });
};

/**
 * update object  with new data
 * @param {String} key - key to verify
 * @param {String} user - user id generated from identity
 * @returns {Promise<Objects>} - update info
 */
objectSchema.statics.updateObjectWithKey = function (key, user, data) {
  return this.updateOne({ key, user }, { $set: { ...data } });
};

/**
 * @typedef Objects
 */
const Objects = mongoose.model('objects', objectSchema);

/**
 * check if file already exists with the key
 * @param {String} key - key to verify
 * @param {String} user - user id generated from identity
 * @returns {Promise<Objects>} - boolean
 */
Objects.keyExists = (key, user) => Objects.find({ key, user });

/**
 * update object  with new data
 * @param {String} key - key to verify
 * @param {String} user - user id generated from identity
 * @returns {Promise<Objects>} - update info
 */
Objects.updateObjectWithKey = (key, user, data) => Objects.updateOne({ key, user }, { $set: { ...data } });

/**
 * Fetch all the objects from keys
 * @param {List} keys keys of the objects to fetch from
 * @returns List of Objects
 */
Objects.getObjectsFromKeys = (keys, user) => Objects.find({ key: { $in: keys }, user }, { writerBody: 0, _id: 0, user: 0 })
  .catch((err) => {
    throw getRichError('System', 'error while featching objects from keys', { err }, null, 'error', null);
  });

/**
 * Update the object state via key
 * @param {String} key key to update
 * @param {String} user userid whose key need to be updated
 * @param {String} entry update object
 * @returns Promise
 */
Objects.updateObjectByKey = (key, user, entry) => Objects.findOneAndUpdate({ key, user }, entry)
  .catch((err) => {
    throw getRichError('System', 'error while featching objects from keys', { err }, null, 'error', null);
  });

/**
 * get objects from the folder
 * @param {String} path key to update
 * @param {String} user userid
 * @returns Promise
 */
Objects.getObjectFromFolder = (key, user) => Objects.find({ key: { $regex: key }, user }, { key: 1 })
  .catch((err) => {
    throw getRichError('System', 'error while featching objects from keys', { err }, null, 'error', null);
  });

/**
 * get recent files from the model
 * @param {String} user userid to fetch users recent files
 * @returns Promise
 */
Objects.getRecentObjects = (user) => Objects.find({ user, isTrash: false }, { bucket: 0, writerBody: 0 }).limit(10)
  .catch((err) => {
    throw getRichError('System', 'error while featching objects from keys', { err }, null, 'error', null);
  });

/**
 * get starred files from the model
 * @param {String} user userid to fetch users starred files
 * @returns Promise
 */
Objects.getStarredObjects = (user) => Objects.find({ user, isTrash: false, isStared: true }, { bucket: 0, writerBody: 0 })
  .catch((err) => {
    throw getRichError('System', 'error while featching objects from keys', { err }, null, 'error', null);
  });

/**
 * get trashed files from the model
 * @param {String} user userid to fetch users starred files
 * @returns Promise
 */
Objects.getTrashedFiles = (user) => Objects.find({ user, isTrash: true }, { bucket: 0, writerBody: 0 })
  .catch((err) => {
    throw getRichError('System', 'error while featching objects from keys', { err }, null, 'error', null);
  });

module.exports = {
  model: Objects,
};
