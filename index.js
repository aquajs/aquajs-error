"use strict";

var path = require('path'),
  extendedErrorConstant = require(path.join($dirPaths.serverDir, 'config', 'env', 'extended-error-constants')),
  errorConstant = require(path.join($dirPaths.serverDir, 'config', 'env', 'error-constants')),
  statusCodes = require('http').STATUS_CODES,
  errorUtil = require(path.join(__dirname, 'util', 'errorUtil'));
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

var AquaJsError = function (msgData) {
  var config,
    customErr = Error.apply(this);

  if (typeof msgData === 'array') { // For List of Errors
    this.message = msgData;
  } else if (typeof msgData === 'object') {
    if (msgData.message) {
      this.message = msgData.message;
      this.status = msgData.statusCode;
    } else {
      this.message = msgData;
    }
  } else if (typeof msgData === 'string') {
    if (undefined != extendedErrorConstant[msgData] || undefined != errorConstant[msgData]) {
      if (undefined != extendedErrorConstant[msgData]) {
        config = extendedErrorConstant[msgData];
      }
      else if (undefined != errorConstant[msgData]) {
        config = errorConstant[msgData];
      }
      msgData = config.message;
      this.statusCode = config.code || statusCodes[config.code];
      this.status = config.status;
      this.moreinfo = config.moreinfo;
    } else {
      this.status = "400";
      this.statusCode = statusCodes[400];
    }
    this.message = errorUtil.createErrMsg4Obj(msgData, arguments);

  }
  return this;
};
AquaJsError.prototype = Error.prototype;

module.exports = AquaJsError;

