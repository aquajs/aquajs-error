"use strict";

var path= require('path'),
    aquajsErrorConstant = require(path.join($dirPaths.serverDir,'config','env','error-constants')),
    extendedErrorConstant = require(path.join($dirPaths.serverDir,'config','env','extended-error-constants')),
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
    var config,extendConfig,
        customErr = Error.apply(this);
    customErr.name = "AquaJSCustomErr-" + randomstring.generate(10);
    if (typeof msgKey === 'object') { // For List of Errors
        customErr.message = msgKey;
    } else if (undefined !== aquajsErrorConstant || undefined !== extendedErrorConstant) {//For JSON String
        config = aquajsErrorConstant[msgKey];
        extendConfig = extendedErrorConstant[msgKey];
        if (undefined !== config) {
            customErr.statusCode = config.statusCode || statusCodes[config.status];
            customErr.status = JSON.toString(config.status);
            customErr.message = config;
        }else if(undefined != extendConfig) {
            customErr.statusCode = extendConfig.statusCode || statusCodes[extendConfig.status];
            customErr.status = JSON.toString(extendConfig.status);
            customErr.message = extendConfig;
        }else {
            customErr.status = "400";
            if (undefined !== additionalMsg) {
                customErr.message = msgKey + " : " + additionalMsg;
            } else {
                customErr.message = msgKey;
            }
        }
    } else {
        if (undefined !== additionalMsg) {
            if (undefined !== msgKey) {
                customErr.status = "400";
                customErr.message = msgKey + " : " + additionalMsg;
            } else {
                customErr.status = "500";
                customErr.message = "please provide the proper framework configuration";
            }
        } else {
            customErr.message = msgKey;
        }
    }
    this.name = customErr.name;
    this.stack = customErr.stack;
    this.message = customErr.message;
    return this;
};
AquaJsError.prototype = Error.prototype;

module.exports = AquaJsError;