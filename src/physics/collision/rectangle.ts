import Mat2 from "../../math/mat2";
import { clamp } from "../../math/util";
import Vec2 from "../../math/vec2";
import { IShape } from "../collision/shape";
import Line from "./line";
import ShapeImplementation from "./shape-implementation";

class RectangleSide extends Line {
    parentRectangle: Rectangle;
    parentCollidingShapes: Set<IShape>;

    constructor(x_start: number, y_start: number, x_end: number, y_end: number, parent: Rectangle) {
        super(x_start, y_start, x_end, y_end);
        this.parentRectangle = parent;
        // this.collidingShapes = parent.collidingShapes;
    }
}

class Rectangle extends ShapeImplementation {
    sides: ReadonlyArray<RectangleSide>;
    points: Vec2[];

    readonly rotation: number;
    readonly widthVec: Vec2;
    readonly heightVec: Vec2;

    constructor(x: number, y: number, width: number, height: number, rotation: number) {
        super();
        this.pivot.position = new Vec2(x, y);
        this.rotation = rotation;
        const rotationMatrix = new Mat2(
            Math.cos(rotation), - Math.sin(rotation),
            Math.sin(rotation), Math.cos(rotation)
        );
        this.widthVec = Mat2.transform(rotationMatrix, new Vec2(width, 0));
        this.heightVec = Mat2.transform(rotationMatrix, new Vec2(0, height));
        
        const p1 = this.pivot.position;
        const p2 = Vec2.add(this.pivot.position, this.widthVec);
        const p3 = Vec2.add(this.pivot.position, this.heightVec);
        const p4 = Vec2.add(p2, this.heightVec);

        this.sides = [
            new RectangleSide(p1.x, p1.y, p3.x, p3.y, this),
            new RectangleSide(p2.x, p2.y, p1.x, p1.y, this),
            new RectangleSide(p4.x, p4.y, p2.x, p2.y, this),
            new RectangleSide(p3.x, p3.y, p4.x, p4.y, this),
        ];

        this.points = [p1, p2, p4, p3];
    }

    update(dt: number) {
        super.update(dt);
        this._updatePosition();
    }

    move(x: number, y: number) {
        const dr = Vec2.sub(new Vec2(x, y), this.pivot.position);
        this.sides.forEach(s => {
            s.move(...Vec2.add(s.pivot.position, dr).toTuple(), ...Vec2.add(s.endPos, dr).toTuple());
        });
        for (let i = 0; i < this.points.length; i++) {
            const p = this.points[i];
            this.points[i] = Vec2.add(p, dr);
        }
        this.pivot.position = Vec2.add(this.pivot.position, dr);
    }
    
    private _updatePosition() {
        const dr = Vec2.sub(this.pivot.position, this.sides[0].pivot.position);
        this.sides.forEach(s => {
            s.move(...Vec2.add(s.pivot.position, dr).toTuple(), ...Vec2.add(s.endPos, dr).toTuple());
        });
        for (let i = 0; i < this.points.length; i++) {
            const p = this.points[i];
            this.points[i] = Vec2.add(p, dr);
        }
    }

    onAddToSpace() {
        this.sides.forEach(s => this.shapeSpace.add(s));
    }

    onRemoveFromSpace() {
        this.sides.forEach(s => s.shapeSpace.remove(s));
    }

    pointIsInside(x: number, y: number): boolean {
        const p = new Vec2(x, y);
        
        const rotationMatrix = new Mat2(
            Math.cos(-this.rotation), - Math.sin(-this.rotation),
            Math.sin(-this.rotation), Math.cos(-this.rotation)
        );

        const p_ = Mat2.transform(rotationMatrix, p);

        const points_ = this.points.map(q => Mat2.transform(rotationMatrix, q));

        return points_[0].x <= p_.x &&  p_.x <= points_[3].x
            && points_[0].y <= p_.y &&  p_.y <= points_[3].y;
    }

    supportFunction(direction: Vec2): Vec2 {
        const normalizedDirection = super.supportFunction(direction);

        const diagonalLength = Vec2.norm(Vec2.add(this.widthVec, this.heightVec));
        const scaledDirection = Vec2.scale(diagonalLength, normalizedDirection);

        const normalizedWVec = Vec2.normalize(this.widthVec);
        const normalizedHVec = Vec2.normalize(this.heightVec);

        const wCoordinate = clamp(Vec2.dot(scaledDirection, normalizedWVec), 0, Vec2.norm(this.widthVec));
        const hCoordinate = clamp(Vec2.dot(scaledDirection, normalizedHVec), 0, Vec2.norm(this.heightVec));

        const supportVector = Vec2.add(
            Vec2.scale(wCoordinate, normalizedWVec),
            Vec2.scale(hCoordinate, normalizedHVec)
        );

        return Vec2.add (supportVector, this.pivot.position);
    }
}

export default Rectangle