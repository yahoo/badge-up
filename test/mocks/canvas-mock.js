/*
Copyright (c) 2016, Yahoo Inc.
Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
*/

var sinon = require('sinon'),
    myMocks = {};

function canvasMock(height, width) {
    this.height = height;
    this.width = width;
}

function generateMock() {
    myMocks = {
        getContext: sinon.mock(),
        Font: sinon.mock(),
        measureText: sinon.stub(),    //stub because of mocks failure to match to specific strings
        addFont: sinon.stub()
    };

    canvasMock.prototype = {
        getContext: myMocks.getContext
    };
    canvasMock.Font = myMocks.Font;
    myMocks.getContext.withArgs('2d').returns({measureText: myMocks.measureText, addFont: myMocks.addFont});

    return canvasMock;
}

function resetMocks() {
    myMocks.getContext.reset();
    myMocks.Font.reset();
    myMocks.measureText = sinon.stub();
}

module.exports = {
    generateMock: generateMock,
    accessSinonMocks: function () { return myMocks; },
    resetAll: resetMocks
};
