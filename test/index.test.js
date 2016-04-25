/*
Copyright (c) 2016, Yahoo Inc.
Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
*/

/* Inline JSHint configuration for Mocha globals. */
/* global describe, it, beforeEach, afterEach */

var assert = require('chai').assert,
    mockery = require('mockery'),
    fs = require('fs'),
    canvasMock = require('./mocks/canvas-mock');

function getMock(name) {
    return fs.readFileSync(__dirname + '/testData/' + name + '.svg').toString().trim();
}

describe('#index', function () {
    beforeEach(function () {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });

        this.canvasMock = canvasMock.generateMock();
        mockery.registerMock('canvas', this.canvasMock);

        'abcdefghijklmnopqrstuvwxyz-&<>"\''.split('').forEach(function (letter, index) {
            canvasMock.accessSinonMocks().measureText.withArgs(letter).returns({width: index});
        });
    });

    afterEach(function () {
        canvasMock.resetAll();
        mockery.deregisterAll();
        mockery.disable();
    });

    it('should be able to create a badge', function (done) {
        var badge;

        badge = require('../index');
        badge('batman', 'component', badge.colors.green, function (error, svg) {
            assert.isNull(error);
            assert.strictEqual(svg, getMock('good'));
            done();
        });
    });

    it('should be able to create a long badge', function (done) {
        var badge;

        badge = require('../index');
        badge('batmanandrobinforever', 'component', badge.colors.green, function (error, svg) {
            assert.isNull(error);
            assert.strictEqual(svg, getMock('long'));
            done();
        });
    });

    it('should prevent bad xml values', function (done) {
        var badge;

        badge = require('../index');
        badge('&<>"\'', '&<>"\'', badge.colors.green, function (error, svg) {
            assert.isNull(error);
            assert.strictEqual(svg, getMock('xml'));
            done();
        });
    });
});
