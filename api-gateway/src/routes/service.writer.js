const axios = require('axios');
const logger = require('@magcentre/logger-helper');
const config = require('../config');

module.exports = {
  prefix: '/object-writer',
  target: config.objectWriter,
  middlewares: [
    (req, res, next) => axios.get(`${config.objectWriter}/system-health`)
      .then(() => next())
      .catch((err) => {
        logger.error(err);
        res.statusCode = 400;
        res.send(JSON.stringify({ error: err }));
      }),
  ],
};
