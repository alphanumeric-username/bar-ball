import Vec2 from '../../math/vec2';
import Mat2 from '../../math/mat2';
import { IShape } from './shape';
import { ObjectSet } from '../../object-set';
import { fpCmp } from '../../math/util';

function minkowiskDifferenceSupportFunction(shape1: IShape, shape2: IShape): (direction: Vec2) => Vec2 {
    return (direction: Vec2) => Vec2.sub(
        shape1.supportFunction(direction),
        shape2.supportFunction(Vec2.negate(direction)),
    );
}

function linearFuncMinimun(a: number, b: number, intervalStart: number = 0, intervalEnd: number = 1): number {
    return a >= 0 ? intervalStart : intervalEnd;
}

function quadFuncMinimun(a: number, b: number, c: number, intervalStart: number = 0, intervalEnd: number = 1): number {

    if (fpCmp(a, 0)) {
        return linearFuncMinimun(a, b, intervalStart, intervalEnd);
    }

    const f = (t: number) => a*t*t + b*t + c;
    const criticalPoint = -b / (2*a);

    const globalMinMax = f(criticalPoint);
    const startVal = f(intervalStart);
    const endVal = f(intervalEnd);

    if (criticalPoint >= intervalStart && criticalPoint <= intervalEnd) {
        const minimum = Math.min(startVal, endVal, globalMinMax);
        
        return fpCmp(startVal, minimum) ? intervalStart : 
               fpCmp(endVal, minimum) ? intervalEnd : criticalPoint;
    } else {
        const minimum = Math.min(startVal, endVal);
        
        return fpCmp(startVal, minimum) ? intervalStart : intervalEnd;
    }

}

function pointLineIntersectionTest(q: Vec2, p1: Vec2, p2: Vec2): boolean {
    const [tx, ty] = [(q.x - p1.x)/(p2.x - p1.x), (q.y - p1.y)/(p2.y - p1.y)];
    return fpCmp(tx, ty) && tx >= 0 && tx <= 1;
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

function nearestLinePointSet(p1: Vec2, p2: Vec2): [Vec2, ObjectSet<Vec2>] {

    const ax = (p2.x - p1.x)*(p2.x - p1.x);
    const bx = 2*p1.x*(p2.x - p1.x);
    const cx = (p1.x)*(p1.x);
    
    const ay = (p2.y - p1.y)*(p2.y - p1.y);
    const by = 2*p1.y*(p2.y - p1.y);
    const cy = (p1.y)*(p1.y);

    const tmin = quadFuncMinimun(ax + ay, bx + by, cx + cy);

    return [new Vec2(p1.x*(1 - tmin) + p2.x*(tmin), p1.y*(1 - tmin) + p2.y*(tmin)), new ObjectSet([p1, p2])];
}

function nearestTrianglePointSet(p1: Vec2, p2: Vec2, p3: Vec2): [Vec2, ObjectSet<Vec2>] {

    const origin = new Vec2(0, 0);

    if (pointTriangleIntersectionTest(origin, p1, p2, p3)) {
        return [origin, new ObjectSet([p1, p2, p3])];
    } else {
        const candidates = [
            nearestLinePointSet(p1, p2),
            nearestLinePointSet(p2, p3),
            nearestLinePointSet(p3, p1),
        ];
        let minimum = candidates[0];

        candidates.forEach(c => {
            if (Vec2.norm(c[0]) < Vec2.norm(minimum[0])) {
                minimum = c;
            }
        });

        return minimum;
    }
}


function findNearestPointSetOfUpTo4PointsConvexHull(convexHull:ObjectSet<Vec2>): [Vec2, ObjectSet<Vec2>] {
    const points: Vec2[] = [];
    convexHull.forEach(p => points.push(p));

    if (convexHull.size() == 1) {
        return [points[0], convexHull];
    } else if (convexHull.size() == 2) {
        return nearestLinePointSet(points[0], points[1]);
    } else if (convexHull.size() == 3) {
        return nearestTrianglePointSet(points[0], points[1], points[2]);
    } else if (convexHull.size() == 4) {
        const candidates = [
            findNearestPointSetOfUpTo4PointsConvexHull(new ObjectSet([points[0], points[1], points[2]])),
            findNearestPointSetOfUpTo4PointsConvexHull(new ObjectSet([points[0], points[1], points[3]])),
            findNearestPointSetOfUpTo4PointsConvexHull(new ObjectSet([points[0], points[2], points[3]])),
            findNearestPointSetOfUpTo4PointsConvexHull(new ObjectSet([points[1], points[2], points[3]])),
        ];

        let minimum = candidates[0];
        candidates.forEach(c => {
            if (Vec2.norm(c[0]) < Vec2.norm(minimum[0])) {
                minimum = c;
            }
        });

        return minimum;
    }
}

function minimumUpTo4PointsConvexHullContainingPoint(convexHull: ObjectSet<Vec2>, point: Vec2): ObjectSet<Vec2> {
    const points: Vec2[] = [];
    convexHull.forEach(p => points.push(p));
    if (convexHull.size() <= 2) {
        return convexHull;
    } else if (convexHull.size() == 3) {
        var nextSet = convexHull;
        if (pointLineIntersectionTest(point, points[0], points[1])) {
            nextSet = new ObjectSet<Vec2>([points[0], points[1]]);
        } else if (pointLineIntersectionTest(point, points[1], points[2])) {
            nextSet = new ObjectSet<Vec2>([points[1], points[2]]);
        } else if (pointLineIntersectionTest(point, points[2], points[0])) {
            nextSet = new ObjectSet<Vec2>([points[2], points[0]]);
        }

        if (nextSet == convexHull) {
            return convexHull;
        }
        return minimumUpTo4PointsConvexHullContainingPoint(nextSet, point);

    } else if (convexHull.size() == 4) {
        var nextSet: ObjectSet<Vec2> = convexHull;
        if (pointTriangleIntersectionTest(point, points[0], points[1], points[2])) {
            nextSet = new ObjectSet<Vec2>([points[0], points[1], points[2]]);
        } else if (pointTriangleIntersectionTest(point, points[0], points[1], points[3])) {
            nextSet = new ObjectSet<Vec2>([points[0], points[1], points[3]]);
        } else if (pointTriangleIntersectionTest(point, points[0], points[2], points[3])) {
            nextSet = new ObjectSet<Vec2>([points[0], points[2], points[3]]);
        } else if (pointTriangleIntersectionTest(point, points[1], points[2], points[3])) {
            nextSet = new ObjectSet<Vec2>([points[1], points[2], points[3]]);
        }

        if (nextSet == convexHull) {
            return convexHull;
        }
        return minimumUpTo4PointsConvexHullContainingPoint(nextSet, point);
    }
}

const MAX_ITERATIONS = 100;
//TODO: return nearest points
function gjk(shape1: IShape, shape2: IShape): [number] {

    const supportFunction = minkowiskDifferenceSupportFunction(shape1, shape2);
    const initialPoint = supportFunction(new Vec2(1, 0));
    let simplexPoints: ObjectSet<Vec2> = new ObjectSet([initialPoint]);
    
    let point = initialPoint;
    let iterations = MAX_ITERATIONS;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        const supportPoint = supportFunction(Vec2.negate(point));
        
        const pointDirection = Vec2.normalize(point);
        const negPointDirection = Vec2.negate(pointDirection);
        
        const pointDotNegDir = Vec2.dot(point, negPointDirection);
        const supportPointDotNegDir = Vec2.dot(supportPoint, negPointDirection);
        if (pointDotNegDir > supportPointDotNegDir || fpCmp(pointDotNegDir, supportPointDotNegDir) || Vec2.norm(point) == 0) {
            iterations = i + 1;
            break;
        }
        
        simplexPoints.add(supportPoint);
        [point, simplexPoints] = findNearestPointSetOfUpTo4PointsConvexHull(simplexPoints);
        // simplexPoints = minimumUpTo4PointsConvexHullContainingPoint(simplexPoints, point);
        // console.log(point, supportPoint, simplexPoints);
    }
    console.log('Finished in', iterations, 'iterations');
    return [Vec2.norm(point)];
}

export default gjk;