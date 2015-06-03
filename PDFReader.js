/** 
 * Cordova PDF reader for IOS (based on Reader https://github.com/KiranPanesar/Reader) 
 *
 * Copyright (c) Emmanuel Tabard 2014
 */

var parseUrl = function(
  a // an anchor element
){
  return function( // return a function
    b,             // that takes a URL.
    c,             // (placeholder)
    d              // (placeholder)
  ){
    a.href = b;    // set the target of the link to the URL, and
    c = {};        // create a hash to be returned.
    for (          // for each
      d            // property
      in a         // of the anchor,
    ) if (         // if
      "" + a[d]    // the string version of the property
      === a[d]     // is the same as the property
    ) c[d]         // add it
      = a[d];      // to the return object
    
    return c       // return the object
  }
}(
  document         // auto-run with
    .createElement // a cached anchor element
    ("a")
);

var noop = function () {};

var PDFReader = (function () {
});
var exec = function (methodName, options, success, error) {
    cordova.exec(success, error, "PDFReader", methodName, options);
};

var protectCall = function (callback, context) {
    if (callback && typeof callback === 'function') {
        try {
            var args = Array.prototype.slice.call(arguments, 2); 
            callback.apply(this, args);
        }
        catch (err) {
            console.log('exception in ' + context + ': "' + err + '"');
        }
    }
};

PDFReader.prototype.open = function (filePath, success, error) {
    if (!success) {
        success = noop;
    }

    if (!error) {
        error = noop;
    }

    var setupOk = function () {
        protectCall(success, 'open:success', filePath);
    };
    var setupFailed = function (errorMessage) {
        protectCall(error, 'open:error', {'error' : errorMessage, 'path':filePath});
    };

    if (!filePath) {
        setupFailed('Empty file path');
        return;
    }

    fileInfo = parseUrl(filePath || '');
    switch (fileInfo.protocol) {
        case 'file:':
            filePath = decodeURIComponent(filePath.replace('file://', ''));
        break;
        default:
            setupFailed('Protocol ' + fileInfo.protocol + ' not supported');
            return false;
        break;
    }

    
    exec('open', [filePath], setupOk, setupFailed);
};

PDFReader.prototype.clearCache = function (filePath, finishedCallback) {
    var setupFailed = function () {
        log('setup failed');
    };
    exec('clearCacheForPdfFile', [filePath], finishedCallback, setupFailed);
};

var PDFReaderInstance = new PDFReader();

module.exports = PDFReaderInstance;