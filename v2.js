/*
Copyright (c) 2016, Yahoo Inc.
Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
*/

var colors = require('css-color-names'),
    dot = require('dot'),
    fs = require('fs'),
    path = require('path'),
    svgo = require('svgo'),
    utils = require('./utils'),
    SVGO = require('svgo'),
    svgo = new SVGO(),
    TEMPLATE = dot.template(fs.readFileSync(path.join(__dirname, 'templates', 'v2.svg'), 'utf-8')),
    COLOR_REGEX             = /^[0-9a-f]{6}$/i,
    STROKE_REGEX            = /^s\{(.+?)\}$/i,
    DEFAULT_COLOR_FIRST     = '#696969',    // dimgrey
    DEFAULT_COLOR_REST      = '#d3d3d3',    // lightgrey
    PAD_X                   = 5,
    PAD_Y                   = 4,
    LINE_HEIGHT             = 12,
    DECENDER_HEIGHT         = 2,
    DEFAULT_LETTER_WIDTH    = 8;            // probably unicode, hard to guess width

/**
 * Validate and return appropriate color code from input string
 * @method getColorCode
 * @param  {String}   input  String to check for valid color code
 */
function getColorCode(input) {
    if (COLOR_REGEX.test(input)) {
        return '#' + input.toLowerCase();
    }

    if (colors[input]) {
        return colors[input];
    }

    return false;
}

function sectionsToData(sections) {
    var badgeData = {
            width:      0,
            height:     0,
            sections:   [],
        };
    sections.forEach(function(section, s) {
        var sectionData = {
                x:      0,
                width:  0,
                lines:  [],
            },
            sectionHeight,
            text,
            lines;
        if (! Array.isArray(section)) {
            section = [ section ];
        }
        text = section.shift();
        sectionData.x = badgeData.width;
        sectionData.color = (s === 0 ? DEFAULT_COLOR_FIRST : DEFAULT_COLOR_REST);
        section.forEach(function(attribute) {
            // stroke attribute `s{color}` as CSS color or color code in hex
            var strokeAttribute = STROKE_REGEX.exec(attribute);
            if (strokeAttribute) {
                sectionData.stroke = getColorCode(strokeAttribute[1]) || null;
            }

            // fill color attribute (without attribute qualifier) as CSS color or color code in hex
            if (getColorCode(attribute)) {
                sectionData.color = getColorCode(attribute);
            }
            // FUTURE -- text alignment `a{align}` lmr (only matters when multiline)
            // FUTURE -- font `f{font}` mainly for monospace (`fm`)
        });
        lines = text.split('\n');
        lines.forEach(function(line, l) {
            var lineData = {
                    x:      0,
                    y:      0,
                    text:   line,
                },
                lineWidth;
            lineWidth = (2 * PAD_X) + utils.textWidth(lineData.text, DEFAULT_LETTER_WIDTH);
            lineData.x = badgeData.width + PAD_X;
            lineData.y = (LINE_HEIGHT * l) + PAD_Y + LINE_HEIGHT - DECENDER_HEIGHT;
            sectionData.lines.push(lineData);
            sectionData.width = Math.max(sectionData.width, lineWidth);
        });
        badgeData.sections.push(sectionData);
        sectionHeight = (2 * PAD_Y) + (lines.length * LINE_HEIGHT);
        badgeData.height = Math.max(badgeData.height, sectionHeight);
        badgeData.width += sectionData.width;
    });
    return badgeData;
}


module.exports = function badge_v2(sections, callback) {
    var raw = TEMPLATE(sectionsToData(sections));
    return svgo.optimize(raw).then(function(optimized) {
        if (callback) callback(undefined, optimized.data);
        return optimized.data;
    });
};


// mainly for unit testing
module.exports.sectionsToData = sectionsToData;
