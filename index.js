'use strict';
var Plugin = require('broccoli-plugin');
var RSVP = require('rsvp');
var Vulcan = require('vulcanize');
var path = require('path');
var mkdirp = require('mkdirp');
var clone = require('clone');
var fs = require('fs');
var RefWatcher = require('./lib/ref-watcher');
var RefScraper = require('./lib/ref-scraper');
var RefWalker = require('./lib/ref-walker');

module.exports = Vulcanize;
Vulcanize.prototype = Object.create(Plugin.prototype);
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
  Plugin.call(this, [inputTree]);
}

Vulcanize.prototype.vulcanize = function(options) {
  return new RSVP.Promise(function(resolve, reject) {
    mkdirp(path.dirname(options.output), function(error) {
      if (error) {
        reject(error);
      }

      new Vulcan(options).process(options.input, function(error, html) {
        if (error) {
          reject(error);
        }

        fs.writeFileSync(options.output, html);
        resolve();
      });
    });
  });
};

Vulcanize.prototype.watchRefs = function(file, excludes) {
  var watcher = new RefWatcher();
  var scraper = new RefScraper(excludes);
  var walker = new RefWalker(scraper, watcher);

  return walker.traverse(file).then(function() {
    return watcher.watch();
  });
};

Vulcanize.prototype.build = function() {
  // We have to clone options again as vulcanize changes the hash which causes
  // the hash grow when called repeatedly.
  var options = clone(this.options);
  options.output = path.join(this.outputPath, this.outputFilepath);

  options.input = path.join(this.inputPaths[0], options.input);

  return this.vulcanize(options).then(function() {
    return this.watchRefs(options.input, options.excludes);
  }.bind(this));
};
