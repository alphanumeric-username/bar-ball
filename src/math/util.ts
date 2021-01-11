function clamp(t: number, min: number, max: number): number {
    return t > max ? max:
           t < min ? min:
           t;
}

function between(t: number, min: number, max: number): boolean {
    return clamp(t, min, max) == t;
}

function randomInt(start: number, end: number) {
    const range = end - start;
    return start + Math.floor(Math.random()*range);
}

function randomElement<T>(set: T[]): T {
    return set[randomInt(0, set.length)];
}

export {
    clamp,
    randomInt,
    randomElement,
    between
};