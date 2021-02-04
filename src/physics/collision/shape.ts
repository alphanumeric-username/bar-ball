import Vec2 from "../../math/vec2";

type CollisionEvent = {
    collidedShape: IShape
}

type Particle = {
    position: Vec2;
    velocity: Vec2;
    acceleration: Vec2;
}

interface IShape {

    pivot: Particle;
    tags?: Set<string>;
    shapeSpace: IShapeSpace;
    collidingShapes: Set<IShape>;
    
    supportFunction(direction: Vec2): Vec2;
    update(dt: number): void;
    onCollide(e: CollisionEvent): void;
    onAddToSpace(): void;
    onRemoveFromSpace(): void;
}

interface IShapeSpace {
    readonly shapes: Array<IShape>;
    add(s: IShape): void;
    remove(s: IShape): void;
    update(): void;
}

export { IShape, IShapeSpace , CollisionEvent };