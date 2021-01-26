import Vec2 from '../../math/vec2';
import Mat2 from '../../math/mat2';
import { lineEquation } from '../../math/util';
import { IShape } from './shape';

function minkowiskDifferenceSupportFunction(shape1: IShape, shape2: IShape): (direction: Vec2) => Vec2 {
    return (direction: Vec2) => Vec2.sub(
        shape1.supportFunction(direction),
        shape2.supportFunction(Vec2.negate(direction)),
    );
}

function quadFuncMinimun(a: number, b: number, c: number, intervalStart: number = 0, intervalEnd: number = 1): number {

    const f = (t: number) => a*t*t + b*t + c;

    const criticalPoint = -b / (2*a);
    const startVal = f(intervalStart);
    const endVal = f(intervalEnd);

    if (criticalPoint >= intervalStart && criticalPoint <= intervalEnd) {
        return criticalPoint
    }

    const minimum = Math.min(startVal, endVal);
    
    return startVal == minimum ? intervalStart : intervalEnd;
}

function pointLineIntersectionTest(q: Vec2, p1: Vec2, p2: Vec2): boolean {
    const [tx, ty] = [(q.x - p1.x)/(p2.x - p1.x), (q.y - p1.y)/(p2.y - p1.y)];
    return tx == ty && tx >= 0 && tx <= 1;
}

function pointTriangleIntersectionTest(q: Vec2, p1: Vec2, p2: Vec2, p3: Vec2): boolean {
    const basis = [Vec2.sub(p2, p1), Vec2.sub(p3, p1)];
    const basisChangeMatrix = Mat2.scale (1/(basis[0].x*basis[1].y - basis[1].x*basis[0].y), new Mat2(
        basis[1].y, -basis[1].x,
        -basis[0].y, basis[0].x
    ));
    
    const q_ = Mat2.transform(basisChangeMatrix, Vec2.sub(q, p1));
    
    if (q_.x >= 0 && q_.y >=0 && Math.abs(q_.x) + Math.abs(q_.y) <= 1) {
        return true;
    }
    return false;
}

function nearestTrianglePoint(p1: Vec2, p2: Vec2, p3: Vec2) {
    const l1 = lineEquation(...p1.toTuple(), ...p2.toTuple());
    const l2 = lineEquation(...p2.toTuple(), ...p3.toTuple());
    const l3 = lineEquation(...p3.toTuple(), ...p1.toTuple());

    // if (origin is in triangle):
    //     return origin
    // else:
    //     return min(
    //         quadFuncMinimun(|p1(1 - t) + p2(t)|^2),
    //         quadFuncMinimun(|p2(1 - t) + p3(t)|^2),
    //         quadFuncMinimun(|p3(1 - t) + p1(t)|^2)
    //     )
}

function nearestLinePoint(p1:number, p2: number) {
    return quadFuncMinimun(/** Expand equation here */);
}

function findNearestPointOfUpTo4PointsConvexHull(convexHull:Set<Vec2>) {
    if (convexHull.size == 2) {
        return 
    }
}

//TODO: return nearest points
function gjk(shape1: IShape, shape2: IShape): [number] {

    const supportFunction = minkowiskDifferenceSupportFunction(shape1, shape2);
    const initialPoint = supportFunction(new Vec2(1, 0));
    var simplexPoints: Set<Vec2> = new Set([initialPoint]);

    for (let point = initialPoint;;) {
        const supportPoint = supportFunction(Vec2.negate(point));
        
        const pointDirection = Vec2.normalize(point);
        const negPointDirection = Vec2.negate(pointDirection);

        if (Vec2.dot(point, negPointDirection) >= Vec2.dot(supportPoint, negPointDirection)) {
            return [Vec2.norm(point)];
        }
        
        simplexPoints.add(supportPoint);
        
        // update simplex
    }
}

export default gjk;