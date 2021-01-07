import Vec2 from '../../math/vec2'
import { IShape, IShapeSpace, CollideEvent } from './shape';

class Line implements IShape {
    startPos: Vec2;
    endPos: Vec2;
    private _normal: Vec2;
    readonly name: string = 'line';
    group?: string;
    shapeSpace: IShapeSpace = null;

    constructor(x_start: number, y_start: number, x_end: number, y_end: number) {
        this.move(x_start, y_start, x_end, y_end);
    }

    getNormal(): Vec2 {
        return this._normal;
    }

    getEquation(): (x: number, y: number) => number {
        var a: number;
        var b: number;
        var c: number;
        if (this.startPos.x == this.endPos.x) {
            a = -1;
            b = (this.endPos.x - this.startPos.x) / (this.endPos.y - this.startPos.y);
            c = this.startPos.x - b*this.startPos.y;
        } else {
            a = (this.endPos.y - this.startPos.y) / (this.endPos.x - this.startPos.x);
            b = -1;
            c = this.startPos.y - a*this.startPos.x;
        }
        return (x: number, y: number) => a*x + b*y + c;
    }

    getMiddlePoint(): Vec2 {
        return new Vec2(
            (this.startPos.x + this.endPos.x)/2,
            (this.startPos.y + this.endPos.y)/2
        );
    }

    move(x_start: number, y_start: number, x_end: number, y_end: number) {
        this.startPos = new Vec2(x_start, y_start);
        this.endPos = new Vec2(x_end, y_end);

        const tangent = Vec2.sub(this.endPos, this.startPos);
        this._normal = Vec2.normal(tangent);
    }

    onCollide(e: CollideEvent): void {

    }
}

export default Line;