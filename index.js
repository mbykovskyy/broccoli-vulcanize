'use strict';
var Writer = require('broccoli-writer');
var RSVP = require('rsvp');
var vulcanize = require('vulcanize');
var path = require('path');
var mkdirp = require('mkdirp');
var clone = require('clone');
var fs = require('fs');
var cheerio = require('cheerio');
var mapSeries = require('promise-map-series');

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

function exclude(excludes, ref) {
  return excludes && excludes.some(function(exclude) {
    return exclude.test(ref);
  });
}

function processRef(ref, excludes, outputDir, watchRefs) {
  if (!exclude(excludes, ref)) {
    var refPath = path.resolve(outputDir, ref);

    if (fs.existsSync(refPath)) {
      watchRefs.push(path.dirname(refPath));
    }
  }
}

function processStyles($, excludes, outputDir, watchRefs) {
  $('link[rel="stylesheet"][href]').each(function() {
    processRef($(this).attr('href'), excludes, outputDir, watchRefs);
  });
}

function processScripts($, excludes, outputDir, watchRefs) {
  $('script[src]').each(function() {
    processRef($(this).attr('src'), excludes, outputDir, watchRefs);
  });
}

function processImports($, excludes, outputDir, watchRefs) {
  $('link[rel="import"][href]').each(function() {
    processRef($(this).attr('href'), excludes, outputDir, watchRefs);
  });
}


function collectRefs(file, excludes) {
  excludes = excludes || {};
  var content = fs.readFileSync(file, 'utf8');
  var $ = cheerio.load(content);
  var outputDir = path.dirname(file);
  var watchRefs = [];

  processStyles($, excludes.styles, outputDir, watchRefs);
  processScripts($, excludes.scripts, outputDir, watchRefs);
  processImports($, excludes.imports, outputDir, watchRefs);

  return watchRefs;
}

function watchRefs(readTree, file, excludes) {
  var refs = collectRefs(file, excludes);
  return mapSeries(refs, readTree);
}

Vulcanize.prototype.write = function(readTree, destDir) {
  // We have to clone options again as vulcanize changes the hash which causes
  // the hash grow when called repeatedly.
  var options = clone(this.options);
  options.output = path.join(destDir, this.outputFilepath);

  return readTree(this.inputTree).then(function(srcPath) {
    options.input = path.join(srcPath, options.input);

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
    }).then(function() {
      return watchRefs(readTree, options.input, options.excludes);
    });
  });
};
