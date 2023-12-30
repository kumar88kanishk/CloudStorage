const { getRichError } = require("@magcentre/response-helper");

const nodemailer = require("nodemailer");

const config = require('../configuration/config');

const {  model, notificationTypes } = require('../models/notification.model');

const transporter = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  secure: false,
  auth: {
    user: config.email.smtp.username,
    pass: config.email.smtp.password
  },
});

const sendEmail = ({ to, content, subject }) => {
  return transporter.sendMail({
    from: config.email.from,
    to: to.toString(),
    subject: subject,
    text: content,
  })
    .then((response) => model.create({ notificationContent: { to, content, subject }, responseContent: response, type: notificationTypes.EMAIL }))
    .catch((err) => {
      throw getRichError('System', 'error while sending email', { to, content, subject }, err, 'error', null);
    });
};

module.exports = {
  sendEmail
}