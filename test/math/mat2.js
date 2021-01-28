"use strict";
exports.__esModule = true;
var vec2_1 = require("./vec2");
var Mat2 = /** @class */ (function () {
    function Mat2(a, b, c, d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }
    Mat2.prototype.toTuple = function () {
        return [this.a, this.b, this.c, this.d];
    };
    Mat2.multiply = function (A, B) {
        return new Mat2(A.a * B.a + A.b * B.c, A.a * B.b + A.b * B.d, A.c * B.a + A.d * B.c, A.c * B.b + A.d * B.d);
    };
    Mat2.transform = function (A, u) {
        return new vec2_1["default"](A.a * u.x + A.b * u.y, A.c * u.x + A.d * u.y);
    };
    Mat2.scale = function (k, M) {
        return new Mat2(k * M.a, k * M.b, k * M.c, k * M.d);
    };
    return Mat2;
}());
exports["default"] = Mat2;
