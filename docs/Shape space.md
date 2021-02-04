# Shape space methods

Pseudocode for the ShapeSpace public methods.

```js
shapeSpace.add(shape) {
    shape.shapeSpace = this;
    this.shapes.push(shape);
    shape.onAddToSpace();
}

shapeSpace.remove(shape) {
    shape.shapeSpace = null;
    this.shapes.remove(shape);
    shape.onRemoveFromSpace();
}

shapeSpace.update() {
    let dt = 1;
    for (i = 0...shapes.length) {
        for (j = (i+1)...shapes.length) {
            const distance, direction = gjk(shapes[i], shapes[j]);
            if (distance == 0) {
                if (!shapes[i].collidingShapes.has(shapes[j])) {
                    shapes[i].onCollide(shapes[j]) {
                        shapes[i].collidingShapes.add(shapes[j]);
                        ...
                    };
                }
                shapes[j].onCollide(shapes[i]);
                continue;
            } else if ((shapes[i].pivot.velocity - shapes[j].velocity) * direction > distance) {
                const p = distance / ((shapes[i].pivot.velocity - shapes[j].velocity)*direction);
                dt = Math.min(dt, p);
            }
            shapes[i].collidingShapes.remove(shapes[j]);
            shapes[j].collidingShapes.remove(shapes[i]);
        }
    }
    for (i = 0...shapes.length) {
        shapes[i].update(dt) {
            shapes[i].pivot.position += shapes[i].pivot.velocity * dt;
            shapes[i].pivot.velocity += shapes[i].pivot.acceleration * dt;
        }
    }
}
```