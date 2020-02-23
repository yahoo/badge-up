/*
Copyright (c) 2016, Yahoo Inc.
Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
*/

/* Inline JSHint configuration for Mocha globals. */
/* global describe, it, beforeEach, afterEach */

var assert = require('chai').assert,
    fs = require('fs'),
    v2 = require('../v2');

function getMock(name) {
    var path = __dirname + '/testData/' + name + '.svg';
    return fs.readFileSync(path).toString().trim();
}

describe('v2.js', function() {
    describe('sectionsToData()', function() {
        it('uses default colors', function() {
            var sections, have;
            sections = ['foo', 'bar', 'baz'];
            have = v2.sectionsToData(sections);
            assert.equal('#696969', have.sections[0].color);
            assert.equal('#d3d3d3', have.sections[1].color);
            assert.equal('#d3d3d3', have.sections[2].color);
        });
        it('uses color attributes', function() {
            var sections, have;
            sections = [
                ['foo', 'lightgreen'],
                ['bar', 'ef03BB']
            ];
            have = v2.sectionsToData(sections);
            assert.equal('#90ee90', have.sections[0].color);
            assert.equal('#ef03bb', have.sections[1].color);
        });
        it('uses stroke attributes', function() {
            var sections, have;
            sections = ['foo', ['bar', 'd3d3d3', 's{ffffff}']];
            have = v2.sectionsToData(sections);
            assert.equal(null, have.sections[0].stroke);
            assert.equal('#ffffff', have.sections[1].stroke);
        });
        it('ignores stroke attributes with invalid color', function() {
            var sections, have;
            sections = ['foo', ['bar', 'd3d3d3', 's{foobar}']];
            have = v2.sectionsToData(sections);
            assert.equal(null, have.sections[0].stroke);
            assert.equal(null, have.sections[1].stroke);
        });
        it('lays out two sections', function() {
            var sections, want, have;
            sections = ['foo', 'bar'];
            want = {
                width: 57,
                height: 20,
                sections: [
                    {
                        x: 0,
                        width: 28,
                        color: '#696969',
                        lines: [
                            {
                                x: 5,
                                y: 14,
                                text: 'foo',
                            },
                        ],
                    },
                    {
                        x: 28,
                        width: 29,
                        color: '#d3d3d3',
                        lines: [
                            {
                                x: 33,
                                y: 14,
                                text: 'bar'
                            },
                        ],
                    },
                ]
            };
            have = v2.sectionsToData(sections);
            assert.deepEqual(want, have);
        });
        it('ignores unknown attributes', function() {
            var sections, want, have;
            sections = [['foo', 'mork', 'mindy'], ['bar', 'oh no not this']];
            want = {
                width: 57,
                height: 20,
                sections: [
                    {
                        x: 0,
                        width: 28,
                        color: '#696969',
                        lines: [
                            {
                                x: 5,
                                y: 14,
                                text: 'foo',
                            },
                        ],
                    },
                    {
                        x: 28,
                        width: 29,
                        color: '#d3d3d3',
                        lines: [
                            {
                                x: 33,
                                y: 14,
                                text: 'bar'
                            },
                        ],
                    },
                ]
            };
            have = v2.sectionsToData(sections);
            assert.deepEqual(want, have);
        });
        it('lays out a complex example', function() {
            var sections, want, have;
            sections = [
                'foo/far;fun',
                [ 'bar\nbaz', 'orange'],
                [ 'mork "mindy"', 'olive'],
                [ '<∀>', 'moccasin'],
            ];
            want = {
                width: 219,
                height: 32,
                sections: [
                    {
                        x: 0,
                        width: 70,
                        color: "#696969",
                        lines: [
                            {
                                x: 5,
                                y: 14,
                                text: "foo/far;fun"
                            }
                        ],
                    },
                    {
                        x: 70,
                        width: 30,
                        color: "#ffa500",
                        lines: [
                            {
                                x: 75,
                                y: 14,
                                text: "bar"
                            },
                            {
                                x: 75,
                                y: 26,
                                text: "baz"
                            }
                        ],
                    },
                    {
                        x: 100,
                        width: 86,
                        color: "#808000",
                        lines: [
                            {
                                x: 105,
                                y: 14,
                                text: "mork \"mindy\""
                            }
                        ],
                    },
                    {
                        x: 186,
                        width: 33,
                        color: "#ffe4b5",
                        lines: [
                            {
                                x: 191,
                                y: 14,
                                text: "<∀>"
                            }
                        ],
                    }
                ]
            };
            have = v2.sectionsToData(sections);
            assert.deepEqual(want, have);
        });
    });

    describe('badge()', function() {
        it('renders foo/bar correctly', function(testDone) {
            var sections = [ 'foo', 'bar' ];
            v2(sections, function(err, svg) {
                assert.isUndefined(err);
                assert.strictEqual(svg, getMock('v2-foo-bar'));
                testDone();
            });
        });
        it('renders foo/bar correctly (returning Promise)', function(testDone) {
            var sections = [ 'foo', 'bar' ];
            v2(sections).then(function(svg) {
                assert.strictEqual(svg, getMock('v2-foo-bar'));
                testDone();
            }).catch(function(err) {
              assert.isOk(false);
              testDone();
            });
        });
        it('renders a named color correctly', function(testDone) {
            var sections = [ 'foo', ['bar', 'lightgreen'] ];
            v2(sections, function(err, svg) {
                assert.isUndefined(err);
                assert.strictEqual(svg, getMock('v2-one-color'));
                testDone();
            });
        });
        it('renders the example correctly', function(testDone) {
            var sections = [
                    'foo/far;fun',
                    [ 'bar\nbaz', 'orange'],
                    [ 'mork "mindy"', 'olive', 's{white}'],
                    [ '<∀>', 'moccasin'],
                ];
            v2(sections, function(err, svg) {
                assert.isUndefined(err);
                assert.strictEqual(svg, getMock('v2-example'));
                testDone();
            });
        });
        it('renders stroke correctly', function(testDone) {
            var sections = [ 'foo', ['bar', 'd3d3d3', 's{white}' ]];
            v2(sections, function(err, svg) {
                assert.isUndefined(err);
                assert.strictEqual(svg, getMock('v2-foo-bar-stroke'));
                testDone();
            });
        });
    });
});
