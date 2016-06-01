/*
Copyright (c) 2016, Yahoo Inc.
Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
*/

var LETTER_WIDTH = [
        0,25,25,25,25,25,25,25,0,23,0,25,25,0,25,25,25,25,25,25,25,25,25,
        25,25,25,25,25,25,0,25,25,3,3,4,6,6,9,7,2,4,4,4,6,3,4,3,3,6,6,6,6,6,6,6,
        6,6,6,3,3,6,6,6,6,11,7,7,8,8,7,7,8,8,3,5,7,6,9,8,8,7,8,8,7,7,8,7,10,7,7,
        7,3,3,3,5,6,4,6,6,5,6,6,3,6,6,3,3,5,3,9,6,6,6,6,4,5,3,6,5,8,5,5,5,4,3,4,
        6,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,
        25,25,25,25,25,25,25,25,25,25,3,4,6,6,6,6,3,6,4,8,4,6,6,0,8,4,4,6,4,4,4,
        6,6,3,4,4,4,6,9,9,9,7,7,7,7,7,7,7,10,8,7,7,7,7,3,3,3,3,8,8,8,8,8,8,8,6,
        8,8,8,8,8,7,7,7,6,6,6,6,6,6,9,5,6,6,6,6,3,3,3,3,6,6,6,6,6,6,6,6,7,6,6,6,
        6,5,6
    ];


/**
 * Escape the string so that it doesn't break xml
 * @method escapeXml
 * @param  {String}  string Input String
 * @return {String}         XML Safe String
 */
module.exports.escapeXml = function escapeXml(string) {
    return string.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&apos;');
};


/**
 * Return the size of the text
 *
 * @method textWidth
 * @param  {String} text         Text you want to measure
 * @param  {Number} defaultWidth Width for unknown characters
 * @return {Integer}             Size in pixels of the text
 */
module.exports.textWidth = function textWidth(text, defaultWidth) {
    var total = 0;
    defaultWidth = defaultWidth || 0;
    // Measure each letter and add padding between letters
    text.split('').forEach(function (letter) {
        total += 1 + (LETTER_WIDTH[letter.charCodeAt(0)] || defaultWidth);
    });
    return total;
};


