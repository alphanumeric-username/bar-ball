import Vec2 from '../../math/vec2'
import { Shape, ShapeSpace } from './shape';

class Line implements Shape {
    startPos: Vec2;
    endPos: Vec2;
    private _normal: Vec2;
    readonly name: string = 'line';
    shapeSpace: ShapeSpace = null;

    constructor(x_start: number, y_start: number, x_end: number, y_end: number) {
        this.move(x_start, y_start, x_end, y_end);
    }

    getNormal(): Vec2 {
        return this._normal;
    }

    move(x_start: number, y_start: number, x_end: number, y_end: number) {
        this.startPos = new Vec2(x_start, y_start);
        this.endPos = new Vec2(x_end, y_end);

        const tangent = Vec2.sub(this.endPos, this.startPos);
        this._normal = Vec2.normal(tangent);
    }
}

export default Line;