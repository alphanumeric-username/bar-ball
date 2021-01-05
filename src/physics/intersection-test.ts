import Vec2 from "../math/vec2";
import { Line, Circle, Rectangle } from "./shapes";
import { solveQuadEq } from "../math/quad-eq";
import { between } from "../math/util";
import { Shape } from "./shapes";

function testLineCircleIntersection(line: Line, circle: Circle) {
    const k = Vec2.distance(line.endPos, line.startPos);
    const D = Vec2.normalize(Vec2.sub(line.endPos, line.startPos));
    const C = Vec2.sub(circle.pos, line.startPos);
    
    const a = Vec2.dot(D, D)*k*k;
    const b = - 2*Vec2.dot(D, C)*k;
    const c = Vec2.dot(C, C) - circle.r*circle.r;

    const values: [number, number] | null = solveQuadEq(a, b, c);
    if (values ==  null) {
        return false;
    }
    const [t1, t2] = values;
    return between(t1, 0, 1) || between(t2, 0, 1);
}

// function testLineLineIntersection(line1: Line, line2: Line): boolean {
//     const 
// }

function testLineRectangleIntersection(line: Line, rectangle: Rectangle): boolean {
    if (rectangle.contains(line.startPos) || rectangle.contains(line.endPos)) {
        return true;
    }
    
    return false;
}

function getIntersectionTestFunctionFor(shape1: string, shape2: string): (a: any, b: any) => boolean {
    const shapeNames = new Set<string>([shape1, shape2]);

    if (shapeNames.has('circle') && shapeNames.has('line')) {
        return testLineCircleIntersection;
    }
}

function testIntersection(shape1: Shape, shape2: Shape): boolean{
    return getIntersectionTestFunctionFor(shape1.name, shape2.name)(shape1, shape2);
}

export {
    testLineCircleIntersection,
    testIntersection
};