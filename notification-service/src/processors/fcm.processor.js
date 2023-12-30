const FCM = require('fcm-node');

const config = require('../configuration/config');

const fcm = new FCM(config.firebase.serverKey);

const { getRichError } = require('@magcentre/response-helper');

const { model, notificationTypes } = require('../models/notification.model');

const send = (payload) => {
  return new Promise((resolve, reject) => {
    fcm.send(payload, (err, data) => {
      if (err) reject(getRichError('System', 'unable to push notifications with payload', { payload }, err, 'error', null));
      model.create({ notificationContent: payload, responseContent: data, type: notificationTypes.FCM })
        .then((e) => {
          resolve(e);
        }).catch((e) => reject(getRichError('System', 'unable to send FCM notification', { payload }, err, 'error', null)));
    });
  });
};

module.exports = {
  send
}