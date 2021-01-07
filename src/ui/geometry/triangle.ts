import { Container, Graphics } from "pixi.js";

type TriangleOptions = {
    fill?: number
}

class Triangle extends Container {
    
    private _points: number[];
    private _fill: number;

    constructor(
        x1: number, y1: number,
        x2: number, y2: number,
        x3: number, y3: number,
        options: TriangleOptions
    ) {
        super();
        this._points = [x1, y1, x2, y2, x3, y3];
        this._fill = options.fill || 0xFFFFFF;
        this._createGraphics();
    }

    private _createGraphics() {
        const p = this._points;
        const triangle = new Graphics();
        triangle.beginFill(this._fill);
        triangle.moveTo(p[0], p[1]);
        triangle.lineTo(p[2], p[3]);
        triangle.lineTo(p[4], p[5]);
        triangle.lineTo(p[0], p[1]);
        triangle.endFill();

        this.addChild(triangle);
    }
}

export default Triangle;