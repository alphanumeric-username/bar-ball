interface Shape {
    readonly name: string;
}

class ShapeSpace {
    readonly shapes: Array<Shape> = [];
    add(s: Shape) {
        this.shapes.push(s);
    }

    remove(s: Shape) {
        const idx = this.shapes.indexOf(s);
        if (idx > 0) {
            this._removeFromArray(idx);
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
                
            }
            
        }
    }
}

export { Shape, ShapeSpace };