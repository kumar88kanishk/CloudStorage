const { sendResult, sendError } = require('@magcentre/response-helper');
const processor = require('../processors/share.processor');

const share = (req, res) => {
  const { key } = req.body;
  processor.share(key, req.body.userIds, req.auth.sub, req.headers)
    .then((putResponse) => sendResult(putResponse, 200, res, req))
    .catch((e) => {
      sendError(e, res, 500, req);
    });
};

module.exports = {
  share,
};
