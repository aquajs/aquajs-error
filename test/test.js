var assert = require('assert'),
    path = require('path');
global.$dirPaths={};
global.$dirPaths.rootPath = path.join(process.cwd());
global.$dirPaths.serverDir = path.join(process.cwd(), 'test');

var AquaJsError = require(path.join($dirPaths.rootPath,'index.js'));

before(function () {
});

describe('basic aqua-logger test with defined error in extended-error-constants.json',function() {
  it('should return aquajs formatted error message with defined error constant',function(done){
    var inputErrorMsg ="invalidParameterValue";
    var expectedErrorMsg = {"statusCode":40001,"status":400,"moreinfo":"Change set validate/deploy fails with error invalid parameter value if it contains a profile with View All Data permission","message":"Invalid Parameter Value"}
    var outputMsg = new AquaJsError(inputErrorMsg);
    assert.equal(expectedErrorMsg.message,outputMsg.message);
    done();
  });
});

describe('basic aqua-logger test with undefined error',function() {
  it('should return aquajs formatted error message with undefined error constant',function(done){
    var inputErrorMsg ="missingParameterValue";
    var expectedErrorMsg = {"status":"400","statusCode":"Bad Request","message":"missingParameterValue"};
    var outputMsg = new AquaJsError(inputErrorMsg);
    assert.equal(expectedErrorMsg.message,outputMsg.message);
    done();
  });
});

describe('basic aqua-logger test with arguments in error message',function() {
  it('should return aquajs formatted error message with error arguments',function(done){
    var inputErrorMsg ="invalidFieldValue";
    var expectedErrorMsg ={"statusCode":40007,"status":400,"message":"Invalid Field Value 100.Please provide value greater than 200.","moreinfo":"Invalid Field Value please insert valid field value"};
    var outputMsg = new AquaJsError(inputErrorMsg,100,200);
    assert.equal(expectedErrorMsg.message,outputMsg.message);
    done();
  });
});

describe('basic aqua-logger test with no input for arguments in error message',function() {
  it('should return aquajs formatted error message with no input for arguments',function(done){
    var inputErrorMsg ="invalidFieldValue";
    var expectedErrorMsg ={"statusCode":40007,"status":400,"message":"Invalid Field Value .Please provide value greater than .","moreinfo":"Invalid Field Value please insert valid field value"};
    var outputMsg = new AquaJsError(inputErrorMsg);
    assert.equal(expectedErrorMsg.message,outputMsg.message);
    done();
  });
});

describe('basic aqua-logger test with extra arguments in error message',function() {
  it('should return aquajs formatted error message with extra arguments',function(done){
    var inputErrorMsg ="invalidFieldValue";
    var expectedErrorMsg ={"statusCode":40007,"status":400,"message":"Invalid Field Value 100.Please provide value greater than 200.","moreinfo":"Invalid Field Value please insert valid field value"};
    var outputMsg = new AquaJsError(inputErrorMsg,100,200,300);
    assert.equal(expectedErrorMsg.message,outputMsg.message);
    done();
  });
});

describe('basic aqua-logger test with object input',function() {
  it('should return aquajs formatted error message with object input',function(done){
    var inputErrorMsg ={"error":"Enter valid email"};
    var expectedErrorMsg ={"message":{"error":"Enter valid email"}};
    var outputMsg = new AquaJsError(inputErrorMsg);
    assert.equal(expectedErrorMsg.message.error,outputMsg.message.error);
    done();
  });
});


