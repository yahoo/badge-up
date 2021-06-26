/*
Copyright (c) 2016, Yahoo Inc.
Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
*/

var fs = require('fs'),
    path = require('path'),
    {optimize} = require('svgo'),
    dot = require('dot'),
    template = dot.template(fs.readFileSync(path.join(__dirname, 'templates', 'basic.svg'), 'utf-8')),
    v2 = require('./v2'),
    utils = require('./utils');

/**
 * Generates a SVG for pretty badges
 *
 * @method badge
 * @param  {String}   field1   Text field 1
 * @param  {String}   field2   Text field 2
 * @param  {String}   color    Color text to pick
 * @param  {Function} callback Function to call when done (error, SVG)
 */
module.exports = async function badge (field1, field2, color, callback) {
    var data = {
            text: [
                utils.escapeXml(field1),
                utils.escapeXml(field2)
            ],
            widths: [
                // Add 10 extra pixels of padding
                utils.textWidth(field1) + 10,
                utils.textWidth(field2) + 10
            ],
            colorA: '#555',
            colorB: utils.escapeXml(color)
        };

    // Run the SVG through SVGO.
    const object = optimize(
        template(data)
            // Due to https://github.com/svg/svgo/issues/1498
            .replace(/&#(x3c|60);/gi, '&lt;')
            .replace(/&#(x26|38);/gi, '&amp;')
    );
    if (callback) callback(null, object.data);
    return object.data;
};

/**
 * List of available colors
 *
 * @type {Object}
 */
module.exports.colors = {
    'brightgreen': '#4C1',
    'green': '#97CA00',
    'yellow': '#DFB317',
    'yellowgreen': '#A4A61D',
    'orange': '#FE7D37',
    'red': '#E05D44',
    'blue': '#007EC6',
    'grey': '#555',
    'gray': '#555',
    'lightgrey': '#9F9F9F',
    'lightgray': '#9F9F9F',
    'purple': '#400090'
};

// v2 API from v2.js
module.exports.v2 = v2;
