import { IShape, IShapeSpace } from './shape';
import gjk from './gjk';
import Vec2 from '../../math/vec2';
import { fpCmp } from '../../math/util';

class ShapeSpace implements IShapeSpace {
    readonly shapes: Array<IShape> = [];
    add(s: IShape) {
        s.shapeSpace = this;
        this.shapes.push(s);
        s.onAddToSpace();
    }

    remove(s: IShape) {
        s.collidingShapes.forEach(shape => {
            shape.collidingShapes.delete(s);
        });
        s.collidingShapes.clear();
        const idx = this.shapes.indexOf(s);
        if (idx > 0) {
            this._removeFromArray(idx);
            s.shapeSpace = null;
        }
        s.onRemoveFromSpace();
    }

    private _removeFromArray(idx: number) {
        for (let i = idx; i < this.shapes.length - 1; i++) {
            this.shapes[i] = this.shapes[i + 1];
        }
        this.shapes.pop();
    }

    update(dt: number = 1, updateAgain = true) {
        const lastDt = dt;
        for (let i = 0; i < this.shapes.length; i++) {
            for (let j = i + 1; j < this.shapes.length; j++) {
                const [distance, direction] = gjk(this.shapes[i], this.shapes[j]);
                
                const velocity = Vec2.scale(lastDt, Vec2.sub(
                    this.shapes[i].pivot.velocity,
                    this.shapes[j].pivot.velocity,
                ));
                const velocityDotDirection = Vec2.dot(velocity, direction);
                
                if (fpCmp(distance, 0) || velocityDotDirection >= distance) {
                    this._collideShapes(this.shapes[i], this.shapes[j]);
                    continue;
                }
                // else if (velocityDotDirection >= distance) {
                //     if (updateAgain) {
                //         dt = Math.min(dt, distance / velocityDotDirection);
                //     } else {
                //         this._collideShapes(this.shapes[i], this.shapes[j]);
                //         continue;
                //     }
                //     // if (this.shapes[i].tags.has("ball") && this.shapes[j].tags.has("lose"))
                //     //     console.log(dt, distance, velocityDotDirection)
                // }
                this.shapes[i].collidingShapes.delete(this.shapes[j]);
                this.shapes[j].collidingShapes.delete(this.shapes[i]);
            }
        }

        this.shapes.forEach(shape => {
            // shape.update(dt, !updateAgain && dt < 1);
            shape.update(dt, true);
        });

        // if (dt < lastDt && updateAgain) {
        //     this.update(lastDt - dt, false);
        // }
    }

    private _collideShapes(shape1: IShape, shape2: IShape) {
        if (!shape1.collidingShapes.has(shape2)) {
            shape1.onCollide({ collidedShape: shape2 });
            shape2.onCollide({ collidedShape: shape1 });
        }
    }
}

export default ShapeSpace;