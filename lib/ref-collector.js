'use strict';
var RSVP = require('rsvp');

module.exports = RefCollector;
function RefCollector(excludes) {
  if (!(this instanceof RefCollector)) {
    return new RefCollector(excludes);
  }

  this.excludes = excludes || [];
  this.selector = null;
  this.refAttr = null;
}

RefCollector.prototype.exclude = function(ref) {
  return this.excludes.some(function(exclude) {
    return exclude.test(ref);
  });
};

RefCollector.prototype.process = function(ref, refs) {
  if (!this.exclude(ref)) {
    refs[ref] = true;
  }
};

RefCollector.prototype.collect = function($) {
  var refs = {};

  return new RSVP.Promise(function(resolve) {
    $(this.selector).each(function(index, el) {
      var ref = $(el).attr(this.refAttr);
      this.process(ref, refs);
    }.bind(this));

    resolve(Object.keys(refs));
  }.bind(this));
};
