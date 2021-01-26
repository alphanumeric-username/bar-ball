import Vec2 from "../../math/vec2";

type OnCollideEvent = {
    collidedShape: IShape
}

interface IShape {

    position: Vec2;
    velocity: Vec2;
    // acceleration: Vec2;
    tags?: Set<string>;
    shapeSpace: IShapeSpace;
    
    supportFunction(direction: Vec2): Vec2;
    update(): void;
    onCollide(e: OnCollideEvent): void;
}

interface IShapeSpace {
    readonly shapes: Array<IShape>;
    add(s: IShape): void;
    remove(s: IShape): void;
    update(): void;
}

export { IShape, IShapeSpace , OnCollideEvent as CollideEvent};