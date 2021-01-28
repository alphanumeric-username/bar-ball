"use strict";
exports.__esModule = true;
var vec2_1 = require("../../math/vec2");
var ShapeImplementation = /** @class */ (function () {
    function ShapeImplementation() {
        this.center = {
            position: new vec2_1["default"](0, 0),
            velocity: new vec2_1["default"](0, 0),
            acceleration: new vec2_1["default"](0, 0)
        };
    }
    ShapeImplementation.prototype.supportFunction = function (direction) {
        return vec2_1["default"].normalize(vec2_1["default"].sub(direction, this.center.position));
    };
    ShapeImplementation.prototype.update = function () {
        this.center.position = vec2_1["default"].add(this.center.position, this.center.velocity);
        this.center.velocity = vec2_1["default"].add(this.center.velocity, this.center.acceleration);
    };
    return ShapeImplementation;
}());
exports["default"] = ShapeImplementation;
