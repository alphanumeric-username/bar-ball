"use strict";
exports.__esModule = true;
var vec2_1 = require("../../math/vec2");
var mat2_1 = require("../../math/mat2");
var object_set_1 = require("../../object-set");
var util_1 = require("../../math/util");
function minkowiskDifferenceSupportFunction(shape1, shape2) {
    return function (direction) { return vec2_1["default"].sub(shape1.supportFunction(direction), shape2.supportFunction(vec2_1["default"].negate(direction))); };
}
function linearFuncMinimun(a, b, intervalStart, intervalEnd) {
    if (intervalStart === void 0) { intervalStart = 0; }
    if (intervalEnd === void 0) { intervalEnd = 1; }
    return a >= 0 ? intervalStart : intervalEnd;
}
function quadFuncMinimun(a, b, c, intervalStart, intervalEnd) {
    if (intervalStart === void 0) { intervalStart = 0; }
    if (intervalEnd === void 0) { intervalEnd = 1; }
    if (util_1.fpCmp(a, 0)) {
        return linearFuncMinimun(a, b, intervalStart, intervalEnd);
    }
    var f = function (t) { return a * t * t + b * t + c; };
    var criticalPoint = -b / (2 * a);
    var globalMinMax = f(criticalPoint);
    var startVal = f(intervalStart);
    var endVal = f(intervalEnd);
    if (criticalPoint >= intervalStart && criticalPoint <= intervalEnd) {
        var minimum = Math.min(startVal, endVal, globalMinMax);
        return util_1.fpCmp(startVal, minimum) ? intervalStart :
            util_1.fpCmp(endVal, minimum) ? intervalEnd : criticalPoint;
    }
    else {
        var minimum = Math.min(startVal, endVal);
        return util_1.fpCmp(startVal, minimum) ? intervalStart : intervalEnd;
    }
}
// function pointLineIntersectionTest(q: Vec2, p1: Vec2, p2: Vec2): boolean {
//     const [tx, ty] = [(q.x - p1.x)/(p2.x - p1.x), (q.y - p1.y)/(p2.y - p1.y)];
//     return fpCmp(tx, ty) && tx >= 0 && tx <= 1;
// }
function pointTriangleIntersectionTest(q, p1, p2, p3) {
    var basis = [vec2_1["default"].sub(p2, p1), vec2_1["default"].sub(p3, p1)];
    var basisChangeMatrix = mat2_1["default"].scale(1 / (basis[0].x * basis[1].y - basis[1].x * basis[0].y), new mat2_1["default"](basis[1].y, -basis[1].x, -basis[0].y, basis[0].x));
    var q_ = mat2_1["default"].transform(basisChangeMatrix, vec2_1["default"].sub(q, p1));
    if (q_.x >= 0 && q_.y >= 0 && Math.abs(q_.x) + Math.abs(q_.y) <= 1) {
        return true;
    }
    return false;
}
function nearestLinePointSet(p1, p2) {
    var ax = (p2.x - p1.x) * (p2.x - p1.x);
    var bx = 2 * p1.x * (p2.x - p1.x);
    var cx = (p1.x) * (p1.x);
    var ay = (p2.y - p1.y) * (p2.y - p1.y);
    var by = 2 * p1.y * (p2.y - p1.y);
    var cy = (p1.y) * (p1.y);
    var tmin = quadFuncMinimun(ax + ay, bx + by, cx + cy);
    return [new vec2_1["default"](p1.x * (1 - tmin) + p2.x * (tmin), p1.y * (1 - tmin) + p2.y * (tmin)), new object_set_1.ObjectSet([p1, p2])];
}
function nearestTrianglePointSet(p1, p2, p3) {
    var origin = new vec2_1["default"](0, 0);
    if (pointTriangleIntersectionTest(origin, p1, p2, p3)) {
        return [origin, new object_set_1.ObjectSet([p1, p2, p3])];
    }
    else {
        var candidates = [
            nearestLinePointSet(p1, p2),
            nearestLinePointSet(p2, p3),
            nearestLinePointSet(p3, p1),
        ];
        var minimum_1 = candidates[0];
        candidates.forEach(function (c) {
            if (vec2_1["default"].norm(c[0]) < vec2_1["default"].norm(minimum_1[0])) {
                minimum_1 = c;
            }
        });
        return minimum_1;
    }
}
function findNearestPointSetOfUpTo4PointsConvexHull(convexHull) {
    var points = [];
    convexHull.forEach(function (p) { return points.push(p); });
    if (convexHull.size() == 1) {
        return [points[0], convexHull];
    }
    else if (convexHull.size() == 2) {
        return nearestLinePointSet(points[0], points[1]);
    }
    else if (convexHull.size() == 3) {
        return nearestTrianglePointSet(points[0], points[1], points[2]);
    }
    else if (convexHull.size() == 4) {
        var candidates = [
            findNearestPointSetOfUpTo4PointsConvexHull(new object_set_1.ObjectSet([points[0], points[1], points[2]])),
            findNearestPointSetOfUpTo4PointsConvexHull(new object_set_1.ObjectSet([points[0], points[1], points[3]])),
            findNearestPointSetOfUpTo4PointsConvexHull(new object_set_1.ObjectSet([points[0], points[2], points[3]])),
            findNearestPointSetOfUpTo4PointsConvexHull(new object_set_1.ObjectSet([points[1], points[2], points[3]])),
        ];
        var minimum_2 = candidates[0];
        candidates.forEach(function (c) {
            if (vec2_1["default"].norm(c[0]) < vec2_1["default"].norm(minimum_2[0])) {
                minimum_2 = c;
            }
        });
        return minimum_2;
    }
}
// function minimumUpTo4PointsConvexHullContainingPoint(convexHull: ObjectSet<Vec2>, point: Vec2): ObjectSet<Vec2> {
//     const points: Vec2[] = [];
//     convexHull.forEach(p => points.push(p));
//     if (convexHull.size() <= 2) {
//         return convexHull;
//     } else if (convexHull.size() == 3) {
//         var nextSet = convexHull;
//         if (pointLineIntersectionTest(point, points[0], points[1])) {
//             nextSet = new ObjectSet<Vec2>([points[0], points[1]]);
//         } else if (pointLineIntersectionTest(point, points[1], points[2])) {
//             nextSet = new ObjectSet<Vec2>([points[1], points[2]]);
//         } else if (pointLineIntersectionTest(point, points[2], points[0])) {
//             nextSet = new ObjectSet<Vec2>([points[2], points[0]]);
//         }
//         if (nextSet == convexHull) {
//             return convexHull;
//         }
//         return minimumUpTo4PointsConvexHullContainingPoint(nextSet, point);
//     } else if (convexHull.size() == 4) {
//         var nextSet: ObjectSet<Vec2> = convexHull;
//         if (pointTriangleIntersectionTest(point, points[0], points[1], points[2])) {
//             nextSet = new ObjectSet<Vec2>([points[0], points[1], points[2]]);
//         } else if (pointTriangleIntersectionTest(point, points[0], points[1], points[3])) {
//             nextSet = new ObjectSet<Vec2>([points[0], points[1], points[3]]);
//         } else if (pointTriangleIntersectionTest(point, points[0], points[2], points[3])) {
//             nextSet = new ObjectSet<Vec2>([points[0], points[2], points[3]]);
//         } else if (pointTriangleIntersectionTest(point, points[1], points[2], points[3])) {
//             nextSet = new ObjectSet<Vec2>([points[1], points[2], points[3]]);
//         }
//         if (nextSet == convexHull) {
//             return convexHull;
//         }
//         return minimumUpTo4PointsConvexHullContainingPoint(nextSet, point);
//     }
// }
var MAX_ITERATIONS = 100;
//TODO: return nearest points
function gjk(shape1, shape2) {
    var _a;
    var supportFunction = minkowiskDifferenceSupportFunction(shape1, shape2);
    var initialPoint = supportFunction(new vec2_1["default"](1, 0));
    var simplexPoints = new object_set_1.ObjectSet([initialPoint]);
    var point = initialPoint;
    var iterations = MAX_ITERATIONS;
    for (var i = 0; i < MAX_ITERATIONS; i++) {
        var supportPoint = supportFunction(vec2_1["default"].negate(point));
        var pointDirection = vec2_1["default"].normalize(point);
        var negPointDirection = vec2_1["default"].negate(pointDirection);
        var pointDotNegDir = vec2_1["default"].dot(point, negPointDirection);
        var supportPointDotNegDir = vec2_1["default"].dot(supportPoint, negPointDirection);
        if (pointDotNegDir > supportPointDotNegDir || util_1.fpCmp(pointDotNegDir, supportPointDotNegDir) || vec2_1["default"].norm(point) == 0) {
            iterations = i + 1;
            break;
        }
        simplexPoints.add(supportPoint);
        _a = findNearestPointSetOfUpTo4PointsConvexHull(simplexPoints), point = _a[0], simplexPoints = _a[1];
    }
    // console.log('Finished in', iterations, 'iterations');
    return [vec2_1["default"].norm(point), vec2_1["default"].normalize(point)];
}
exports["default"] = gjk;
