import Vec2 from './vec2';

type SolutionSetDescription = 'zero' | 'one' | 'many';

function solve2x2Equation(a: number, b: number, c: number, d: number, e: number, f: number): [SolutionSetDescription, Vec2] {
    
    const row1 = [a, b, c];
    const row2 = [d, e, f];

    const k = - row1[0] / row2[0];

    for (let i = 0; i < row1.length; i++) {
        row2[i] += k*row1[i];
    }

    if (row2[1] == 0) {
        if (row2[2] != 0) {
            return ['zero', new Vec2(NaN, NaN)];
        } else {
            return ['many', new Vec2(NaN, NaN)];
        }
    }
    
    const y = row2[2] / row2[1];
    const x = (row1[2] - row2[1]*y)/row1[0];

    return ['one', new Vec2(x, y)];
}

export {
    solve2x2Equation
};