function clamp(t: number, min: number, max: number): number {
    return t > max ? max:
           t < min ? min:
           t;
}

function between(t: number, min: number, max: number): boolean {
    return clamp(t, min, max) == t;
}

export {
    clamp,
    between
};