import Vec2 from "../../math/vec2";
import { Shape, ShapeSpace } from './shape';

class Circle implements Shape{
    pos: Vec2;
    r: number;
    readonly name: string = 'circle';
    shapeSpace: ShapeSpace = null;

    constructor(x: number, y: number, r: number) {
        this.move(x, y);
        this.r = r;
    }

    move(x: number, y: number) {
        this.pos = new Vec2(x, y);
    }
}

export default Circle;