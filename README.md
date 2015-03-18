# Aqua JS Error framework:
Aqua tried to make the error handling more asynchronous and covers many scenarios from server crash, operational errors to Functional Error.
We have wrapped the `error` object with the AquaJsError module and the constructor takes mandatory argument `msgKey` config and `additionalMessage`.

First the `msgKey` will try to find out the key in `error-constants.json`.
If the `response` object is found, it will pass the message to the error handler asynchronously, otherwise it will take the message key and additional message as the error argument.

The framework provides two error configuration files named `error-constants.json` and `extended-error-constants.json` where you can define the error formats.

Sample error format :
```
"badRequest": {
    "status": 400,
    "code": 400,
    "property": "",
    "message": "The request was invalid or cannot be otherwise served",
    "moreinfo": "An accompanying error message will explain further. For security reasons, requests without authentication are considered invalid and will yield this response."
  }
```
####How to use AquaJs-Error

Use Case 1:

Wherever an error occurs, send the single `aquajsError` from the `next` function
```
var aquaError = require('aquajs-error'),

next(new aquaError("samePrimarySecondaryService"));
```
Response :
```
{ 
  "error": { 
      "status": 400, 
      "code": 40006, 
      "property": "", 
      "message": "Cannot select the same service name for Primary and Secondary Service", 
      "moreinfo": "Cannot select the same service name for Primary and Secondary Service change the service name at least for one" 
    } 
}
```

Use Case 2 :

For collection of errors
```
var aquaError = require('aquajs-error'),
    errorList = require(path.join($dirPaths.serverDir,'error','aquajs-errors'));

 errorList = new errorList();
 errorList.addError("noContent");
 errorList.addError("notModified");
 next(new aquaError(errorList));
```
Response :
```
{ 
  "errors": 
    [
      { 
        "status": 200, 
        "code": 204, 
        "property": "", 
        "message": "The request was successful; the resource was deleted.",
        "moreinfo": "The server has fulfilled the request but does not need to return an entity-body, and might want to return updated metainformation. The response MAY include new or updated metainformation in the form of entity-headers, which if present SHOULD be associated with the requested variant." 
      }, 
      { 
        "status": 300, 
        "code": 304, 
        "property": "", 
        "message": "There is no new data to return.", 
        "moreinfo": "Performed a conditional GET request and access is allowed, but the document has not been modified." 
      }
    ] 
}
```


