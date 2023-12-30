const { sendResult, sendError, getRichError } = require('@magcentre/response-helper');

const processor = require('../processors/bucket.processor');

const bucketCreate = (req, res) => {
  processor.checkAndCreateBucket(req.body.bucketName)
    .then(() => sendResult({ bucketName: req.body.bucketName, message: 'Bucket created' }, 200, res, req))
    .catch((e) => {
      sendError(e, res, e.statusCode || 500, req);
    });
};

const bucketExists = (req, res) => {
  processor.verifyBucket(req.body.bucketName)
    .then(() => sendResult({ bucketName: req.body.bucketName, message: 'Bucket exists' }, 200, res, req))
    .catch((e) => {
      sendError(e, res, e.statusCode || 500, req);
    });
};

const bucketUpload = (req, res) => {
  // check if the request contains the file
  if (!req.files.file) {
    // return invalid request
    const badRequestError = sendError('Parameter', 'request must have object to upload');
    sendError(badRequestError, res, 400, req);
  }

  // formate the file
  const file = {
    ...req.files.file,
    name: req.body.path || req.files.file.name,
    bucket: req.auth.sub,
  };

  processor.bucketUpload(req.files.file.path, file, req.auth.sub, req.headers)
    .then((response) => processor.postProcess(req.files.file.path, response.data.data, file))
    .then((e) => sendResult(e, 200, res, req))
    .catch((error) => {
      getRichError('System', 'Bucket Upload', { message: 'Unable to upload' }, error, 'error', null);
      sendError(error, res, 500, req);
    });
};

const folderCreate = (req, res) => {
  processor.folderCreate(req.auth.sub, req.body.folderName, req.body.pathKey)
    .then((putResponse) => sendResult(putResponse, 200, res, req))
    .catch((e) => {
      sendError(e, res, e.statusCode || 500, req);
    });
};

const folderUpdate = (req, res) => {
  processor.folderUpdate(req.body.key, req.auth.sub, req.body.properties)
    .then((updateResponse) => sendResult(updateResponse, 200, res, req))
    .catch((e) => {
      sendError(e, res, 500, req);
    });
};

const folderRename = (req, res) => {
  processor.folderRename(req.auth.sub, req.body.name, req.body.pathKey, req.body.parentKey)
    .then((putResponse) => sendResult(putResponse, 200, res, req))
    .catch((e) => {
      sendError(e, res, 500, req);
    });
};

const fileUpdate = (req, res) => {
  processor.fileUpdate(req.body.key, req.auth.sub, req.body.properties)
    .then((putResponse) => sendResult(putResponse, 200, res, req))
    .catch((e) => {
      sendError(e, res, 500, req);
    });
};

const fileRename = (req, res) => {
  processor.fileRename(req.auth.sub, req.body.name, req.body.pathKey, req.body.parentKey)
    .then((putResponse) => sendResult(putResponse, 200, res, req))
    .catch((e) => {
      sendError(e, res, 500, req);
    });
};

module.exports = {
  bucketCreate,
  bucketExists,
  bucketUpload,
  folderCreate,
  folderUpdate,
  folderRename,
  fileRename,
  fileUpdate,
};
