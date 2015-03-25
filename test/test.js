var assert = require('assert'),
    path = require('path');
global.$dirPaths={};
global.$dirPaths.rootPath = path.join(process.cwd());
global.$dirPaths.serverDir = path.join(process.cwd(), 'test');

var AquaJsError = require(path.join($dirPaths.rootPath,'index.js'));
var AquaJsErrors = require(path.join($dirPaths.serverDir,'error','aquajs-errors'));
before(function () {
});

describe('basic aqua-logger test for defined error in extended-error-constants.json',function() {
  it('should return aquajs formatted error message for defined error constant',function(done){
    var inputErrorMsg ="invalidParameterValue";
    var expectedErrorMsg = {"statusCode":40001,"status":400,"moreinfo":"Change set validate/deploy fails with error invalid parameter value if it contains a profile with View All Data permission","message":"Invalid Parameter Value"}
    var outputMsg = new AquaJsError(inputErrorMsg);
    assert.equal(expectedErrorMsg.message,outputMsg.errorJson.message);
    done();
  });
});

describe('basic aqua-logger test for undefined error',function() {
  it('should return aquajs formatted error message for undefined error constant',function(done){
    var inputErrorMsg ="missingParameterValue";
    var expectedErrorMsg = {"status":"400","statusCode":"Bad Request","message":"missingParameterValue"};
    var outputMsg = new AquaJsError(inputErrorMsg);
    assert.equal(expectedErrorMsg.message,outputMsg.errorJson.message);
    done();
  });
});

describe('basic aqua-logger test with arguments in error message',function() {
  it('should return aquajs formatted error message with error arguments',function(done){
    var inputErrorMsg ="invalidFieldValue";
    var expectedErrorMsg ={"statusCode":40007,"status":400,"message":"Invalid Field Value 100.Please provide value greater than 200.","moreinfo":"Invalid Field Value please insert valid field value"};
    var outputMsg = new AquaJsError(inputErrorMsg,100,200);
    assert.equal(expectedErrorMsg.message,outputMsg.errorJson.message);
    done();
  });
});

describe('basic aqua-logger test with no input for arguments in error message',function() {
  it('should return aquajs formatted error message with no input for arguments',function(done){
    var inputErrorMsg ="invalidFieldValue";
    var expectedErrorMsg ={"statusCode":40007,"status":400,"message":"Invalid Field Value .Please provide value greater than .","moreinfo":"Invalid Field Value please insert valid field value"};
    var outputMsg = new AquaJsError(inputErrorMsg);
    assert.equal(expectedErrorMsg.message,outputMsg.errorJson.message);
    done();
  });
});

describe('basic aqua-logger test with extra arguments in error message',function() {
  it('should return aquajs formatted error message with extra arguments',function(done){
    var inputErrorMsg ="invalidFieldValue";
    var expectedErrorMsg ={"statusCode":40007,"status":400,"message":"Invalid Field Value 100.Please provide value greater than 200.","moreinfo":"Invalid Field Value please insert valid field value"};
    var outputMsg = new AquaJsError(inputErrorMsg,100,200,300);
    assert.equal(expectedErrorMsg.message,outputMsg.errorJson.message);
    done();
  });
});

describe('basic aqua-logger test with incorrect arguments',function() {
  it('should return aquajs formatted error message with incorrect arguments',function(done){
    var inputErrorMsg ="invalidData";
    var expectedErrorMsg ={"statusCode":40008,"status":400,"message":"Invalid Data Value .Please provide value between 200 and .Your input 200","moreinfo":"Invalid Field Value please insert valid field value"};
    var outputMsg = new AquaJsError(inputErrorMsg,200);
    assert.equal(expectedErrorMsg.message,outputMsg.errorJson.message);
    done();
  });
});

describe('basic aqua-logger test with JSON object input',function() {
  it('should return aquajs formatted error message with JSON object input',function(done){
    var inputErrorMsg ={"error":"Enter valid email"};
    var expectedErrorMsg ={"message":{"error":"Enter valid email"}};
    var outputMsg = new AquaJsError(inputErrorMsg);
    assert.equal(expectedErrorMsg.message.error,outputMsg.errorJson.error);
    done();
  });
});

describe('collection of errors test',function() {
  it('should return aquajs formatted error message for collection of errors',function(done){

    var inputErrorList = new AquaJsErrors ();

    inputErrorList.addError("workflowError");
    inputErrorList.addError("SUCCESS");
    inputErrorList.addError("invalidFieldValue",30,40);

    var expectedErrorList = {"errorJson": [{"status":"400","statusCode":"Bad Request","message":"workflowError"},
      {"statusCode":201,"status":200,"moreinfo":"The request was successful.",
        "message":"The request was successful."},
      {"statusCode":40007,"status":400,"moreinfo":"Invalid Field Value please insert valid field value",
        "message":"Invalid Field Value 30.Please provide value greater than 40."}]};

    var outputMsgList =  new AquaJsError(inputErrorList);

    for (index in outputMsgList.message) {
      assert.equal(expectedErrorList.message[index].message,outputMsgList.errorJson[index].message);
    }
    done();
  });
});

describe('empty collection of errors test',function() {
  it('should return aquajs formatted error message for collection of errors',function(done){

    var inputErrorList = new AquaJsErrors ();
    var expectedErrorList = {"message":[]};
    var outputMsgList =  new AquaJsError(inputErrorList);
    for (index in outputMsgList.message) {
      assert.equal(expectedErrorList.message[index].message,outputMsgList.errorJson[index].message);
    }
    done();
  });
});

describe('Invalid collection of errors test',function() {
  it('should return aquajs formatted error message for collection of errors',function(done) {

    var inputErrorList = new AquaJsErrors();

    inputErrorList.addError("workflowError",10);
    inputErrorList.addError("SUCCESS");
    inputErrorList.addError("invalidFieldValue", 30);
    inputErrorList.addError("internalServerError");

    var expectedErrorList = {
      "errorJson": [{"status": "400", "statusCode": "Bad Request", "message": "workflowError"},
        {
          "statusCode": 201, "status": 200, "moreinfo": "The request was successful.",
          "message": "The request was successful."
        },
        {
          "statusCode": 40007, "status": 400, "moreinfo": "Invalid Field Value please insert valid field value",
          "message": "Invalid Field Value 30.Please provide value greater than ."
        },
        {
          "statusCode": 50001, "status": 500, "moreinfo": "Something went wrong. Please try after some time",
          "message": "Something went wrong. Please try after some time"
        }]
    };

    var outputMsgList = new AquaJsError(inputErrorList);
    assert.equal(outputMsgList.errorJson.length,expectedErrorList.errorJson.length);

    for (index in outputMsgList.message) {
      assert.equal(expectedErrorList.errorJson[index].message, outputMsgList.errorJson[index].message);
    }

    done();
  });
});


