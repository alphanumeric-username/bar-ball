"use strict";
exports.__esModule = true;
var test_1 = require("./test");
var gjk_1 = require("../physics/collision/gjk");
var circle_1 = require("../physics/collision/circle");
test_1.test('circle not intersecting 1', gjk_1["default"], [
    new circle_1["default"](0, 0, 4),
    new circle_1["default"](10, 10, 4)
], [6.142135623731]);
test_1.test('circle not intersecting 2', gjk_1["default"], [
    new circle_1["default"](-5, 5, 1),
    new circle_1["default"](4, 4, 3)
], [5.0553851381374]);
test_1.test('circle not intersecting 3', gjk_1["default"], [
    new circle_1["default"](-5, 5, 1),
    new circle_1["default"](6, 8, 3)
], [7.4017542509914]);
test_1.test('circle intersecting 1', gjk_1["default"], [
    new circle_1["default"](0, 0, 4),
    new circle_1["default"](2, 2, 4),
], [0]);
test_1.test('circle intersecting 2', gjk_1["default"], [
    new circle_1["default"](0, 0, 4),
    new circle_1["default"](8, 0, 4),
], [0]);
