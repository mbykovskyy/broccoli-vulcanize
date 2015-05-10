'use strict';
var RefCollector = require('./ref-collector');

module.exports = ImportRefCollector;
ImportRefCollector.prototype = Object.create(RefCollector.prototype);
ImportRefCollector.prototype.constructor = ImportRefCollector;

function ImportRefCollector(excludes) {
  if (!(this instanceof ImportRefCollector)) {
    return new ImportRefCollector(excludes);
  }

  RefCollector.call(this, excludes);
  this.selector = 'link[rel="import"][type!="css"][href]';
  this.refAttr = 'href';
}
