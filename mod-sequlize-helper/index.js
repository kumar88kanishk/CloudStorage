
const { Sequelize } = require('sequelize');

const fs = require('fs');

const path = require('path');

let models = {};

let initDatabase = (connectionConfig, __dirname) => {

    const { host, port, user, password, database } = connectionConfig;

    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql', host: host, port: port, logging: false });
    
    fs
    .readdirSync(__dirname)
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize);
        models[model.name] = model;
    });

    return sequelize.sync();
}


module.exports = {
    models,
    initDatabase,
    Sequelize
}

