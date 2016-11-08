'use strict';

// http://abc.com/foo.html?a=3&a=1&b=2

function checkURIs(uri1, uri2) {
  // Check exact match
  if(uri1 === uri2) {
    return true;
  }

  var uri1Obj = parseUri(uri1);
  var uri2Obj = parseUri(uri2);

  // Protocol
  if(uri1Obj.protocol !== uri2Obj.protocol) {
    return false;
  }
  // User Information
  if(uri1Obj.auth !== uri2Obj.auth) {
    return false;
  }
  // Host
  if(uri1Obj.host !== uri2Obj.host) {
    return false;
  }
  // Port
  if(uri1Obj.port !== uri2Obj.port) {
    return false;
  }
  // Path
  if(uri1Obj.normalizedPath !== uri2Obj.normalizedPath) {
    return false;
  }
  // Query
  if(!areEqualShallow(uri1Obj.queryObj, uri2Obj.queryObj)) {
    return false;
  }
  // Fragment
  // if(uri1Obj.auth !== uri2Obj.auth) {
  //   return false;
  // }
  return true;
}

function areEqualShallow(a, b) {
    for(var key in a) {
        if(!(key in b) || a[key] !== b[key]) {
            return false;
        }
    }
    for(var key in b) {
        if(!(key in a) || a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}

function parseUri(uri) {
  var uriObj = {};
  var tmp = null;
  // Hash.
  if (tmp = uri.match(/(.*?)#(.*)/)) {
      uriObj.hash = tmp[2];
      uri = tmp[1];
  }
  // Protocol.
  if (tmp = uri.match(/(.*?)\:?\/\/(.*)/)) {
    uriObj.protocol = tmp[1].toLowerCase();
    uri = tmp[2];
  }
  // Query
  if (tmp = uri.match(/(.*?)\?(.*)$/)) {
    uriObj.query = tmp[2];
    uriObj.queryObj = parseQuery(tmp[2]);
    uri = tmp[1];
  }
  // Path.
  if (tmp = uri.match(/(.*?)(\/.*)/)) {
    uriObj.path = tmp[2];
    uriObj.normalizedPath = normalizePath(uriObj.path);
    uri = tmp[1];
  }
  // Port.
  if (tmp = uri.match(/(.*)\:([0-9]+)$/)) {
    uriObj.port = tmp[2];
    uri = tmp[1];
  }
  // Auth.
  if (tmp = uri.match(/(.*?)@(.*)/)) {
    uriObj.auth = tmp[1];
    uri = tmp[2];
  }
  // Host
  uriObj.host = uri.toLowerCase();

  // Set port and protocol defaults if not set.
  uriObj.port = uriObj.port || (uriObj.protocol === 'https' ? '443' : '80');
  uriObj.protocol = uriObj.protocol || (uriObj.port === '443' ? 'https' : 'http');

  return uriObj;
}

function parseQuery(query) {
  var assignments = query.split("&");
  var queryObj = {};
  assignments.forEach((assignment) => {
    if(!assignment) {
      return;
    }
    var matchResult = null
    if(matchResult = assignment.match(/^(.*)=(.*)$/)) {
      var variable = matchResult[1];
      var value = matchResult[2];
      queryObj[variable] = value;
    }
  });
  return queryObj;
}

function normalizePath(path) {
  path = path.split("/");
  var normalizedPath = [];
  path.forEach((element, index) => {
    if(!element || element === ".") {
      return;
    } 
    if(element === ".." && normalizedPath.length > 0 && normalizedPath[normalizedPath.length - 1] !== "..") {
      normalizedPath.pop();
    } else {
      normalizedPath.push(element);  
    }
  });
  return normalizedPath.join("/");
}

module.exports = checkURIs;