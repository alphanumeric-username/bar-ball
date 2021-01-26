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

# Speculative constraint

formar uma caixa contendo a bola em sua posição atual e a bola na próxima posição

```
se a caixa interceptar uma linha,
    calcular a distância d da bola até a linha
    seja v a velocidade da bola e n a normal a linha
    se v.n >= -d / dt=1,
        colocar a velocidade da bola igual a -d/dt
        avançar tempo
        colocar a velocidade da bola igual a velocidade anterior v
        a velocidade da bola será refletida
````