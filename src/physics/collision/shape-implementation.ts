import Vec2 from "../../math/vec2";
import { CollideEvent, IShape, IShapeSpace } from "./shape";

abstract class ShapeImplementation implements IShape {
    center: { position: Vec2; velocity: Vec2; acceleration: Vec2; };
    tags?: Set<string>;
    shapeSpace: IShapeSpace;

    constructor() {
        this.center = {
            position: new Vec2(0, 0),
            velocity: new Vec2(0, 0),
            acceleration: new Vec2(0, 0)
        }
    }

    supportFunction(direction: Vec2): Vec2 {
        return Vec2.normalize(Vec2.sub(direction, this.center.position));
    }
    update(): void {
        this.center.position = Vec2.add(this.center.position, this.center.velocity);
        this.center.velocity = Vec2.add(this.center.velocity, this.center.acceleration);
    }
    abstract onCollide(e: CollideEvent): void;
}

export default ShapeImplementation;