"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var vec2_1 = require("../../math/vec2");
var shape_implementation_1 = require("./shape-implementation");
// class Circle implements IShape{
//     pos: Vec2;
//     r: number;
//     readonly name: string = 'circle';
//     group?: Set<string> = new Set()
//     shapeSpace: IShapeSpace = null;
//     constructor(x: number, y: number, r: number) {
//         this.move(x, y);
//         this.r = r;
//     }
//     move(x: number, y: number) {
//         this.pos = new Vec2(x, y);
//     }
//     resize(r: number) {
//         this.r = r;
//     }
//     onCollide(e: CollideEvent): void {
//     }
// }
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(x, y, radius) {
        var _this = _super.call(this) || this;
        _this.center.position = new vec2_1["default"](x, y);
        _this.radius = radius;
        return _this;
    }
    Circle.prototype.supportFunction = function (direction) {
        var normalizedDirection = _super.prototype.supportFunction.call(this, direction);
        return vec2_1["default"].add(this.center.position, vec2_1["default"].scale(this.radius, normalizedDirection));
    };
    Circle.prototype.update = function () {
        _super.prototype.update.call(this);
    };
    Circle.prototype.onCollide = function (e) {
    };
    return Circle;
}(shape_implementation_1["default"]));
exports["default"] = Circle;
