import { between } from "../../math/util";
import Vec2 from "../../math/vec2";
import { IShape, IShapeSpace, CollideEvent } from "./shape";


class Rectangle implements IShape {
    readonly pos: Vec2;
    readonly size: Vec2;
    readonly name: string = 'rectangle';
    group?: string;
    shapeSpace: IShapeSpace = null;

    constructor(x: number, y: number, w: number, h: number) {
        this.pos = new Vec2(x, y);
        this.size = new Vec2(w, h);
    }

    getPoints(): [Vec2, Vec2, Vec2, Vec2] {
        return [
            Vec2.copy(this.pos),
            Vec2.add(this.pos, new Vec2(this.size.x, 0)),
            Vec2.add(this.pos, new Vec2(0, this.size.y)),
            Vec2.add(this.pos, new Vec2(this.size.x, this.size.y)),
        ];
    }

    getCenter(): Vec2 {
        return Vec2.add(this.pos, Vec2.scale(0.5, this.size));
    }

    contains(p: Vec2): boolean {
        return between(p.x, this.pos.x, this.pos.x + this.size.x) && 
               between(p.y, this.pos.y, this.pos.y + this.size.y);
    }

    onCollide(e: CollideEvent): void {

    }
}

export default Rectangle;