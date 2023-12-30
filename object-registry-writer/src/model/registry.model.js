const { mongoose } = require('@magcentre/mongoose-helper');
const { getRichError } = require('@magcentre/response-helper');

const registrySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    bucket: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// registrySchema.index({ key: 1, user: 1 }, { unique: 1 });
const Registry = mongoose.model('registry', registrySchema);



/**
 * create registry entry api
 * @param {Object} minioResponse response from minio upload
 * @returns FileModel
 */

Registry.createRegistryEntry = (fileConfig) => Registry.create({
  name: fileConfig.originalname,
  type: fileConfig.mimetype,
  size: fileConfig.size,
  url: fileConfig.tag,
  bucket: fileConfig.bucket,
})
  .catch((err) => {
    throw getRichError('System', 'error while creating new entry for writer registry', { fileConfig }, err, 'error', null);
  });

module.exports = {
  model: Registry,
};
