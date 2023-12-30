/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const fs = require('fs');

const path = require('path');

const logger = require('@magcentre/logger-helper');

const allRoutes = [];

const routesFolder = `${__dirname}/routes/`;

fs
  .readdirSync(routesFolder)
  .forEach((file) => {
    const route = require(path.join(routesFolder, file));
    route.hooks = {
      rewriteRequestHeaders(req, head) {
        const { headers } = req;

        const callType = req.headers['x-correlation-id'] ? 'inbound' : 'outbound';

        const correlationId = req.headers['x-correlation-id'] ? req.headers['x-correlation-id'] : Date.now();

        logger.info(`Request method ${req.method} path ${req.path}`, { type: callType, correlationId });

        headers['x-correlation-id'] = correlationId;

        return headers;
      },
    };
    allRoutes.push(route);
  });

module.exports = allRoutes;
