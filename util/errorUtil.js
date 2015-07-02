var path = require('path'), extendedErrorConstant = require(path.join($dirPaths.serverDir, 'config', 'env', 'extended-error-constants')),
    statusCodes = require('http').STATUS_CODES;

//Error message for the object explicitly
exports.createErrMsg4Obj = function (message, argList) {
  return replaceErrorArgs(message, argList);
};

// create the error object of type aquajsError

exports.createErrorObject = function (errorKey, argList,errorObj) {
  var config  = extendedErrorConstant[errorKey],msgData;
  if (!config && isModuleAvailable(path.join($dirPaths.serverDir, 'config', 'env', 'error-constants'))) {
	var  errorConstant = require(path.join($dirPaths.serverDir, 'config', 'env', 'error-constants'));
    config = errorConstant[errorKey];
  }
  if (config) {
    msgData = config.message;
    errorObj.statusCode = config.code || statusCodes[config.code];
    errorObj.status = config.status;
    errorObj.moreinfo = config.moreinfo;
  } else {
    msgData = errorKey;
    errorObj.status = "400";
    errorObj.statusCode = statusCodes[400];
  }
  errorObj.message = this.replaceErrorArgs(msgData, argList);
  return errorObj;
};

exports.createErrMsg4Arr = function (errorList) {
  var errors = [];
  for (index in errorList) {
    //whole array contains all the arglist
    //each arglist contains the list of error args starting with key in extended-error-constatants and other params
    var eachErrorList = errorList[index], messageKey = eachErrorList[0];
    var errorObj={}; /// create a blank error and send it to get populated
    errors.push(this.createErrorObject(messageKey, eachErrorList,errorObj));
  }
  return errors;
};

exports.replaceErrorArgs = function (message, argList) {
  var errorMatchingArgs = new RegExp("\{([0-9]+)\}"),
    messageArray = message.split(errorMatchingArgs),messageElement,
    originalArgList = argList;
  if (argList && argList.length > 1) {
    argList = Object.keys(argList).map(function (key) {
      return argList[key]
    });
    argList.shift();
  }

  for (var i = 0; i < messageArray.length; i++) {
    messageElement= Number(messageArray[i]);
    if (!isNaN(messageElement) && messageElement >= originalArgList.length - 1) {
      messageArray.splice(i, 1);
    }
  }
  if (messageArray.length > 1 && originalArgList && originalArgList.length > 1) {
    for (var i = 0; i < argList.length; i++) {
      for (var j = 0; j < messageArray.length; j++) {
        if (messageArray[j] == "" + i + "") {
          messageArray[j] = argList[i];
        }
      }

    }
  }
  return messageArray.join("");
};

function isModuleAvailable(fullModulePath) {
    try {
        return require.resolve(fullModulePath) ? true : false;
    }
    catch (err) {
        return false;
    }
}
