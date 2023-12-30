const { sendError } = require('@magcentre/response-helper');
const processor = require('../processors/object.processor');

const objectView = (req, res) => {
  const key = req.swagger.params.key.raw;
  const { token } = req.query;
  processor.download(key, token, req.headers)
    .then(({ readerResponse, fileName, extension }) => {
      // set response and attach original file name
      res.header('Content-Disposition', `attachment; filename="${encodeURI(fileName)}.${extension}"`);
      // pipe the response to front-end
      readerResponse.data.pipe(res);
    }).catch((error) => {
      sendError(error, res, error.statusCode || 500, req);
    });
};

module.exports = {
  objectView,
};
