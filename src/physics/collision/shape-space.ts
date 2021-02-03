import { IShape, IShapeSpace } from './shape';
import gjk from './gjk';
import Vec2 from '../../math/vec2';

class ShapeSpace implements IShapeSpace {
    readonly shapes: Array<IShape> = [];
    add(s: IShape) {
        s.shapeSpace = this;
        this.shapes.push(s);
        s.onAddToSpace();
    }

    remove(s: IShape) {
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

    update(dt: number = 1) {
        for (let i = 0; i < this.shapes.length; i++) {
            for (let j = i + 1; j < this.shapes.length; j++) {
                const [distance, direction] = gjk(this.shapes[i], this.shapes[j]);
                // console.log(this.shapes[i], this.shapes[j], distance, direction);
                if (distance == 0) {
                    this.shapes[i].onCollide({ collidedShape: this.shapes[j] });
                    this.shapes[j].onCollide({ collidedShape: this.shapes[i] });
                    continue;
                } 
                
                const velocity = Vec2.sub(
                    this.shapes[i].pivot.velocity,
                    this.shapes[j].pivot.velocity
                );
                const velocityDotDirection = Vec2.dot(velocity, direction);

                if (velocityDotDirection > distance) {
                    dt = Math.min(dt, distance / velocityDotDirection);
                }
            }
        }

        this.shapes.forEach(shape => {
            shape.update(dt);
        });

        // if (dt < 1) {
        //     this.update(1 - dt);
        // }
    }
}

export default ShapeSpace;