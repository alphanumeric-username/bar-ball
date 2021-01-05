const quadEqDelta = (a:number, b: number, c: number) => b*b - 4*a*c;

function solveQuadEq(a:number, b: number, c: number): [number, number] | null {
    const delta = quadEqDelta(a, b, c);
    if (delta < 0) {
        return null;
    }

    return [
        (-b - Math.sqrt(delta)) / (2*a),
        (-b + Math.sqrt(delta)) / (2*a)
    ];
}

export {
    quadEqDelta,
    solveQuadEq
}