'use strict';
var RSVP = require('rsvp');
var path = require('path');

module.exports = RefWalker;
function RefWalker(scraper, watcher) {
  this.visited = {};
  this.scraper = scraper;
  this.watcher = watcher;
}

RefWalker.prototype.visitRefs = function(dir, refs) {
  return RSVP.all(refs.map(function(ref) {
    var refPath = path.resolve(dir, ref);
    return this.traverse(refPath);
  }.bind(this)));
};

RefWalker.prototype.visit = function(file) {
  this.visited[file] = true;

  return this.scraper.scrape(file).then(function(refs) {
    var dir = path.dirname(file);

    return this.visitRefs(dir, refs.imports).then(function() {
      return refs;
    });
  }.bind(this));
};

RefWalker.prototype.traverse = function(file) {
  return RSVP.Promise.resolve().then(function() {
    if (!this.visited[file]) {
      return this.visit(file).then(function(refs) {
        var dir = path.dirname(file);
        this.watcher.add(dir, refs);
      }.bind(this));
    }
  }.bind(this));
};
