/*
Copyright (c) 2016, Yahoo Inc.
Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
*/

var assert = require('chai').assert,
    utils = require('../utils');

describe('utils.js', function() {
    describe('escapeXml()', function() {
        it('should escape all funky characters', function() {
            assert.strictEqual(utils.escapeXml('&'), '&amp;');
            assert.strictEqual(utils.escapeXml('<'), '&lt;');
            assert.strictEqual(utils.escapeXml('>'), '&gt;');
            assert.strictEqual(utils.escapeXml('"'), '&quot;');
            assert.strictEqual(utils.escapeXml("'"), '&apos;');
        });
        it('should escape all instances', function() {
            assert.strictEqual(
                utils.escapeXml('"<<<\'yes&no&maybe\'>>>"'),
                '&quot;&lt;&lt;&lt;&apos;yes&amp;no&amp;maybe&apos;&gt;&gt;&gt;&quot;'
            );
        });
    });

    describe('textWidth()', function() {
        it('should measure simple text', function() {
            assert.strictEqual(utils.textWidth('hi'), 11);
        });
        it("shouldn't measure weird characters by default", function() {
            assert.strictEqual(utils.textWidth('HI∃'), 14);
        });
        it("should measure weird characters when asked", function() {
            assert.strictEqual(utils.textWidth('HI∃',7), 21);
        });
    });
});
