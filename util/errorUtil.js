
exports.createErrMsg4Obj = function (message, argList) {
  return replaceErrorArgs(message, argList);
};
exports.createErrMsg4Arr = function (message, argList) {
  return errObject;
};

function replaceErrorArgs(message, argList) {
  var errorMatchingArgs = new RegExp("\{([0-9]+)\}");
  messageArray = message.split(errorMatchingArgs);
  if (argList && argList.length > 1) {
    argList = Object.keys(argList).map(function (key) {
      return argList[key]
    });
    argList.shift();
  }
  for (var i = 0; i < messageArray.length; i++) {
    if (!isNaN(Number(messageArray[i])) && ((Number(messageArray[i]) >= argList.length)|| argList.length==1)) {
      messageArray.splice(i, 1);
    }
  }
  if (messageArray.length > 1 && argList && argList.length > 1) {
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


