const logger = require('@magcentre/logger-helper');

module.exports = (req, res, next) => {
  const callType = req.headers['x-correlation-id'] ? 'inbound' : 'outbound';

  const operationId = req.headers['x-correlation-id'] ? req.headers['x-correlation-id'] : Date.now();

  logger.info(`Request method ${req.method} path ${req.path}`, { type: callType, operationId });

  return next();
};
