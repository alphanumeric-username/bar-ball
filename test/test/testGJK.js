"use strict";
exports.__esModule = true;
var test_1 = require("./test");
var gjk_1 = require("../physics/collision/gjk");
var circle_1 = require("../physics/collision/circle");
// test('circle not intersecting 1', gjk, [
//     new Circle(0, 0, 4),
//     new Circle(10, 10, 4)
// ], [ 6.142135623731 ]);
// test('circle not intersecting 2', gjk, [
//     new Circle(-5, 5, 1),
//     new Circle(4, 4, 3)
// ], [ 5.0553851381374 ]);
test_1.test('circle intersecting', gjk_1["default"], [
    new circle_1["default"](0, 0, 4),
    new circle_1["default"](2, 2, 4),
], [0]);
