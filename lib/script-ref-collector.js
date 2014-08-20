'use strict';
var RefCollector = require('./ref-collector');

module.exports = ScriptRefCollector;
ScriptRefCollector.prototype = Object.create(RefCollector.prototype);
ScriptRefCollector.prototype.constructor = ScriptRefCollector;

function ScriptRefCollector(excludes) {
  if (!(this instanceof ScriptRefCollector)) {
    return new ScriptRefCollector(excludes);
  }

  RefCollector.call(this, excludes);
  this.selector = 'script[src]';
  this.refAttr = 'src';
}
