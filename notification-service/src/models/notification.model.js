const { mongoose } = require('@magcentre/mongoose-helper');

const notificationTypes = {
    EMAIL: 'EMAIL',
    FCM: 'FCM',
    SMS: 'SMS'
  };

const notificationSchema = mongoose.Schema(
    {

        notificationContent: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
            trim: true,
        },
        responseContent: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: [notificationTypes.EMAIL, notificationTypes.SMS, notificationTypes.FCM],
        }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

/**
 * @typedef Notifications
 */
const Notifications = mongoose.model('Notifications', notificationSchema);

module.exports = { model: Notifications, notificationTypes };