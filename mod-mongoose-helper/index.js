const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const logger = require('@magcentre/logger-helper');

let initDatabase = (connectionConfig, __dirname) => {

    const { url, options } = connectionConfig;

    return new Promise((resolve, reject) => {
        mongoose.connect(url, options).then(() => {
            logger.info("Connected to MongoDB");
            fs
                .readdirSync(__dirname)
                .forEach(file => {
                    require(path.join(__dirname, file));
                });
                resolve(true);

        }).catch((error) => {
            logger.error(error);
            reject(error);
        });
    });
}


module.exports = {
    initDatabase,
    mongoose
};