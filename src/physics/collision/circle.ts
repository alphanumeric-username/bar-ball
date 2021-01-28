import Vec2 from "../../math/vec2";
import { IShape, IShapeSpace, CollideEvent } from './shape';
import ShapeImplementation from './shape-implementation';

// class Circle implements IShape{
//     pos: Vec2;
//     r: number;
//     readonly name: string = 'circle';
//     group?: Set<string> = new Set()
//     shapeSpace: IShapeSpace = null;

//     constructor(x: number, y: number, r: number) {
//         this.move(x, y);
//         this.r = r;
//     }

//     move(x: number, y: number) {
//         this.pos = new Vec2(x, y);
//     }

//     resize(r: number) {
//         this.r = r;
//     }

//     onCollide(e: CollideEvent): void {

//     }
// }

class Circle extends ShapeImplementation {
    tags?: Set<string>;
    shapeSpace: IShapeSpace;

    radius: number;

    constructor(x: number, y: number, radius: number) {
        super();
        this.center.position = new Vec2(x, y);
        this.radius = radius;
    }

    supportFunction(direction: Vec2): Vec2 {
        const normalizedDirection = super.supportFunction(direction);
        return Vec2.add(this.center.position, Vec2.scale(this.radius, normalizedDirection));
    }
    update(): void {
        super.update();
    }
    onCollide(e: CollideEvent): void {
        
    }

}

export default Circle;