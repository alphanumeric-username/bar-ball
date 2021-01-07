import Vec2 from "../../math/vec2";
import { IShape, IShapeSpace, OnCollideEvent } from './shape';

class Circle implements IShape{
    pos: Vec2;
    r: number;
    readonly name: string = 'circle';
    group?: string;
    shapeSpace: IShapeSpace = null;

    constructor(x: number, y: number, r: number) {
        this.move(x, y);
        this.r = r;
    }

    move(x: number, y: number) {
        this.pos = new Vec2(x, y);
    }

    onCollide(e: OnCollideEvent): void {

    }
}

export default Circle;