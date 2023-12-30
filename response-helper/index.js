const logger = require('@magcentre/logger-helper');
const http = require('http');
const VError = require('verror');
/**
 * @module responseHelper
 * @example
 * const responseHelper = require('@magmods/response-helper');
 */

const DEFAULT_NO_MESSAGE = 'no message';
const DEFAULT_NO_ERROR_NAME = 'no error name';
const NOT_HTTP_CODE = 'not http code';
const NO_ERROR = 'not an error object';
const LOG_LEVELS = logger.LEVELS;

/**
 * Send an error.
 *
 * @function sendError
 * @requires @magmods/sumologic-winston-logger
 * @category sync
 * @param {object} error - The error to include in the response.
 * @param {object} response - The http response object.
 * @param {number} otherErrorStatusCode - StatusCode overriding the statusCode of the error to associated with the response.
 * @param {object} options - Object containing the value to be passed.
 * @param {string} logLevel - To indicate if the response will be logged on not (`false` or `undefined` or `invalid` will indicate that the log is done with `error` level). If set to `true`, will indicate that no log should be done.
 * @return `null`.
 *
 * @description The error has the following format:
 * ``` javascript
 * {
 *    "statusCode": "http code for the response",
 *    "title": "http title associated with the http code",
 *    "message": "error.message or `no error message` if the error does not exist",
 *    "info": "information contains in the error",
 *    "infoSupplement": "extra information associated with the error"
 * }
 * ````
 * The options object has the following properties:
 * ``` javascript
 * {
 *    "method": "method of the request",
 *    "path": "path of the request",
 *    "operationId": "operation defined for that route",
 *    "correlationId": "correlationId including in the header of the request if present otherwise UUID"
 * }
 * ```
 */
const sendError = (error, response, otherErrorStatusCode, options, logLevel) => {
  response.statusCode = otherErrorStatusCode || error.statusCode || 500;
  const { statusCode } = response;
  const { method, path, operationId } = options.swagger;
  const { correlationId } = options;
  const log = (level) => {
    logger[level](`Error responding ${statusCode} for ${method} ${path}`, {
      statusCode, method, path, operationId, error,
    }, correlationId);
  };
  if (logLevel !== true) {
    if (logLevel === null || logLevel === undefined) log('error');
    else if (LOG_LEVELS.includes(logLevel)) log(logLevel);
    else log('error');
  }
  if (correlationId) response.setHeader('x-correlation-id', correlationId);
  response.setHeader('Content-Type', 'application/json');
  const respError = {
    statusCode,
    title: http.STATUS_CODES[statusCode],
    message: error && error.message ? error.message : DEFAULT_NO_MESSAGE,
  };
  if (!(error instanceof Error) && !(error instanceof VError)) respError.info = error;
  else {
    const info = VError.info(error);
    // const cause = VError.cause(error);

    if (info && Object.keys(info).length !== 0) respError.info = info;
    // if (cause && Object.keys(cause).length !== 0) respError.cause = cause;
    if (error.info) {
      if (respError.info) respError.infoSupplement = error.info;
      else respError.info = error.info;
    }
    // if (error.cause) {
    //  if (respError.cause) respError.causeSupplement = error.cause;
    //  else respError.cause = error.cause;
    // }
  }
  response.end(JSON.stringify(respError, null, 2));
};

/**
 *
 * Not implemented message to return if the action performed is not implemented.
 *
 * @function notImplemented
 * @category sync
 * @param {string} source - A message indicating which endpoint generate the response.
 * @param {object} response - The http response object.
 * @param {object} options - Object containing the value to be passed.
 * @return `null`.
 *
 * @description The error has the following format:
 * ``` javascript
 * {
 *    "statusCode": 405,
 *    "title": "Not Implemented",
 *    "message": "route not implemented",
 *    "info": {
 *       "method": "method used for the request",
 *       "path": "path of the request",
 *       "operationId": "operationId associated with the request, null or non existent if not available"
 *    }
 * }
 * ```
 * The options object has the following properties:
 * ``` javascript
 * {
 *    "method": "method of the request",
 *    "path": "path of the request",
 *    "operationId": "operation defined for that route",
 *    "correlationId": "correlationId including in the header of the request if present otherwise UUID"
 * }
 * ```
 */
const notImplemented = (source, response, options) => {
  response.statusCode = 501;
  const { method, path, operationId } = options.swagger;
  const { correlationId } = options;
  if (correlationId) response.setHeader('x-correlation-id', correlationId);

  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify({
    statusCode: response.statusCode,
    title: http.STATUS_CODES[response.statusCode],
    message: 'route not implemented',
    info: {
      method,
      path,
      operationId,
    },
  }, null, 2));
};

/**
 *
 * Send a response.
 *
 * @function sendResult
 * @requires @magmods/sumologic-winston-logger
 * @requires @magmods/lib-filters
 * @category sync
 * @param {object} result - Actual result to be send.
 * @param {number} statusCode - Http statusCode to send as part of the response.
 * @param {object} response - The http response object.
 * @param {object} options - Object containing the value to be passed.
 * @param {string} logLevel - To indicate if the response will be logged on not (`false` or `undefined` or `invalid` will indicate that the log is done with `error` level). If set to `true`, will indicate that no log should be done.
 * @return `null`.
 *
 * @description If the result contains a data fields the response is sent as is, otherwise the result is encapsulated under `data` property.
 * The options object has the following properties:
 * ``` javascript
 * {
 *    "method": "method of the request",
 *    "path": "path of the request",
 *    "operationId": "operation defined for that route",
 *    "correlationId": "correlationId including in the header of the request if present otherwise UUID"
 * }
 * ```
 */
const sendResult = (result, statusCode, response, options, logLevel) => {
  let resp;
  const { method, path, operationId } = options.swagger;
  const { correlationId } = options;
  const log = (level) => {
    logger[level](`Responding ${statusCode} for ${method} ${path}`, {
      statusCode, result, method, path, operationId,
    }, correlationId);
  };

  response.statusCode = statusCode;
  if (logLevel !== true) {
    if (logLevel === null || logLevel === undefined) log('info');
    else if (LOG_LEVELS.includes(logLevel)) log(logLevel);
    else log('info');
  }
  if (correlationId) response.setHeader('x-correlation-id', correlationId);
  response.setHeader('Content-Type', 'application/json');
  if (result && result.data) resp = result;
  else resp = { data: result };
  response.end(JSON.stringify(resp, null, 2));
};

const getErrorStatusCode = (na, er) => {
  if (!na || na === 'System') return 500;
  if (na === 'Partial') return 206;
  if (na === 'MultiStatus') return 207;
  if (na === 'Parameter' || na === 'ParameterError' || (er && er.name === 'CastError' && er.kind !== 'ObjectId')) return 400;
  if (na === 'UnAuthorized') return 401;
  if (na === 'Forbidden') return 403;
  if (na === 'NotFound' || (er && er.name === 'CastError' && er.kind === 'ObjectId')) return 404;
  if (na === 'NotImplemented') return 405;
  if (na === 'Conflict' || (er && er.name === 'EntryError')) return 409;
  if (na === 'Unprocessable') return 422;
  return 500;
};

const getErrorIds = (num) => {
  if (num === 500) return [num, 'System', http.STATUS_CODES[num]];
  if (num === 400) return [num, 'Parameter', http.STATUS_CODES[num]];
  if (num === 401) return [num, 'UnAuthorized', http.STATUS_CODES[num]];
  if (num === 403) return [num, 'Forbidden', http.STATUS_CODES[num]];
  if (num === 404) return [num, 'NotFound', http.STATUS_CODES[num]];
  if (num === 405) return [num, 'NotImplemented', http.STATUS_CODES[num]];
  if (num === 409) return [num, 'Conflict', http.STATUS_CODES[num]];
  if (num === 420) return [num, 'Unprocessable', http.STATUS_CODES[num]];
  if (http.STATUS_CODES[num]) return [num, http.STATUS_CODES[num], http.STATUS_CODES[num]];
  return [500, DEFAULT_NO_ERROR_NAME, NOT_HTTP_CODE];
};

/**
 *
 * Create a rich error.
 *
 * @function getRichError
 * @requires @magmods/sumologic-winston-logger
 * @category sync
 * @param {object} val - If it is a string it represents the name of the error, if it is a number it represents the code of the error (e.g. 400, 500, ....). Invalid string or number will result to a 500 Internal Error title.
 * @param {string} message - Message to associated with the error.
 * @param {object} info - Info as a JSON object to associate to the error.
 * @param {object} err - Error to encapsulate in the created error as a cause.
 * @param {string} logLevel - Indicates if the error needs to be log at creation with a specific level. If logLevel is `false` a error log will be created with `error`` level.
 * @param {string} correlationId - CorrelationId to be added to the log when log is enabled.
 * @return {object} The rich error.
 *
 * The error object if a [vError](https://www.npmjs.com/package/verror) object with the following:
 * ``` javascript
 * {
 *    "name": "name of the error",
 *    "info": "info of the error",
 *    "cause": "encapsulated error",
 *    "message": "message of the error"
 * }
 * ```
 */
const getRichError = (val, message, info, origErr, logLevel, correlationId) => {
  const buildCause = (err) => {
    if (err === undefined || err === null || err instanceof VError) return err;
    const tempError = new Error(DEFAULT_NO_MESSAGE);

    if (err instanceof Error) {
      if (err.message) tempError.message = err.message;
      if (err.name) tempError.name = err.name;
      if (err.info) tempError.info = err.info;
      if (err.cause) tempError.cause = err.cause;
      if (err.statusCode) tempError.statusCode = err.statusCode;
      if (err.body) {
        Object.keys(err.body).forEach((key) => { tempError[key] = err.body[key]; });
      }
      else if (err.error) {
        Object.keys(err.error).forEach((key) => { tempError[key] = err.error[key]; });
      }
      if (tempError.statusCode) {
        tempError.title = err.title || http.STATUS_CODES[err.statusCode] || NOT_HTTP_CODE;
      }
      return tempError;
    }
    if (typeof err === 'object') {
      Object.keys(err).forEach((key) => { tempError[key] = err[key]; });
      return tempError;
    }
    if (typeof err === 'string' || typeof err === 'number') {
      tempError.message = err;
      return tempError;
    }
    tempError.message = NO_ERROR;
    tempError.info = err;
    return tempError;
  };
  let ids;
  const error = buildCause(origErr);

  if (typeof val === 'number') ids = getErrorIds(val);
  else ids = getErrorIds(getErrorStatusCode(val, error));
  const options = {
    name: ids[1],
    info,
  };

  if (error) options.cause = error;
  const verror = new VError(options, message || DEFAULT_NO_MESSAGE);
  const log = (level) => {
    const cause = {};
    const vCause = VError.cause(verror);

    if (vCause) Object.keys(vCause).forEach((key) => { cause[key] = vCause[key]; });
    logger[level](verror.message, {
      statusCode: verror.statusCode, name: verror.name, info: VError.info(verror), cause,
    }, correlationId);
  };

  [verror.statusCode, , verror.title] = ids;
  // if hide is undefined or null we should not log. hide has to be explicitely set to false.
  if (logLevel !== null && logLevel !== undefined) {
    if (logLevel === false) log('error');
    else if (LOG_LEVELS.includes(logLevel)) log(logLevel);
    else if (logLevel !== true) log('error');
  }
  return verror;
};

module.exports = {
  sendError,
  notImplemented,
  sendResult,
  getRichError,
};
