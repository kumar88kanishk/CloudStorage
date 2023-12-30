const app = require('express')();

const path = require('path');

const initServer = require('@magcentre/init');

const logger = require('@magcentre/logger-helper');

const initMinio = require('@magcentre/minio-helper').initMinio;

const config = require('./configuration/config');

initMinio(config.minio)
    .then((e) => initServer(app, __dirname, config))
    .then((e) => {
        logger.info(`Service started on port ${config.port}`);
    })
    .catch((err) => {
        logger.error(err);
        logger.error(`Failed to start service`);
    });