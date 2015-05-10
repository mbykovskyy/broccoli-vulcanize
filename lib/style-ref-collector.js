'use strict';
var RefCollector = require('./ref-collector');

module.exports = StyleRefCollector;
StyleRefCollector.prototype = Object.create(RefCollector.prototype);
StyleRefCollector.prototype.constructor = StyleRefCollector;

function StyleRefCollector(excludes) {
  if (!(this instanceof StyleRefCollector)) {
    return new StyleRefCollector(excludes);
  }

  RefCollector.call(this, excludes);
  this.selector = 'link[rel="stylesheet"][href],link[rel="import"][type="css"][href]';
  this.refAttr = 'href';
}
