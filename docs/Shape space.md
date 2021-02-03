# Shape space update method

Pseudocode for the ShapeSpace update method.

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
                shapes[i].onCollide(shapes[j]);
                shapes[j].onCollide(shapes[i]);
            } else if ((shapes[i].pivot.velocity - shapes[j].velocity) * direction > distance) {
                const p = distance / ((shapes[i].pivot.velocity - shapes[j].velocity)*direction);
                dt = Math.min(dt, p);
            }
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