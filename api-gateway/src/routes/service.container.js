const axios = require('axios');
const logger = require('@magcentre/logger-helper');
const config = require('../config');

module.exports = {
  prefix: '/container',
  target: config.objectContainer,
  middlewares: [
    (req, res, next) => axios.get(`${config.objectContainer}/system-health`)
      .then(() => next())
      .catch((err) => {
        logger.error(err);
        res.statusCode = 400;
        res.send(JSON.stringify({ error: err }));
      }),
  ],
};
