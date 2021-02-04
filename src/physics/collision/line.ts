import { clamp } from '../../math/util';
import Vec2 from '../../math/vec2'
import { IShapeSpace, CollisionEvent } from './shape';
import ShapeImplementation from './shape-implementation';

type LineEquation = { a: number, b: number, c: number } & ((x: number, y: number) => number);

class Line extends ShapeImplementation {
    endPos: Vec2;

    constructor(x_start: number, y_start: number, x_end: number, y_end: number) {
        super();
        this.move(x_start, y_start, x_end, y_end);
    }

    getNormal(): Vec2 {
        const tangent = Vec2.sub(this.endPos, this.pivot.position);
        return Vec2.normal(tangent);
    }

    getEquation(): LineEquation {
        var a: number;
        var b: number;
        var c: number;
        if (this.pivot.position.x == this.endPos.x) {
            a = -1;
            b = (this.endPos.x - this.pivot.position.x) / (this.endPos.y - this.pivot.position.y);
            c = this.pivot.position.x - b*this.pivot.position.y;
        } else {
            a = (this.endPos.y - this.pivot.position.y) / (this.endPos.x - this.pivot.position.x);
            b = -1;
            c = this.pivot.position.y - a*this.pivot.position.x;
        }
        return Object.assign(((x: number, y: number) => a*x + b*y + c), {a, b, c });
    }

    getEndPoints(): [Vec2, Vec2] {
        return [this.pivot.position, this.endPos];
    }

    getMiddlePoint(): Vec2 {
        return new Vec2(
            (this.pivot.position.x + this.endPos.x)/2,
            (this.pivot.position.y + this.endPos.y)/2
        );
    }

    move(x_start: number, y_start: number, x_end: number, y_end: number) {
        this.pivot.position = new Vec2(x_start, y_start);
        this.endPos = new Vec2(x_end, y_end);
    }

    supportFunction(direction: Vec2): Vec2 {
        const normalizedDirection = super.supportFunction(direction);

        const lineVector = Vec2.sub(this.endPos, this.pivot.position);

        const dirDotLine = Vec2.dot(normalizedDirection, lineVector);

        const localVector = Vec2.scale(clamp(dirDotLine, 0, Vec2.norm(lineVector)), Vec2.normalize(lineVector));

        return Vec2.add(localVector, this.pivot.position);
    }
}

export default Line;