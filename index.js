'use strict';
var Writer = require('broccoli-writer');
var RSVP = require('rsvp');
var vulcanize = require('vulcanize');
var path = require('path');
var mkdirp = require('mkdirp');

module.exports = Vulcanize;
Vulcanize.prototype = Object.create(Writer.prototype);
Vulcanize.prototype.constructor = Vulcanize;

function Vulcanize(inputTree, options) {
  if (!(this instanceof Vulcanize)) {
    return new Vulcanize(inputTree, options);
  }

  this.options = options || {};
  this.options.input = inputTree;
}

Vulcanize.prototype.write = function(readTree, destDir) {
  var outputFilepath = this.options.output || path.basename(this.options.input);
  this.options.output = path.join(destDir, outputFilepath);

  var filter = this;

  return new RSVP.Promise(function(resolve, reject) {
    vulcanize.setOptions(filter.options, function(error) {
      if (error) {
        reject(error);
      }

      mkdirp(path.dirname(filter.options.output), function(error) {
        if (error) {
          reject(error);
        }

        vulcanize.processDocument();
        resolve();
      });
    });
  });
};
