import Vec2 from "./vec2";

class Mat2 {
    readonly a: number;
    readonly b: number;
    readonly c: number;
    readonly d: number;
    
    constructor(a: number, b: number, c: number, d: number) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    toTuple(): [number, number, number, number] {
        return [this.a, this.b, this.c, this.d];
    }

    static multiply(A: Mat2, B: Mat2): Mat2 {
        return new Mat2(
            A.a*B.a + A.b*B.c, A.a*B.b + A.b*B.d,
            A.c*B.a + A.d*B.c, A.c*B.b + A.d*B.d,
        );
    }

    static transform(A: Mat2, u: Vec2): Vec2 {
        return new Vec2(
            A.a*u.x + A.b*u.y,
            A.c*u.x + A.d*u.y,
        );
    }
}

export default Mat2;