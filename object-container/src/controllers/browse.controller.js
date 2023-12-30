const { sendResult, sendError } = require('@magcentre/response-helper');
const processor = require('../processors/browse.processor');

const browse = (req, res) => {
  let prefix = '/';
  if (req.swagger.params.prefix) prefix = req.swagger.params.prefix.raw;
  processor.listObjects(req.auth.sub, prefix)
    .then((response) => sendResult(response, 200, res, req))
    .catch((err) => {
      sendError(err, res, err.statusCode || 500, req);
    });
};

const recent = (req, res) => {
  processor.recentList(req.auth.sub)
    .then((response) => sendResult(response, 200, res, req))
    .catch((err) => {
      sendError(err, res, err.statusCode || 500, req);
    });
};

const starred = (req, res) => {
  processor.staredList(req.auth.sub)
    .then((response) => sendResult(response, 200, res, req))
    .catch((err) => {
      sendError(err, res, err.statusCode || 500, req);
    });
};

const trashed = (req, res) => {
  processor.trashList(req.auth.sub)
    .then((response) => sendResult(response, 200, res, req))
    .catch((err) => {
      sendError(err, res, err.statusCode || 500, req);
    });
};

module.exports = {
  browse,
  recent,
  starred,
  trashed,
};
