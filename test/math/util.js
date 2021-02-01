"use strict";
exports.__esModule = true;
exports.fpCmp = exports.lineEquation = exports.between = exports.randomElement = exports.randomInt = exports.clamp = void 0;
function clamp(t, min, max) {
    return t > max ? max :
        t < min ? min :
            t;
}
exports.clamp = clamp;
function between(t, min, max) {
    return clamp(t, min, max) == t;
}
exports.between = between;
function randomInt(start, end) {
    var range = end - start;
    return start + Math.floor(Math.random() * range);
}
exports.randomInt = randomInt;
function randomElement(set) {
    return set[randomInt(0, set.length)];
}
exports.randomElement = randomElement;
function lineEquation(x0, y0, x1, y1) {
    var a;
    var b;
    var c;
    if (x0 == x1 && y0 == y1) {
        return function (x, y) { return 0; };
    }
    if (x0 == x1) {
        a = -1;
        b = 0;
        c = x0;
    }
    else {
        a = (y1 - y0) / (x1 - x0);
        b = -1;
        c = y0 - a * x0;
    }
    return function (x, y) { return a * x + b * y + c; };
}
exports.lineEquation = lineEquation;
function fpCmp(a, b, epsilon) {
    if (epsilon === void 0) { epsilon = Number.EPSILON; }
    var absA = Math.abs(a);
    var absB = Math.abs(b);
    var diff = Math.abs(a - b);
    if (a == b) {
        return true;
    }
    else if (a == 0 || b == 0 || (absA + absB < Number.MIN_VALUE)) {
        return diff < epsilon * Number.MIN_VALUE;
    }
    else {
        return diff / Math.min((absA + absB), Number.MAX_VALUE) < epsilon;
    }
}
exports.fpCmp = fpCmp;
function fpCmp2(a, b, epsilon) {
    if (epsilon === void 0) { epsilon = Number.EPSILON; }
    return a > b ? 1 :
        a < b ? -1 :
            0;
}
