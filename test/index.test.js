/*
Copyright (c) 2016, Yahoo Inc.
Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
*/

/* Inline JSHint configuration for Mocha globals. */
/* global describe, it, beforeEach, afterEach */

var assert = require('chai').assert,
    fs = require('fs'),
    badge = require('../index');

function getMock(name) {
    return fs.readFileSync(__dirname + '/testData/' + name + '.svg').toString().trim();
}

describe('#index', function () {
    it('should be able to create a badge', function (done) {
        badge('batman', 'component', badge.colors.green, function (error, svg) {
            assert.isNull(error);
            assert.strictEqual(svg, getMock('good'));
            done();
        });
    });

    it('should be able to create a badge (returning a Promise)', function (done) {
        badge('batman', 'component', badge.colors.green).then(function (svg) {
            assert.strictEqual(svg, getMock('good'));
            done();
        }).catch(function () {
          assert.isOk(false);
        });
    });

    it('should be able to create a long badge', function (done) {
        badge('batmanandrobinforever', 'component', badge.colors.green, function (error, svg) {
            assert.isNull(error);
            assert.strictEqual(svg, getMock('long'));
            done();
        });
    });

    it('should prevent bad xml values', function (done) {
        badge('&<>"\'', '&<>"\'', badge.colors.green, function (error, svg) {
            assert.isNull(error);
            assert.strictEqual(svg, getMock('xml'));
            done();
        });
    });
});
