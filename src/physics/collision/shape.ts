type OnCollideEvent = {
    collidedShape: IShape
}

interface IShape {
    group?: string;
    readonly name: string;
    shapeSpace: IShapeSpace;
    onCollide(e: OnCollideEvent): void;
}

interface IShapeSpace {
    readonly shapes: Array<IShape>;
    add(s: IShape): void;
    remove(s: IShape): void;
    update(): void;
}

export { IShape, IShapeSpace , OnCollideEvent};