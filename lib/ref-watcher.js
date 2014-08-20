'use strict';
var path = require('path');
var fs = require('fs');
var mapSeries = require('promise-map-series');

module.exports = RefWatcher;
function RefWatcher(readTree) {
  this.readTree = readTree;
  this.trees = {};
}

RefWatcher.prototype.add = function(dir, refs) {
  var newTrees = refs.styles.concat(refs.scripts, refs.imports)
  .map(function(ref) {
    var file = path.resolve(dir, ref);
    return path.dirname(file);
  })
  .filter(function(tree) {
    return fs.existsSync(tree);
  });

  newTrees.forEach(function(tree) {
    this.trees[tree] = true;
  }.bind(this));
};

RefWatcher.prototype.watch = function() {
  return mapSeries(Object.keys(this.trees), this.readTree);
};
