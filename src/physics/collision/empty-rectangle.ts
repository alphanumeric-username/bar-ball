import Mat2 from "../../math/mat2";
import Vec2 from "../../math/vec2";
import Line from "./line";
import { CollideEvent, IShape, IShapeSpace } from "./shape";

class EmptyRectangleSide extends Line {
    parentRectangle: EmptyRectangle
}

class EmptyRectangle implements IShape {
    group?: Set<string> = new Set();
    name: string = 'empty-rectangle';
    shapeSpace: IShapeSpace;

    sides: ReadonlyArray<EmptyRectangleSide>;
    position: Vec2;

    constructor(x: number, y: number, width: number, height: number, rotation: number) {
        this.position = new Vec2(x, y);
        const rotationMatrix = new Mat2(
            Math.cos(rotation), - Math.sin(rotation),
            Math.sin(rotation), Math.cos(rotation)
        );
        const widthVec = Mat2.transform(rotationMatrix, new Vec2(width, 0));
        const heightVec = Mat2.transform(rotationMatrix, new Vec2(0, height));
        
        const p1 = this.position;
        const p2 = Vec2.add(this.position, widthVec);
        const p3 = Vec2.add(this.position, heightVec);
        const p4 = Vec2.add(p2, heightVec);

        this.sides = [
            new EmptyRectangleSide(p1.x, p1.y, p3.x, p3.y),
            new EmptyRectangleSide(p2.x, p2.y, p1.x, p1.y),
            new EmptyRectangleSide(p4.x, p4.y, p3.x, p3.y),
            new EmptyRectangleSide(p3.x, p3.y, p4.x, p4.y),
        ];
    }

    move(x: number, y: number) {

    }

    onCollide(e: CollideEvent): void {
        
    }
}

export default EmptyRectangle