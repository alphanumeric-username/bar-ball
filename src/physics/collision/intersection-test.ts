import Vec2 from "../../math/vec2";
import { Line, Circle, Rectangle, EmptyRectangle } from "../collision";
import { solveQuadEquation } from "../../math/quad-eq";
import { solve2x2Equation } from "../../math/linear-eq";
import { between } from "../../math/util";
import { IShape } from "../collision";

function findLineLineIntersectionPoint(line1: Line, line2: Line): [boolean, Vec2] {
    const F = line1.getEquation();
    const G = line2.getEquation();

    const solution = solve2x2Equation(F.a, F.b, -F.c, G.a, G.b, -G.c)[1];

    return [isNaN(solution.x), solution];
}

function testLineCircleIntersection(shape1: IShape, shape2: IShape) {

    var line: Line;
    var circle: Circle;
    
    if (shape1 instanceof Line && shape2 instanceof Circle) {
        line = shape1 as Line;
        circle = shape2 as Circle;
    } else if (shape2 instanceof Line && shape1 instanceof Circle) {
        line = shape2 as Line;
        circle = shape1 as Circle;
    } else {
        throw 'Illegal parameters at "testLineCircleIntersection"';
    }

    const k = Vec2.distance(line.endPos, line.startPos);
    const D = Vec2.normalize(Vec2.sub(line.endPos, line.startPos));
    const C = Vec2.sub(circle.pos, line.startPos);
    
    const a = Vec2.dot(D, D)*k*k;
    const b = - 2*Vec2.dot(D, C)*k;
    const c = Vec2.dot(C, C) - circle.r*circle.r;

    const values: [number, number] | null = solveQuadEquation(a, b, c);
    if (values ==  null) {
        return false;
    }
    const [t1, t2] = values;
    return between(t1, 0, 1) || between(t2, 0, 1);
}

function testLineLineIntersection(shape1: IShape, shape2: IShape): boolean {
    const line1: Line = shape1 as Line;
    const line2: Line = shape2 as Line;
    
    const F = line1.getEquation();
    const G = line2.getEquation();

    const r3 = F(line2.startPos.x, line2.startPos.y);
    const r4 = F(line2.endPos.x, line2.endPos.y);
    
    if (r3 != 0 && r4 != 0 && Math.sign(r3) == Math.sign(r4)) {
        return false;
    }
    
    const r1 = G(line1.startPos.x, line1.startPos.y);
    const r2 = G(line1.endPos.x, line1.endPos.y);
    
    if (r1 != 0 && r2 != 0 && Math.sign(r1) == Math.sign(r2)) {
        return false;
    }

    return true;
}

function testCircleEmptyRectangleIntersection(shape1: IShape, shape2: IShape): boolean {
    var circle: Circle = shape1 instanceof Circle ? shape1 as Circle : shape2 as Circle;
    var rect: EmptyRectangle = shape1 instanceof EmptyRectangle ? shape1 as EmptyRectangle : shape2 as EmptyRectangle;

    for (const side of rect.sides) {
        if (testLineCircleIntersection(circle, side)) {
            return true;
        }
    }
    return false;
}

function getIntersectionTestFunctionFor(shape1: string, shape2: string): (a: any, b: any) => boolean {
    const shapeNames = new Set<string>([shape1, shape2]);

    if (shapeNames.has('circle') && shapeNames.has('line')) {
        return testLineCircleIntersection;
    }
    if (shapeNames.size == 1 && shapeNames.has('line')) {
        return testLineLineIntersection;
    }
    if (shapeNames.has('circle') && shapeNames.has('empty-rectangle')) {
        return testCircleEmptyRectangleIntersection;
    }
}

function testIntersection(shape1: IShape, shape2: IShape): boolean{
    return getIntersectionTestFunctionFor(shape1.name, shape2.name)(shape1, shape2);
}

export {
    findLineLineIntersectionPoint,
    testLineCircleIntersection,
    testIntersection
};