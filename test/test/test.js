"use strict";
exports.__esModule = true;
exports.test = void 0;
function test(caseName, testingFunction, input, expectedOutput) {
    var output = testingFunction.apply(void 0, input);
    console.log('CASE:', caseName);
    console.log('expected:', expectedOutput);
    console.log('but got:', output);
    return output == expectedOutput;
}
exports.test = test;
