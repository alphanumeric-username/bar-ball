import Vec2 from "../../math/vec2";
import ShapeImplementation from './shape-implementation';

class Circle extends ShapeImplementation {
    radius: number;

    constructor(x: number, y: number, radius: number) {
        super();
        this.pivot.position = new Vec2(x, y);
        this.radius = radius;
    }

    supportFunction(direction: Vec2): Vec2 {
        const normalizedDirection = super.supportFunction(direction);
        return Vec2.add(this.pivot.position, Vec2.scale(this.radius, normalizedDirection));
    }

}

export default Circle;