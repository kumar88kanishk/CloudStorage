const logger = require('@magcentre/logger-helper');

const { sendResult, sendError } = require('@magcentre/response-helper');

const processor = require('../processors/sms.processor');

const send = async (req, res) => {

  return processor.sendSMS(req.body)
    .then((e) => sendResult(e, 200, res, req))
    .catch((e) => {
      logger.error(e);
      sendError(e, res, 500, req);
    });
};


module.exports = {
  send
}