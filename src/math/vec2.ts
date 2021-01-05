class Vec2 {
    readonly x: number;
    readonly y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toTuple(): [number, number] {
        return [this.x, this.y];
    }

    static fromTuple(data: [number, number]): Vec2 {
        return new Vec2(data[0], data[1]);
    }

    static add(u: Vec2, v: Vec2): Vec2 {
        return new Vec2(u.x + v.x, u.y + v.y);
    }

    static negate(u: Vec2): Vec2 {
        return new Vec2(-u.x, -u.y);
    }

    static sub(u: Vec2, v: Vec2): Vec2 {
        return Vec2.add(u, Vec2.negate(v));
    }

    static dot(u: Vec2, v: Vec2): number {
        return u.x*v.x + u.y*v.y;
    }

    static norm(u: Vec2): number {
        return Math.sqrt(Vec2.dot(u, u));
    }

    static distance(u: Vec2, v: Vec2): number {
        return Vec2.norm(Vec2.sub(u, v));
    }

    static scale(k: number, u: Vec2): Vec2 {
        return new Vec2(u.x*k, u.y*k);
    }

    static normalize(u: Vec2): Vec2 {
        return Vec2.scale(1 / Vec2.norm(u), u);
    }

    static normal(u: Vec2): Vec2 {
        return Vec2.normalize(
            new Vec2(-u.y, u.x)
        );
    }

    static copy(u: Vec2): Vec2 {
        return new Vec2(u.x, u.y);
    }
}

export default Vec2;