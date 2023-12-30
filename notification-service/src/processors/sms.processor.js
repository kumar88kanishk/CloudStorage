const { getRichError } = require('@magcentre/response-helper');

const { model, notificationTypes } = require('../models/notification.model')
const FCM = require('fcm-node');

const config = require('../configuration/config');

const fcm = new FCM(config.firebase.serverKey);

const sendSMS = (body) => {
  return new Promise(resolve => setTimeout(resolve, 1000))
    .then((e) => model.create({ notificationContent:  body, responseContent: e || 'otp response from vendor', type: notificationTypes.SMS }))
    .catch((err) => {
      throw getRichError('System', 'error while sending mobile sms', { body }, err, 'error', null);
    });

};

module.exports = {
  sendSMS
}