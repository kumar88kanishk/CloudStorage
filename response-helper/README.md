<a name="module_responseHelper"></a>

## responseHelper
**Example**  
```js
const responseHelper = require('@magmods/response-helper');
```

* [responseHelper](#module_responseHelper)
    * [~sendError(error, response, otherErrorStatusCode, options, logLevel)](#module_responseHelper..sendError) ⇒
    * [~notImplemented(source, response, options)](#module_responseHelper..notImplemented) ⇒
    * [~sendResult(result, statusCode, response, options, logLevel)](#module_responseHelper..sendResult) ⇒
    * [~getRichError(val, message, info, err, logLevel, correlationId)](#module_responseHelper..getRichError) ⇒ <code>object</code>

<a name="module_responseHelper..sendError"></a>

### responseHelper~sendError(error, response, otherErrorStatusCode, options, logLevel) ⇒
The error has the following format:
``` javascript
{
   "statusCode": "http code for the response",
   "title": "http title associated with the http code",
   "message": "error.message or `no error message` if the error does not exist",
   "info": "information contains in the error",
   "infoSupplement": "extra information associated with the error"
}
````
The options object has the following properties:
``` javascript
{
   "method": "method of the request",
   "path": "path of the request",
   "operationId": "operation defined for that route",
   "correlationId": "correlationId including in the header of the request if present otherwise UUID"
}
```

**Kind**: inner method of [<code>responseHelper</code>](#module_responseHelper)  
**Returns**: `null`.  
**Category**: sync  
**Requires**: <code>module:@magmods/sumologic-winston-logger</code>  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>object</code> | The error to include in the response. |
| response | <code>object</code> | The http response object. |
| otherErrorStatusCode | <code>number</code> | StatusCode overriding the statusCode of the error to associated with the response. |
| options | <code>object</code> | Object containing the value to be passed. |
| logLevel | <code>string</code> | To indicate if the response will be logged on not (`false` or `undefined` or `invalid` will indicate that the log is done with `error` level). If set to `true`, will indicate that no log should be done. |

<a name="module_responseHelper..notImplemented"></a>

### responseHelper~notImplemented(source, response, options) ⇒
The error has the following format:
``` javascript
{
   "statusCode": 405,
   "title": "Not Implemented",
   "message": "route not implemented",
   "info": {
      "method": "method used for the request",
      "path": "path of the request",
      "operationId": "operationId associated with the request, null or non existent if not available"
   }
}
```
The options object has the following properties:
``` javascript
{
   "method": "method of the request",
   "path": "path of the request",
   "operationId": "operation defined for that route",
   "correlationId": "correlationId including in the header of the request if present otherwise UUID"
}
```

**Kind**: inner method of [<code>responseHelper</code>](#module_responseHelper)  
**Returns**: `null`.  
**Category**: sync  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | A message indicating which endpoint generate the response. |
| response | <code>object</code> | The http response object. |
| options | <code>object</code> | Object containing the value to be passed. |

<a name="module_responseHelper..sendResult"></a>

### responseHelper~sendResult(result, statusCode, response, options, logLevel) ⇒
If the result contains a data fields the response is sent as is, otherwise the result is encapsulated under `data` property.
The options object has the following properties:
``` javascript
{
   "method": "method of the request",
   "path": "path of the request",
   "operationId": "operation defined for that route",
   "correlationId": "correlationId including in the header of the request if present otherwise UUID"
}
```

**Kind**: inner method of [<code>responseHelper</code>](#module_responseHelper)  
**Returns**: `null`.  
**Category**: sync  
**Requires**: <code>module:@magmods/sumologic-winston-logger</code>, <code>module:@magmods/lib-filters</code>  

| Param | Type | Description |
| --- | --- | --- |
| result | <code>object</code> | Actual result to be send. |
| statusCode | <code>number</code> | Http statusCode to send as part of the response. |
| response | <code>object</code> | The http response object. |
| options | <code>object</code> | Object containing the value to be passed. |
| logLevel | <code>string</code> | To indicate if the response will be logged on not (`false` or `undefined` or `invalid` will indicate that the log is done with `error` level). If set to `true`, will indicate that no log should be done. |

<a name="module_responseHelper..getRichError"></a>

### responseHelper~getRichError(val, message, info, err, logLevel, correlationId) ⇒ <code>object</code>
Create a rich error.

**Kind**: inner method of [<code>responseHelper</code>](#module_responseHelper)  
**Returns**: <code>object</code> - The rich error.

The error object if a [vError](https://www.npmjs.com/package/verror) object with the following:
``` javascript
{
   "name": "name of the error",
   "info": "info of the error",
   "cause": "encapsulated error",
   "message": "message of the error"
}
```  
**Category**: sync  
**Requires**: <code>module:@magmods/sumologic-winston-logger</code>  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>object</code> | If it is a string it represents the name of the error, if it is a number it represents the code of the error (e.g. 400, 500, ....). Invalid string or number will result to a 500 Internal Error title. |
| message | <code>string</code> | Message to associated with the error. |
| info | <code>object</code> | Info as a JSON object to associate to the error. |
| err | <code>object</code> | Error to encapsulate in the created error as a cause. |
| logLevel | <code>string</code> | Indicates if the error needs to be log at creation with a specific level. If logLevel is `false` a error log will be created with `error`` level. |
| correlationId | <code>string</code> | CorrelationId to be added to the log when log is enabled. |

