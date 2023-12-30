const processor = require('../processors/register.process');

const { sendError } = require('@magcentre/response-helper');

const logger = require('@magcentre/logger-helper');

const download = (req, res) => {
    let objectStream = processor.getObject(req.swagger.params.key.raw, req.auth.sub);
    if (objectStream) {
        logger.info(`Responding with 200 with registry key ${req.swagger.params.key.raw}`);
        objectStream.pipe(res);
    } else {
        sendError({ message: "Object not found" }, res, 404, req);
    }
};

module.exports = {
    download,
};
