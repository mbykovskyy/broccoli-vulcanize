# broccoli-vulcanize
[![Build Status](https://travis-ci.org/mbykovskyy/broccoli-vulcanize.svg?branch=master)](https://travis-ci.org/mbykovskyy/broccoli-vulcanize)

[Broccoli][broccoli] plugin for [Polymer vulcanize][polymer-vulcanize] tool.

## Install

```bash
npm install --save-dev broccoli-vulcanize
```

## Usage

```js
var vulcanize = require('gulp-vulcanize');
var inputTree = 'index.html';
var options = {
  csp: true,
  inline: true,
  strip: true,
  output: 'output/vulcanized.html',
  excludes: {
    imports: ["(^data:)|(^http[s]?:)|(^\/)"],
    scripts: ["(^data:)|(^http[s]?:)|(^\/)"],
    styles: ["(^data:)|(^http[s]?:)|(^\/)"]
  }
};

module.exports = vulcanize(inputTree, options);
```

See [polymer vulcanize][polymer-vulcanize] for details on `options`.

[broccoli]: https://github.com/broccolijs/broccoli "Broccoli"
[polymer-vulcanize]: https://github.com/Polymer/vulcanize  "Polymer vulcanize"
