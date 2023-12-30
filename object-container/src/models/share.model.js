const { mongoose } = require('@magcentre/mongoose-helper');

const { getRichError } = require('@magcentre/response-helper');

const shareSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    bucket: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

shareSchema.index({ key: 1, user: 1 }, { unique: 1 });

/**
 * @typedef Shares
 */
const Shares = mongoose.model('shares', shareSchema);

Shares.createOrUpdate = (body, user) => Shares.findOneAndUpdate({
  key: body.key, bucket: user, user, sharedWith: body.userIds,
})
  .then((e) => {
    if (e) return e;
    return Shares.create({
      key: body.key, bucket: user, user, sharedWith: body.userIds,
    });
  })
  .catch((err) => {
    throw getRichError('System', 'error while creating or updating entry for the share object', { body }, err, 'error', null);
  });
module.exports = {
  model: Shares,
};
