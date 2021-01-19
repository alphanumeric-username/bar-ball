const pressedKeys = new Map<string, boolean>();

function isKeyPressed(key: string): boolean {
    return pressedKeys.get(key) || false;
}

window.addEventListener('keydown', (e) => {
    pressedKeys.set(e.key, true);
});

window.addEventListener('keyup', (e) => {
    pressedKeys.set(e.key, false);
})

export {
    isKeyPressed
};
