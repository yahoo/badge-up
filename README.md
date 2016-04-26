# badge-up

[![npm](https://img.shields.io/npm/v/badge-up.svg?maxAge=2592000)](https://www.npmjs.com/package/badge-up)
[![downloads](https://img.shields.io/npm/dt/badge-up.svg?maxAge=2592000)](https://www.npmjs.com/package/badge-up)

This is a simple library that generates SVG badges without Cairo.

## Install

`npm install badge-up`

## Usage

### Generating an SVG

```js

var badge = require('badge-up');

badge('batman', 'component', badge.colors.green, function (error, svg) {
    // some callback
});
```

Produces: ![example](https://cdn.rawgit.com/yahoo/badge-up/master/test/testData/good.svg)
