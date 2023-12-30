// const chai = require('chai');
// const sinon = require('sinon');
// const rewire = require('rewire');
// const http = require('http');
// const httpMock = require('node-mocks-http');
// const VError = require('verror');
// require('./testEnv');
// const logger = require('@moagmods/sumologic-winston-logger');
// const filter = require('@moagmods/lib-filters');

// const ResponseHelper = rewire('../index');

// const { expect } = chai;
// chai.should();

// const GET = '__get__';
// const DEFAULT_NO_MESSAGE = 'no message';
// const NO_ERROR = 'not an error object';

// describe('response-helper Unit Tests', () => {
//   const correlationId = '--response-helper-test--';
//   const options = {
//     swagger: {
//       method: 'TEST',
//       path: '/test/path',
//       operationId: 'testFunction',
//     },
//     correlationId,
//   };
//   let loggerSpyError;
//   let loggerSpyWarn;
//   let loggerSpyInfo;
//   let responseEndSpy;
//   const getErrorStatusCode = ResponseHelper[GET]('getErrorStatusCode');

//   describe('sendError(error, response, otherErrorStatusCode, options, logLevel)', () => {
//     const errorMessage = 'error message';
//     const error = new Error(errorMessage);
//     let verror;
//     error.results = {};
//     const statusCode = 400;
//     const response = httpMock.createResponse();

//     before(() => {
//       loggerSpyError = sinon.spy(logger, 'error');
//       loggerSpyWarn = sinon.spy(logger, 'warn');
//       responseEndSpy = sinon.spy(response, 'end');
//     });
//     after(() => {
//       loggerSpyWarn.restore();
//       loggerSpyError.restore();
//       responseEndSpy.restore();
//     });
//     it('should set the required headers, process and send the response with an error and call logger.error because logLevel does not exist', () => {
//       ResponseHelper.sendError(error, response, statusCode, options);

//       sinon.assert.calledOnce(loggerSpyError);
//       const callArgs = loggerSpyError.getCall(0).args;
//       expect(callArgs[0]).to.be.a('string');
//       expect(callArgs[1]).to.deep.equal({
//         statusCode, error, method: options.swagger.method, path: options.swagger.path, operationId: options.swagger.operationId,
//       });

//       expect(response.statusCode).to.equal(statusCode);
//       expect(response.getHeader('x-correlation-id')).to.equal(correlationId);
//       expect(response.getHeader('Content-Type')).to.equal('application/json');

//       const errorObject = {
//         statusCode: response.statusCode,
//         title: http.STATUS_CODES[response.statusCode],
//         message: error.message,
//         validationErrors: undefined,
//       };
//       sinon.assert.calledOnce(responseEndSpy);
//       expect(responseEndSpy.getCall(0).args[0]).to.equal(JSON.stringify(errorObject, null, 2));
//     });
//     it('should set the required headers, process and send the response with an error with info and call logger.error because logLevel does not exist', () => {
//       loggerSpyError.restore();
//       responseEndSpy.restore();
//       responseEndSpy = sinon.spy(response, 'end');

//       error.info = 'information in error';
//       ResponseHelper.sendError(error, response, statusCode, options);

//       sinon.assert.calledOnce(loggerSpyError);
//       const callArgs = loggerSpyError.getCall(0).args;
//       expect(callArgs[0]).to.be.a('string');
//       expect(callArgs[1]).to.deep.equal({
//         statusCode, error, method: options.swagger.method, path: options.swagger.path, operationId: options.swagger.operationId,
//       });

//       expect(response.statusCode).to.equal(statusCode);
//       expect(response.getHeader('x-correlation-id')).to.equal(correlationId);
//       expect(response.getHeader('Content-Type')).to.equal('application/json');

//       const errorObject = {
//         statusCode: response.statusCode,
//         title: http.STATUS_CODES[response.statusCode],
//         message: error.message,
//         info: error.info,
//         validationErrors: undefined,
//       };
//       sinon.assert.calledOnce(responseEndSpy);
//       expect(responseEndSpy.getCall(0).args[0]).to.equal(JSON.stringify(errorObject, null, 2));
//     });
//     it('should set the required headers, process and send the response and call logger.error because logLevel is false', () => {
//       loggerSpyError.restore();
//       responseEndSpy.restore();
//       ResponseHelper.sendError(error, response, statusCode, options, false);

//       sinon.assert.calledOnce(loggerSpyError);
//       const callArgs = loggerSpyError.getCall(0).args;
//       expect(callArgs[0]).to.be.a('string');
//       expect(callArgs[1]).to.deep.equal({
//         statusCode, error, method: options.swagger.method, path: options.swagger.path, operationId: options.swagger.operationId,
//       });

//       expect(response.statusCode).to.equal(statusCode);
//       expect(response.getHeader('x-correlation-id')).to.equal(correlationId);
//       expect(response.getHeader('Content-Type')).to.equal('application/json');

//       const errorObject = {
//         statusCode: response.statusCode,
//         title: http.STATUS_CODES[response.statusCode],
//         message: error.message,
//         info: error.info,
//         validationErrors: undefined,
//       };
//       sinon.assert.calledOnce(responseEndSpy);
//       expect(responseEndSpy.getCall(0).args[0]).to.equal(JSON.stringify(errorObject, null, 2));
//     });
//     it('should set the required headers, process and send the response and call logger.warn because logLevel is warn', () => {
//       responseEndSpy.restore();
//       ResponseHelper.sendError(error, response, statusCode, options, 'warn');

//       sinon.assert.calledOnce(loggerSpyWarn);
//       const callArgs = loggerSpyWarn.getCall(0).args;
//       expect(callArgs[0]).to.be.a('string');
//       expect(callArgs[1]).to.deep.equal({
//         statusCode, error, method: options.swagger.method, path: options.swagger.path, operationId: options.swagger.operationId,
//       });

//       expect(response.statusCode).to.equal(statusCode);
//       expect(response.getHeader('x-correlation-id')).to.equal(correlationId);
//       expect(response.getHeader('Content-Type')).to.equal('application/json');

//       const errorObject = {
//         statusCode: response.statusCode,
//         title: http.STATUS_CODES[response.statusCode],
//         message: error.message,
//         info: error.info,
//         validationErrors: undefined,
//       };
//       sinon.assert.calledOnce(responseEndSpy);
//       expect(responseEndSpy.getCall(0).args[0]).to.equal(JSON.stringify(errorObject, null, 2));
//     });
//     it('should set the required headers, process and send the response with a VError with info and call logger.error because logLevel does not exist', () => {
//       loggerSpyError.restore();
//       responseEndSpy.restore();
//       responseEndSpy = sinon.spy(response, 'end');

//       verror = new VError({
//         info: 'information in vError',
//       }, errorMessage);
//       ResponseHelper.sendError(verror, response, statusCode, options);

//       sinon.assert.calledOnce(loggerSpyError);
//       const callArgs = loggerSpyError.getCall(0).args;
//       expect(callArgs[0]).to.be.a('string');
//       expect(callArgs[1]).to.deep.equal({
//         statusCode, error, method: options.swagger.method, path: options.swagger.path, operationId: options.swagger.operationId,
//       });

//       expect(response.statusCode).to.equal(statusCode);
//       expect(response.getHeader('x-correlation-id')).to.equal(correlationId);
//       expect(response.getHeader('Content-Type')).to.equal('application/json');

//       const errorObject = {
//         statusCode: response.statusCode,
//         title: http.STATUS_CODES[response.statusCode],
//         message: error.message,
//         info: VError.info(verror),
//         validationErrors: undefined,
//       };
//       sinon.assert.calledOnce(responseEndSpy);
//       expect(responseEndSpy.getCall(0).args[0]).to.equal(JSON.stringify(errorObject, null, 2));
//     });
//     it('should set the required headers, process and send the response with a VError with info and supplementary info and call logger.error because logLevel does not exist', () => {
//       loggerSpyError.restore();
//       responseEndSpy.restore();
//       responseEndSpy = sinon.spy(response, 'end');

//       verror.info = 'supplementatary information in VError';
//       ResponseHelper.sendError(verror, response, statusCode, options);

//       sinon.assert.calledOnce(loggerSpyError);
//       const callArgs = loggerSpyError.getCall(0).args;
//       expect(callArgs[0]).to.be.a('string');
//       expect(callArgs[1]).to.deep.equal({
//         statusCode, error, method: options.swagger.method, path: options.swagger.path, operationId: options.swagger.operationId,
//       });

//       expect(response.statusCode).to.equal(statusCode);
//       expect(response.getHeader('x-correlation-id')).to.equal(correlationId);
//       expect(response.getHeader('Content-Type')).to.equal('application/json');

//       const errorObject = {
//         statusCode: response.statusCode,
//         title: http.STATUS_CODES[response.statusCode],
//         message: error.message,
//         info: VError.info(verror),
//         infoSupplement: verror.info,
//         validationErrors: undefined,
//       };
//       sinon.assert.calledOnce(responseEndSpy);
//       expect(responseEndSpy.getCall(0).args[0]).to.equal(JSON.stringify(errorObject, null, 2));
//     });
//     it('should set the required headers, process and send the response with a non error and call logger.error because logLevel does not exist', () => {
//       loggerSpyError.restore();
//       responseEndSpy.restore();
//       responseEndSpy = sinon.spy(response, 'end');

//       const nonError = 'a string';
//       ResponseHelper.sendError(nonError, response, statusCode, options);

//       sinon.assert.calledOnce(loggerSpyError);
//       const callArgs = loggerSpyError.getCall(0).args;
//       expect(callArgs[0]).to.be.a('string');
//       expect(callArgs[1]).to.deep.equal({
//         statusCode, error, method: options.swagger.method, path: options.swagger.path, operationId: options.swagger.operationId,
//       });

//       expect(response.statusCode).to.equal(statusCode);
//       expect(response.getHeader('x-correlation-id')).to.equal(correlationId);
//       expect(response.getHeader('Content-Type')).to.equal('application/json');

//       const errorObject = {
//         statusCode: response.statusCode,
//         title: http.STATUS_CODES[response.statusCode],
//         message: DEFAULT_NO_MESSAGE,
//         info: nonError,
//         validationErrors: undefined,
//       };
//       sinon.assert.calledOnce(responseEndSpy);
//       expect(responseEndSpy.getCall(0).args[0]).to.equal(JSON.stringify(errorObject, null, 2));
//     });
//   });

//   describe('notImplemented(source, response, correlationId)', () => {
//     const response = httpMock.createResponse();
//     const notImplementedStatusCode = 501;
//     const source = 'source_qa';

//     before(() => {
//       responseEndSpy = sinon.spy(response, 'end');
//     });
//     it(`should send error response with status ${notImplementedStatusCode} and set required headers`, () => {
//       ResponseHelper.notImplemented(source, response, options);

//       expect(response.statusCode).to.equal(notImplementedStatusCode);
//       expect(response.getHeader('x-correlation-id')).to.equal(correlationId);
//       expect(response.getHeader('Content-Type')).to.equal('application/json');

//       const responseObject = {
//         statusCode: notImplementedStatusCode,
//         title: http.STATUS_CODES[notImplementedStatusCode],
//         message: 'route not implemented',
//         info: {
//           method: options.swagger.method,
//           path: options.swagger.path,
//           operationId: options.swagger.operationId,
//         },
//       };
//       sinon.assert.calledOnce(responseEndSpy);
//       expect(responseEndSpy.getCall(0).args[0]).to.equal(JSON.stringify(responseObject, null, 2));
//     });
//   });

//   describe('sendResult(result, statusCode, response, options, logLevel)', () => {
//     const result = { data: { a: 'b' } };
//     const noDataResult = { a: 'b', c: 'd' };
//     const statusCode = 207;
//     const response = httpMock.createResponse();

//     before(() => {
//       loggerSpyInfo = sinon.spy(logger, 'info');
//       loggerSpyError = sinon.spy(logger, 'error');
//       responseEndSpy = sinon.spy(response, 'end');
//     });
//     after(() => {
//       loggerSpyInfo.restore();
//       loggerSpyError.restore();
//       responseEndSpy.restore();
//     });
//     it('should set the required headers, process and send the response encapsulated in data and call logger.info because logLevel does not exist', () => {
//       ResponseHelper.sendResult(noDataResult, statusCode, response, options);

//       sinon.assert.calledOnce(loggerSpyInfo);
//       const callArgs = loggerSpyInfo.getCall(0).args;
//       expect(callArgs[0]).to.be.a('string');
//       expect(callArgs[1]).to.deep.equal({
//         statusCode, method: options.swagger.method, operationId: options.swagger.operationId, path: options.swagger.path, result: filter.lengthyString(noDataResult),
//       });

//       expect(response.statusCode).to.equal(statusCode);
//       expect(response.getHeader('x-correlation-id')).to.equal(correlationId);
//       expect(response.getHeader('Content-Type')).to.equal('application/json');

//       sinon.assert.calledOnce(responseEndSpy);
//       expect(responseEndSpy.getCall(0).args[0]).to.equal(JSON.stringify({ data: noDataResult }, null, 2));
//     });
//     it('should set the required headers, process and send the response and call logger.info because logLevel is false', () => {
//       loggerSpyInfo.restore();
//       responseEndSpy.restore();
//       responseEndSpy = sinon.spy(response, 'end');
//       loggerSpyInfo = sinon.spy(logger, 'info');

//       ResponseHelper.sendResult(result, statusCode, response, options, false);

//       sinon.assert.calledOnce(loggerSpyInfo);
//       const callArgs = loggerSpyInfo.getCall(0).args;
//       expect(callArgs[0]).to.be.a('string');
//       expect(callArgs[1]).to.deep.equal({
//         statusCode, method: options.swagger.method, operationId: options.swagger.operationId, path: options.swagger.path, result: filter.lengthyString(result),
//       });

//       expect(response.statusCode).to.equal(statusCode);
//       expect(response.getHeader('x-correlation-id')).to.equal(correlationId);
//       expect(response.getHeader('Content-Type')).to.equal('application/json');

//       sinon.assert.calledOnce(responseEndSpy);
//       expect(responseEndSpy.getCall(0).args[0]).to.equal(JSON.stringify(result, null, 2));
//     });
//     it('should set the required headers, process and send the response and call logger.info because logLevel is info', () => {
//       loggerSpyInfo.restore();
//       responseEndSpy.restore();
//       ResponseHelper.sendResult(result, statusCode, response, options, 'info');

//       sinon.assert.calledOnce(loggerSpyInfo);
//       const callArgs = loggerSpyInfo.getCall(0).args;
//       expect(callArgs[0]).to.be.a('string');
//       expect(callArgs[1]).to.deep.equal({
//         statusCode, method: options.swagger.method, operationId: options.swagger.operationId, path: options.swagger.path, result: filter.lengthyString(result),
//       });

//       expect(response.statusCode).to.equal(statusCode);
//       expect(response.getHeader('x-correlation-id')).to.equal(correlationId);
//       expect(response.getHeader('Content-Type')).to.equal('application/json');

//       sinon.assert.calledOnce(responseEndSpy);
//       expect(responseEndSpy.getCall(0).args[0]).to.equal(JSON.stringify(result, null, 2));
//     });
//     it('should set the required headers, process and send the response and call logger.error because logLevel is error', () => {
//       responseEndSpy.restore();
//       ResponseHelper.sendResult(result, statusCode, response, options, 'error');

//       sinon.assert.calledOnce(loggerSpyError);
//       const callArgs = loggerSpyError.getCall(0).args;
//       expect(callArgs[0]).to.be.a('string');
//       expect(callArgs[1]).to.deep.equal({
//         statusCode, method: options.swagger.method, operationId: options.swagger.operationId, path: options.swagger.path, result: filter.lengthyString(result),
//       });

//       expect(response.statusCode).to.equal(statusCode);
//       expect(response.getHeader('x-correlation-id')).to.equal(correlationId);
//       expect(response.getHeader('Content-Type')).to.equal('application/json');

//       sinon.assert.calledOnce(responseEndSpy);
//       expect(responseEndSpy.getCall(0).args[0]).to.equal(JSON.stringify(result, null, 2));
//     });
//     it('should set the required headers, process and send the response and call logger.info because logLevel does not exist', () => {
//       responseEndSpy.restore();
//       loggerSpyInfo.restore();
//       ResponseHelper.sendResult(result, statusCode, response, options);

//       sinon.assert.calledOnce(loggerSpyInfo);
//       const callArgs = loggerSpyInfo.getCall(0).args;
//       expect(callArgs[0]).to.be.a('string');
//       expect(callArgs[1]).to.deep.equal({
//         statusCode, method: options.swagger.method, operationId: options.swagger.operationId, path: options.swagger.path, result: filter.lengthyString(result),
//       });

//       expect(response.statusCode).to.equal(statusCode);
//       expect(response.getHeader('x-correlation-id')).to.equal(correlationId);
//       expect(response.getHeader('Content-Type')).to.equal('application/json');

//       sinon.assert.calledOnce(responseEndSpy);
//       expect(responseEndSpy.getCall(0).args[0]).to.equal(JSON.stringify(result, null, 2));
//     });
//   });

//   describe('private getErrorStatusCode(na, er)', () => {
//     it('should return 500 on system error', () => {
//       const output = getErrorStatusCode('System', {});
//       expect(output).to.equal(500);
//     });
//     it('should return 500 on no error', () => {
//       const output = getErrorStatusCode(null, {});
//       expect(output).to.equal(500);
//     });
//     it('should return 500 on unknown error', () => {
//       const output = getErrorStatusCode('unknown', {});
//       expect(output).to.equal(500);
//     });
//     it('should return 206 on Partial error/response', () => {
//       const output = getErrorStatusCode('Partial', {});
//       expect(output).to.equal(206);
//     });
//     it('should return 207 on MultiStatus error', () => {
//       const output = getErrorStatusCode('MultiStatus', {});
//       expect(output).to.equal(207);
//     });
//     it('should return 422 on Unprocessable error', () => {
//       const output = getErrorStatusCode('Unprocessable', {});
//       expect(output).to.equal(422);
//     });
//     it('should return 400 on Parameter error', () => {
//       const output = getErrorStatusCode('Parameter', {});
//       expect(output).to.equal(400);
//     });
//     it('should return 400 on ParameterError error', () => {
//       const output = getErrorStatusCode('ParameterError', {});
//       expect(output).to.equal(400);
//     });
//     it('should return 404 on NotFound error', () => {
//       const output = getErrorStatusCode('NotFound', {});
//       expect(output).to.equal(404);
//     });
//     it('should return 404 on Conflict error', () => {
//       const output = getErrorStatusCode('Conflict', {});
//       expect(output).to.equal(409);
//     });
//     it('should return 401 on UnAuthorized error', () => {
//       const output = getErrorStatusCode('UnAuthorized', {});
//       expect(output).to.equal(401);
//     });
//     it('should return 401 on Forbidden error', () => {
//       const output = getErrorStatusCode('Forbidden', {});
//       expect(output).to.equal(403);
//     });
//     it('should return 401 on NotImplemented error', () => {
//       const output = getErrorStatusCode('NotImplemented', {});
//       expect(output).to.equal(405);
//     });
//     it('should return 409 on Conflict error', () => {
//       const output = getErrorStatusCode('RandomError', { name: 'EntryError' });
//       expect(output).to.equal(409);
//     });
//     it('should return 400 on CastError error.name with no error.kind', () => {
//       const output = getErrorStatusCode('RandomError', { name: 'CastError' });
//       expect(output).to.equal(400);
//     });
//     it('should return 404 on CastError error.name with ObjectId error.kind', () => {
//       const output = getErrorStatusCode('RandomError', { name: 'CastError', kind: 'ObjectId' });
//       expect(output).to.equal(404);
//     });
//   });

//   describe('getRichError(name, message, info, err, logLevel, correlationId)', () => {
//     const name = 'NotFound';
//     const message = 'item not found';
//     const info = 'information of the error';
//     let cause = new VError(message);
//     let error = new VError(DEFAULT_NO_MESSAGE);
//     cause.name = 'someName';
//     let errorObject = new VError({
//       name,
//       info,
//       cause,
//     }, message);
//     errorObject.statusCode = getErrorStatusCode(name, cause);
//     errorObject.title = http.STATUS_CODES[errorObject.statusCode];

//     before(() => {
//       loggerSpyError = sinon.spy(logger, 'error');
//       loggerSpyInfo = sinon.spy(logger, 'info');
//       loggerSpyWarn = sinon.spy(logger, 'warn');
//     });
//     after(() => {
//       loggerSpyError.restore();
//       loggerSpyWarn.restore();
//       loggerSpyInfo.restore();
//     });
//     it('should return the rich error object and call logger.error because the logLevel value is unknown', () => {
//       const output = ResponseHelper.getRichError(name, message, info, cause, 'unknown', correlationId);

//       sinon.assert.calledOnce(loggerSpyError);
//       const callArgs = loggerSpyError.getCall(0).args;
//       expect(callArgs[0]).to.equal(errorObject.message);
//       expect(callArgs[1].statusCode).to.equal(errorObject.statusCode);
//       expect(callArgs[1].name).to.equal(errorObject.name);
//       expect(callArgs[1].info).to.deep.equal(VError.info(errorObject));
//       expect(callArgs[2]).to.equal(correlationId);
//       expect(output).to.deep.equal(errorObject);
//     });
//     it('should return the rich error object and call logger.info because the logLevel value is info', () => {
//       const output = ResponseHelper.getRichError(name, message, info, cause, 'info', correlationId);

//       sinon.assert.calledOnce(loggerSpyInfo);
//       const callArgs = loggerSpyInfo.getCall(0).args;
//       expect(callArgs[0]).to.equal(errorObject.message);
//       expect(callArgs[0]).to.equal(errorObject.message);
//       expect(callArgs[1].statusCode).to.equal(errorObject.statusCode);
//       expect(callArgs[1].name).to.equal(errorObject.name);
//       expect(callArgs[1].info).to.deep.equal(VError.info(errorObject));
//       expect(callArgs[2]).to.equal(correlationId);
//       expect(output).to.deep.equal(errorObject);
//     });
//     it('should return the rich error object and call logger.err because the logLevel value is false', () => {
//       loggerSpyError.restore();
//       loggerSpyError = sinon.spy(logger, 'error');
//       const output = ResponseHelper.getRichError(name, message, info, cause, false, correlationId);

//       sinon.assert.calledOnce(loggerSpyError);
//       const callArgs = loggerSpyError.getCall(0).args;
//       expect(callArgs[0]).to.equal(errorObject.message);
//       expect(callArgs[1].statusCode).to.equal(errorObject.statusCode);
//       expect(callArgs[1].name).to.equal(errorObject.name);
//       expect(callArgs[1].info).to.deep.equal(VError.info(errorObject));
//       expect(callArgs[2]).to.equal(correlationId);
//       expect(output).to.deep.equal(errorObject);
//     });
//     it('should return the rich error object even if the err is non existent', () => {
//       const output = ResponseHelper.getRichError(name, message, info);

//       errorObject = new VError({
//         name,
//         info,
//       }, message);
//       errorObject.statusCode = getErrorStatusCode(name, error.message);
//       errorObject.title = http.STATUS_CODES[errorObject.statusCode];

//       expect(output.message).to.equal(errorObject.message);
//       expect(output.name).to.equal(errorObject.name);
//       expect(output.statusCode).to.equal(errorObject.statusCode);
//       expect(output.title).to.equal(errorObject.title);
//       expect(VError.info(output)).to.deep.equal(VError.info(errorObject));
//     });
//     it('should return the rich error object even if the err is a string', () => {
//       cause = 'a string message';
//       const output = ResponseHelper.getRichError(name, message, info, cause);

//       error.message = cause;
//       errorObject = new VError({
//         name,
//         info,
//         cause: error,
//       }, message);
//       errorObject.statusCode = getErrorStatusCode(name, error.message);
//       errorObject.title = http.STATUS_CODES[errorObject.statusCode];

//       expect(output.message).to.equal(errorObject.message);
//       expect(output.name).to.equal(errorObject.name);
//       expect(output.statusCode).to.equal(errorObject.statusCode);
//       expect(output.title).to.equal(errorObject.title);
//       expect(VError.info(output)).to.deep.equal(VError.info(errorObject));
//       expect(VError.cause(output).message).to.deep.equal(VError.cause(errorObject).message);
//     });
//     it('should return the rich error object even if the err is an object', () => {
//       cause = {
//         a: 'test',
//       };
//       const output = ResponseHelper.getRichError(name, message, info, cause);

//       error.message = DEFAULT_NO_MESSAGE;
//       Object.keys(cause).forEach((key) => { error[key] = cause[key]; });
//       errorObject = new VError({
//         name,
//         info,
//         cause: error,
//       }, message);
//       errorObject.statusCode = getErrorStatusCode(name, error.message);
//       errorObject.title = http.STATUS_CODES[errorObject.statusCode];

//       expect(output.message).to.equal(errorObject.message);
//       expect(VError.cause(output).message).to.equal(VError.cause(errorObject).message);
//     });
//     it('should return the rich error object even if the err is an object but err.message exist', () => {
//       cause = {
//         a: 'test',
//         message: 'a object message',
//       };
//       const output = ResponseHelper.getRichError(name, message, info, cause);

//       Object.keys(cause).forEach((key) => { error[key] = cause[key]; });
//       errorObject = new VError({
//         name,
//         info,
//         cause: error,
//       }, message);
//       errorObject.statusCode = getErrorStatusCode(name, error.message);
//       errorObject.title = http.STATUS_CODES[errorObject.statusCode];

//       expect(output.message).to.equal(errorObject.message);
//       expect(VError.cause(output).message).to.equal(VError.cause(errorObject).message);
//     });
//     it('should return the rich error object even if the err is not an error, vError, object, string or a number', () => {
//       cause = (test) => {
//         logger.info(`this is a test: ${test}`, { test });
//       };
//       const output = ResponseHelper.getRichError(name, message, info, cause);

//       error = new VError({
//         info: cause,
//       }, NO_ERROR);
//       error.info = cause;
//       errorObject = new VError({
//         name,
//         info,
//         cause: error,
//       }, message);
//       errorObject.statusCode = getErrorStatusCode(name, error.message);
//       errorObject.title = http.STATUS_CODES[errorObject.statusCode];

//       expect(output.message).to.equal(errorObject.message);
//       expect(VError.cause(output).message).to.equal(VError.cause(errorObject).message);
//       expect(VError.info(output)).to.deep.equal(VError.info(errorObject));
//     });
//     it('should return the rich error object if the err is a Error with no extra attribute', () => {
//       cause = new Error('an error message');
//       const output = ResponseHelper.getRichError(name, message, info, cause);

//       error.info = cause;
//       errorObject = new VError({
//         name,
//         info,
//         cause,
//       }, message);
//       errorObject.statusCode = getErrorStatusCode(name, error.message);
//       errorObject.title = http.STATUS_CODES[errorObject.statusCode];

//       expect(output.message).to.equal(errorObject.message);
//       expect(VError.cause(output).message).to.equal(VError.cause(errorObject).message);
//       expect(VError.info(output)).to.deep.equal(VError.info(errorObject));
//     });
//     it('should return the rich error object if the err is a Error with body attribute', () => {
//       cause = new Error('an error message');
//       cause.info = 'info in error';
//       cause.cause = 'cause in the error';
//       cause.body = {
//         statusCode: 500,
//         message: 'message in the body of error',
//         cause: 'cause in the body of error',
//       };
//       cause.message = cause.body.message;
//       cause.cause = cause.body.cause;
//       const output = ResponseHelper.getRichError(name, message, info, cause);

//       error.info = cause;
//       errorObject = new VError({
//         name,
//         info,
//         cause,
//       }, message);
//       errorObject.statusCode = getErrorStatusCode(name, error.message);
//       errorObject.title = http.STATUS_CODES[errorObject.statusCode];

//       expect(output.message).to.equal(errorObject.message);
//       expect(VError.cause(output).message).to.equal(VError.cause(errorObject).message);
//       expect(VError.info(output)).to.deep.equal(VError.info(errorObject));
//     });
//     it('should return the rich error object if the err is a Error with error attribute', () => {
//       cause = new Error('an error message');
//       cause.statusCode = 400;
//       cause.error = {
//         statusCode: 500,
//         message: 'message in the error of error',
//         cause: 'cause in error of error',
//       };
//       cause.message = cause.error.message;
//       cause.statusCode = cause.error.statusCode;
//       const output = ResponseHelper.getRichError(name, message, info, cause);

//       error.info = cause;
//       errorObject = new VError({
//         name,
//         info,
//         cause,
//       }, message);
//       errorObject.statusCode = getErrorStatusCode(name, error.message);
//       errorObject.title = http.STATUS_CODES[errorObject.statusCode];

//       expect(output.message).to.equal(errorObject.message);
//       expect(VError.cause(output).message).to.equal(VError.cause(errorObject).message);
//       expect(VError.info(output)).to.deep.equal(VError.info(errorObject));
//     });
//     it('should return the rich error object when entering a code', () => {
//       cause = new Error('an error message');
//       cause.statusCode = 400;
//       cause.error = {
//         statusCode: 500,
//         message: 'message in the error of error',
//         cause: 'cause in error of error',
//       };
//       cause.message = cause.error.message;
//       cause.statusCode = cause.error.statusCode;
//       const output = ResponseHelper.getRichError(404, message, info, cause);

//       error.info = cause;
//       errorObject = new VError({
//         name: 'NotFound',
//         info,
//         cause,
//       }, message);
//       errorObject.statusCode = getErrorStatusCode(name, error.message);
//       errorObject.title = http.STATUS_CODES[errorObject.statusCode];

//       expect(output.message).to.equal(errorObject.message);
//       expect(VError.cause(output).message).to.equal(VError.cause(errorObject).message);
//       expect(VError.info(output)).to.deep.equal(VError.info(errorObject));
//     });
//     it('should return the rich error object when entering a -1 code', () => {
//       cause = new Error('an error message');
//       cause.statusCode = 500;
//       cause.error = {
//         statusCode: 400,
//         message: 'message in the error of error',
//         cause: 'cause in error of error',
//       };
//       cause.message = cause.error.message;
//       cause.statusCode = cause.error.statusCode;
//       const output = ResponseHelper.getRichError(-1, message, info, cause);

//       error.info = cause;
//       errorObject = new VError({
//         name: DEFAULT_NO_MESSAGE,
//         info,
//         cause,
//       }, message);
//       errorObject.statusCode = getErrorStatusCode(name, error.message);
//       errorObject.title = http.STATUS_CODES[errorObject.statusCode];

//       expect(output.message).to.equal(errorObject.message);
//       expect(VError.cause(output).message).to.equal(VError.cause(errorObject).message);
//       expect(VError.info(output)).to.deep.equal(VError.info(errorObject));
//     });
//   });
// });
