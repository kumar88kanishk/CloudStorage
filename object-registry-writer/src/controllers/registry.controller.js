const { sendResult, sendError, getRichError } = require('@magcentre/response-helper');

const processor = require('../processors/register.process');

const upload = (req, res) => {
  if (!req.files.file) {
    const badRequestError = getRichError('Parameter', 'request must have object to upload');
    sendError(badRequestError, res, 400, req);
    return;
  }

  const fileConfig = JSON.parse(req.body.fileConfig);

  processor.upload(req.files.file.path, req.auth.sub, fileConfig)
    .then((e) => sendResult(e, 200, res, req))
    .catch((error) => sendError(error, res, 500, req));
};

module.exports = {
  upload,
};
