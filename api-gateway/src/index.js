const gateway = require('fast-gateway');

const logger = require('@magcentre/logger-helper');

const serviceRoutes = require('./route.generator');

const service = gateway({
  routes: serviceRoutes,
});

service.start(process.env.PORT).then(() => {
  logger.info(`Gateway Service started at ${process.env.PORT}`);
}).catch((e) => logger.error(e));
