# Collision system

```js
scene.update() {
    collisionSpace.update() {
        for (i = 0...collisionSpace.length) {
            for (j = i...collisionSpace.length) {
                if (i == j) {
                    continue;
                }
                getTestIntersectionFunctionFor(collisionSpace[i].name, collisionSpace[j].name)(collisionSpace, collisionSpace);
            }
        }
    }
}
```