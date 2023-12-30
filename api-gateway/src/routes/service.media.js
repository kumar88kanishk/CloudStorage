const axios = require('axios');

const logger = require('@magcentre/logger-helper');

const config = require('../config');

module.exports = {
  prefix: '/media',
  target: config.media,
  middlewares: [
    (req, res, next) => axios.get(`${config.media}/system-health`)
      .then(() => next())
      .catch((err) => {
        logger.error(err);
        res.statusCode = 400;
        res.send(JSON.stringify({ error: err }));
      }),
  ],
};
