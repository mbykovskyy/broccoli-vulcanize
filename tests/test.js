'use strict';
var assert = require('assert');
var vulcanize = require('..');
var Broccoli = require('broccoli');
var path = require('path');
var fs = require('fs');
var builder;

afterEach(function() {
  if (builder) {
    builder.cleanup();
  }
});

it('should vulcanize components', function() {
  var tree = vulcanize('fixtures', {
    input: 'basic-index.html'
  });
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(builder.outputPath, 'basic-index.html');
    assert(fs.existsSync(indexHtml));
  });
});

it('should vulcanize cyclic dependent components', function() {
  var tree = vulcanize('fixtures', {
    input: 'cyclic-dependency-index.html'
  });
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(builder.outputPath, 'cyclic-dependency-index.html');
    assert(fs.existsSync(indexHtml));
  });
});

it('should not change options', function() {
  var options = {
    input: 'basic-index.html'
  };
  var tree = vulcanize('fixtures', options);
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function() {
    assert.deepEqual({input: 'basic-index.html'}, options);
  });
});

it('should not be affected by options changing outside', function() {
  var options = {
    input: 'basic-index.html'
  };
  var tree = vulcanize('fixtures', options);
  options.output = 'should/not/affect/vulcanize.html';

  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(builder.outputPath, 'basic-index.html');
    assert(fs.existsSync(indexHtml));
  });
});

it('should rename vulcanized component', function() {
  var outputFilePath = 'vulcanized/vulcanized.html';
  var tree = vulcanize('fixtures', {
    input: 'basic-index.html',
    output: outputFilePath
  });
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(builder.outputPath, outputFilePath);
    assert(fs.existsSync(indexHtml));
  });
});

it('should be able to call vulcanize repeatedly', function() {
  var tree = vulcanize('fixtures', {
    input: 'basic-index.html'
  });
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(builder.outputPath, 'basic-index.html');
    assert(fs.existsSync(indexHtml));

    return builder.build().then(function(result) {
      var indexHtml = path.join(builder.outputPath, 'basic-index.html');
      assert(fs.existsSync(indexHtml));
    });
  });
});

it('should accept a broccoli tree', function() {
  var tree = new (require('broccoli-funnel'))('fixtures')

  tree = vulcanize(tree, {
    input: 'basic-index.html'
  });
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(builder.outputPath, 'basic-index.html');
    assert(fs.existsSync(indexHtml));
  });
});

describe('option `excludes`', function() {
  it('should accept `String[]` as input', function() {
    var tree = vulcanize('fixtures', {
      input: 'basic-index.html',
      inlineCss: true,
      excludes: ['.css']
    });
    builder = new Broccoli.Builder(tree);

    return builder.build().then(function(result) {
      var indexHtml = path.join(builder.outputPath, 'basic-index.html');
      var htmlContent = fs.readFileSync(indexHtml, 'utf8');
      assert(htmlContent.indexOf('background-color: white;') === -1);
    });
  });
});
