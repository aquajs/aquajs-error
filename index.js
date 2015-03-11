"use strict";

var path = require('path'),
    aquajsErrorConstant = require(path.join($dirPaths.serverDir, 'config', 'env', 'error-constants')),
    extendedErrorConstant = require(path.join($dirPaths.serverDir, 'config', 'env', 'extended-error-constants')),
    statusCodes = require('http').STATUS_CODES,
    randomstring = require('randomstring');

/**
 * AquaJS Error Constructor to throw the Error from the framework
 * Users will be able to throw single error or a collection of errors
 * Error code will be initialized from the error-constant.json file
 *
 * sample Error constant json file as below
 "invalidFieldValue": {
   "status": 400,
    "code": 40001,
    "property": 40001,
    "message": "Invalid Parameter Value",
    "moreinfo": "Invalid Parameter Value"
  }

 while throwing the error the developer has to pass the error key to get the error details
 Once the error is thrown the app takes care of sending back the error to the browser

 sample use : throw new AquaJsError("invalidFieldValue");

 users will be able to send the error message string directly as well
 ex:
 throw new AquaJsError("error occurred while getting the virtual circuit") ;
 *
 * @api public
 * @param
 * @see
 * @return {Aquajs Error Object}
 */

var AquaJsError = function (msgKey, additionalMsg) {
  var config, extendConfig,
      customErr = Error.apply(this);

  this.name = "AquaJSCustomErr-" + randomstring.generate(10);

  if (typeof msgKey === 'object') {
    // For List of Errors
    if (msgKey.message) {
      this.message = msgKey.message;
      this.status = msgKey.statusCode;
    } else {
      this.message = msgKey;
    }

  } else if (undefined !== extendedErrorConstant || undefined !== aquajsErrorConstant) {//For JSON String
    extendConfig = extendedErrorConstant[msgKey];
    config = aquajsErrorConstant[msgKey];
    if (undefined != extendConfig) {
      this.statusCode = extendConfig.code || statusCodes[extendConfig.code];
      this.status = extendConfig.status;
      this.message = additionalMsg || extendConfig.message;
      this.moreinfo = extendConfig.moreinfo;
    } else if (undefined !== config) {
      this.statusCode = extendConfig.code || statusCodes[extendConfig.code];
      this.status = config.status;
      this.message = additionalMsg || config.message;
      this.moreinfo = config.moreinfo;
    } else {
      this.status = "400";
      if (undefined !== additionalMsg) {
        this.message = msgKey + " : " + additionalMsg;
      } else {
        this.message = msgKey;
      }
    }
  } else {
    if (undefined !== additionalMsg) {
      if (undefined !== msgKey) {
        this.status = "400";
        this.message = msgKey + " : " + additionalMsg;
      } else {
        this.status = "500";
        this.message = "please provide the proper framework configuration";
      }
    } else {
      this.message = msgKey;
    }
  }
  return this;
};
AquaJsError.prototype = Error.prototype;

module.exports = AquaJsError;

