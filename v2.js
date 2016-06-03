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
    DEFAULT_COLOR_FIRST     = '#696969',    // dimgrey
    DEFAULT_COLOR_REST      = '#d3d3d3',    // lightgrey
    PAD_X                   = 5,
    PAD_Y                   = 4,
    LINE_HEIGHT             = 12,
    DECENDER_HEIGHT         = 2,
    DEFAULT_LETTER_WIDTH    = 8;            // probably unicode, hard to guess width


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
            if (attribute.match(/^[0-9a-f]{6}$/i)) {
                sectionData.color = '#' + attribute.toLowerCase();
                return;
            }
            if (colors[attribute]) {
                sectionData.color = colors[attribute];
                return;
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
    svgo.optimize(raw, function(optimized) {
        callback(undefined, optimized.data);
    });
};


// mainly for unit testing
module.exports.sectionsToData = sectionsToData;
