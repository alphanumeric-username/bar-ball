import { IShape, IShapeSpace } from './shape';
import { testIntersection } from './intersection-test'

class ShapeSpace implements IShapeSpace {
    readonly shapes: Array<IShape> = [];
    add(s: IShape) {
        s.shapeSpace = this;
        this.shapes.push(s);
    }

    remove(s: IShape) {
        const idx = this.shapes.indexOf(s);
        if (idx > 0) {
            this._removeFromArray(idx);
            s.shapeSpace = null;
        }
    }

    private _removeFromArray(idx: number) {
        for (let i = idx; i < this.shapes.length - 1; i++) {
            this.shapes[i] = this.shapes[i + 1];
        }
        this.shapes.pop();
    }

    update() {
        for (let i = 0; i < this.shapes.length; i++) {
            for (let j = i; j < this.shapes.length; j++) {
                if (i == j) {
                    continue;
                }
                if (testIntersection(this.shapes[i], this.shapes[j])) {
                    this.shapes[i].onCollide({ collidedShape: this.shapes[j] });
                    this.shapes[j].onCollide({ collidedShape: this.shapes[i] });
                }
            }
        }
    }
}

export default ShapeSpace;