'use strict';
var Writer = require('broccoli-writer');
var RSVP = require('rsvp');
var vulcanize = require('vulcanize');
var path = require('path');
var mkdirp = require('mkdirp');
var clone = require('clone');
var fs = require('fs');
var RefWatcher = require('./lib/ref-watcher');
var RefScraper = require('./lib/ref-scraper');
var RefWalker = require('./lib/ref-walker');

module.exports = Vulcanize;
Vulcanize.prototype = Object.create(Writer.prototype);
Vulcanize.prototype.constructor = Vulcanize;

function Vulcanize(inputTree, options) {
  if (!(this instanceof Vulcanize)) {
    return new Vulcanize(inputTree, options);
  }

  // Clone the options otherwise any alterations after this writer is called
  // will be picked up.
  this.options = clone(options) || {};
  this.inputTree = inputTree;
  this.outputFilepath = options.output || path.basename(options.input);
}

Vulcanize.prototype.vulcanize = function(options) {
  return new RSVP.Promise(function(resolve, reject) {
    mkdirp(path.dirname(options.output), function(error) {
      if (error) {
        reject(error);
      }

      vulcanize.setOptions(options);

      vulcanize.process(options.input, function(error, html) {
        if (error) {
          reject(error);
        }

        fs.writeFileSync(options.output, html);
        resolve();
      });
    });
  });
};

Vulcanize.prototype.watchRefs = function(readTree, file, excludes) {
  var watcher = new RefWatcher(readTree);
  var scraper = new RefScraper(excludes);
  var walker = new RefWalker(scraper, watcher);

  return walker.traverse(file).then(function() {
    return watcher.watch();
  });
};

Vulcanize.prototype.write = function(readTree, destDir) {
  // We have to clone options again as vulcanize changes the hash which causes
  // the hash grow when called repeatedly.
  var options = clone(this.options);
  options.output = path.join(destDir, this.outputFilepath);

  return readTree(this.inputTree).then(function(srcPath) {
    options.input = path.join(srcPath, options.input);

    return this.vulcanize(options).then(function() {
      return this.watchRefs(readTree, options.input, options.excludes);
    }.bind(this));
  }.bind(this));
};
