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

function lineEquation(x0: number, y0: number, x1: number, y1: number): (x: number, y :number) => number {
    var a: number;
    var b: number;
    var c: number;

    if (x0 == x1 && y0 == y1) {
        return (x, y) => 0;
    }

    if (x0 == x1) {
        a = -1;
        b = 0;
        c = x0;
    } else {
        a = (y1 - y0) / (x1 - x0);
        b = -1;
        c = y0 - a*x0;
    }

    return (x, y) => a*x + b*y + c;
}

export {
    clamp,
    randomInt,
    randomElement,
    between,
    lineEquation
};