'use strict';
var StyleRefCollector = require('./style-ref-collector');
var ScriptRefCollector = require('./script-ref-collector');
var ImportRefCollector = require('./import-ref-collector');
var cheerio = require('cheerio');
var fs = require('fs');
var RSVP = require('rsvp');

module.exports = RefScraper;
function RefScraper(excludes) {
  this.styleRefCollector = new StyleRefCollector(excludes);
  this.scriptRefCollector = new ScriptRefCollector(excludes);
  this.importRefCollector = new ImportRefCollector(excludes);
}

RefScraper.prototype.load = function(file) {
  var content = fs.readFileSync(file, 'utf8');
  return cheerio.load(content);
};

RefScraper.prototype.scrape = function(file) {
  var $ = this.load(file);

  return RSVP.hash({
    styles: this.styleRefCollector.collect($),
    scripts: this.scriptRefCollector.collect($),
    imports: this.importRefCollector.collect($)
  });
};
