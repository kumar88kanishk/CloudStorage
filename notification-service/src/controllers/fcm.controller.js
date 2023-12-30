const logger = require('@magcentre/logger-helper');

const { sendResult, sendError } = require('@magcentre/response-helper');

const processor = require('../processors/fcm.processor');

const send = async (req, res) => {

  return processor.send(req.body)
    .then((e) => sendResult(e, 200, res, req))
    .catch((e) => {
      logger.error(e);
      sendError(e, res, 500, req);
    });
};


module.exports = {
  send
}