# broccoli-vulcanize
[![Build Status](https://travis-ci.org/mbykovskyy/broccoli-vulcanize.svg?branch=master)](https://travis-ci.org/mbykovskyy/broccoli-vulcanize)

[Broccoli][broccoli] plugin for [Polymer vulcanize][polymer-vulcanize] tool.

## Install

```bash
npm install --save-dev broccoli-vulcanize
```

## Usage

```js
var vulcanize = require('broccoli-vulcanize');
var inputTree = 'public';
var options = {
  input: 'index.html',
  output: 'output/vulcanized.html',
  abspath: '/webroot/',
  excludes: ['.css', '.js'],
  stripExcludes: [],
  addedImports: [
    'foo/bar.html'
  ],
  redirects: [
    'https://example.com/foo/bar.html|/foo/bar/baz.html'
  ],
  stripComments: false,
  inlineScripts: false,
  inlineCss: false,
  implicitStrip: true
};

module.exports = vulcanize(inputTree, options);
```

See [polymer vulcanize][polymer-vulcanize] for details on `options`.

[broccoli]: https://github.com/broccolijs/broccoli "Broccoli"
[polymer-vulcanize]: https://github.com/Polymer/vulcanize  "Polymer vulcanize"
