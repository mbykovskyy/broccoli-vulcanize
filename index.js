'use strict';
var Writer = require('broccoli-writer');
var RSVP = require('rsvp');
var vulcanize = require('vulcanize');
var path = require('path');
var mkdirp = require('mkdirp');
var clone = require('clone');

module.exports = Vulcanize;
Vulcanize.prototype = Object.create(Writer.prototype);
Vulcanize.prototype.constructor = Vulcanize;

function Vulcanize(inputTree, options) {
  if (!(this instanceof Vulcanize)) {
    return new Vulcanize(inputTree, options);
  }

  // We shouldn't change passed in options.
  this.options = clone(options) || {};
  this.options.input = inputTree;
  this.outputFilepath = this.options.output || path.basename(inputTree);
}

Vulcanize.prototype.write = function(readTree, destDir) {
  // We have to clone filter options as vulcanize changes the hash which causes
  // the hash grow when called repeatedly.
  var options = clone(this.options);
  options.output = path.join(destDir, this.outputFilepath);

  return new RSVP.Promise(function(resolve, reject) {
    vulcanize.setOptions(options, function(error) {
      if (error) {
        reject(error);
      }

      mkdirp(path.dirname(options.output), function(error) {
        if (error) {
          reject(error);
        }

        vulcanize.processDocument();
        resolve();
      });
    });
  });
};
