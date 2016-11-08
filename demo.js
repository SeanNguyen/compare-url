"use strict";

const checkURIs = require("./check-uris");
const readline = require("readline").createInterface(process.stdin, process.stdout);;

var uri1 = null;
var uri2 = null;

console.log("Enter URI 1:");
readline.on("line", inputString => {
  if(!uri1 && !uri2) {
    uri1 = inputString;
    console.log("Enter URI 2:");
  } else if(uri1 && !uri2) {
    uri2 = inputString;
    console.log("Result: " + checkURIs(uri1, uri2));
    process.exit();
  }
});