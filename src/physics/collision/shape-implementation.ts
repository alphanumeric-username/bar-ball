import Vec2 from "../../math/vec2";
import { CollisionEvent, IShape, IShapeSpace } from "./shape";

abstract class ShapeImplementation implements IShape {
    pivot: { position: Vec2; velocity: Vec2; acceleration: Vec2; };
    tags: Set<string>;
    shapeSpace: IShapeSpace;

    constructor() {
        this.pivot = {
            position: new Vec2(0, 0),
            velocity: new Vec2(0, 0),
            acceleration: new Vec2(0, 0)
        }
        this.tags = new Set<string>();
    }

    supportFunction(direction: Vec2): Vec2 {
        return Vec2.normalize(direction);
    }
    update(dt: number): void {
        const dPosition = Vec2.scale(dt, this.pivot.velocity);
        this.pivot.position = Vec2.add(this.pivot.position, dPosition);
        const dVelocity = Vec2.scale(dt, this.pivot.acceleration);
        this.pivot.velocity = Vec2.add(this.pivot.velocity, dVelocity);
    }

    onCollide(e: CollisionEvent): void {
        
    }

    onAddToSpace() {
        
    }

    onRemoveFromSpace() {
        
    }
}

export default ShapeImplementation;