const app = require('express')();

const path = require('path');

const initServer = require('@magcentre/init');

const logger = require('@magcentre/logger-helper');

const { initMinio } = require('@magcentre/minio-helper');

const { initDatabase } = require('@magcentre/sequelize-helper');

const config = require('./configuration/config');

initDatabase(config.database, path.join(__dirname, 'model'))
  .then(() => initMinio(config.minio))
  .then(() => initServer(app, __dirname, config))
  .then(() => {
    logger.info(`Service started on port ${config.port}`);
  })
  .catch((e) => {
    logger.error(e);
    logger.error('Failed to start service');
  });
