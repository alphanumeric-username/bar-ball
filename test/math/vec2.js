"use strict";
exports.__esModule = true;
var util_1 = require("./util");
var Vec2 = /** @class */ (function () {
    function Vec2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vec2.prototype.toTuple = function () {
        return [this.x, this.y];
    };
    Vec2.fromTuple = function (data) {
        return new Vec2(data[0], data[1]);
    };
    Vec2.add = function (u, v) {
        return new Vec2(u.x + v.x, u.y + v.y);
    };
    Vec2.negate = function (u) {
        return new Vec2(-u.x, -u.y);
    };
    Vec2.sub = function (u, v) {
        return Vec2.add(u, Vec2.negate(v));
    };
    Vec2.dot = function (u, v) {
        return u.x * v.x + u.y * v.y;
    };
    Vec2.norm = function (u) {
        return Math.sqrt(Vec2.dot(u, u));
    };
    Vec2.distance = function (u, v) {
        return Vec2.norm(Vec2.sub(u, v));
    };
    Vec2.scale = function (k, u) {
        return new Vec2(u.x * k, u.y * k);
    };
    Vec2.normalize = function (u) {
        var norm = Vec2.norm(u);
        if (norm == 0) {
            return new Vec2(0, 0);
        }
        return Vec2.scale(1 / norm, u);
    };
    Vec2.normal = function (u) {
        return Vec2.normalize(new Vec2(-u.y, u.x));
    };
    Vec2.copy = function (u) {
        return new Vec2(u.x, u.y);
    };
    Vec2.prototype.toString = function () {
        return "(" + this.x + ", " + this.y + ")";
    };
    Vec2.prototype.equals = function (b) {
        return util_1.fpCmp(this.x, b.x) && util_1.fpCmp(this.y, b.y);
        // return (Math.abs(this.x - b.x) < Number.EPSILON) && (Math.abs(this.y - b.y) < Number.EPSILON);
    };
    return Vec2;
}());
exports["default"] = Vec2;
