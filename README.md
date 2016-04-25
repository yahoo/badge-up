badge-up
========

This is a simple library that generates SVG badges.

Install
-------

`npm install badge-up`

Usage
-----

Generating an SVG

```js

var badge = require('badge-up');

badge('batman', 'component', badge.colors.green, function (error, svg) {
    // some callback
});
```

Using the colors

```js

var badge = require('badge-up');

var colors = badge.colors;
```
