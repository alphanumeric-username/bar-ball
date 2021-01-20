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
    points: Vec2[];
    position: Vec2;
    readonly rotation: number;

    constructor(x: number, y: number, width: number, height: number, rotation: number) {
        this.position = new Vec2(x, y);
        this.rotation = rotation;
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
            new EmptyRectangleSide(p4.x, p4.y, p2.x, p2.y),
            new EmptyRectangleSide(p3.x, p3.y, p4.x, p4.y),
        ];

        this.points = [p1, p2, p4, p3];
    }

    move(x: number, y: number) {
        const dr = Vec2.sub(new Vec2(x, y), this.position);
        this.sides.forEach(s => {
            s.move(...Vec2.add(s.startPos, dr).toTuple(), ...Vec2.add(s.endPos, dr).toTuple());
        });
        for (let i = 0; i < this.points.length; i++) {
            const p = this.points[i];
            this.points[i] = Vec2.add(p, dr);
        }
        this.position = Vec2.add(this.position, dr);
    }

    onCollide(e: CollideEvent): void {
        
    }

    pointIsInside(x: number, y: number): boolean {
        const p = new Vec2(x, y);
        
        const rotationMatrix = new Mat2(
            Math.cos(-this.rotation), - Math.sin(-this.rotation),
            Math.sin(-this.rotation), Math.cos(-this.rotation)
        );

        const p_ = Mat2.transform(rotationMatrix, p);

        const points_ = this.points.map(q => Mat2.transform(rotationMatrix, q))

        return points_[0].x <= p_.x &&  p_.x <= points_[3].x
            && points_[0].y <= p_.y &&  p_.y <= points_[3].y;

    }
}

export default EmptyRectangle