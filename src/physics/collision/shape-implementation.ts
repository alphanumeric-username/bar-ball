import Vec2 from "../../math/vec2";
import { OnCollideEvent, IShape, IShapeSpace } from "./shape";

abstract class ShapeImplementation implements IShape {
    pivot: { position: Vec2; velocity: Vec2; acceleration: Vec2; };
    tags?: Set<string>;
    shapeSpace: IShapeSpace;

    constructor() {
        this.pivot = {
            position: new Vec2(0, 0),
            velocity: new Vec2(0, 0),
            acceleration: new Vec2(0, 0)
        }
    }

    supportFunction(direction: Vec2): Vec2 {
        return Vec2.normalize(direction);
        // return Vec2.normalize(Vec2.sub(direction, this.pivot.position));
    }
    update(): void {
        this.pivot.position = Vec2.add(this.pivot.position, this.pivot.velocity);
        this.pivot.velocity = Vec2.add(this.pivot.velocity, this.pivot.acceleration);
    }
    abstract onCollide(e: OnCollideEvent): void;
}

export default ShapeImplementation;