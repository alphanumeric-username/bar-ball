import { Container, Graphics } from "pixi.js";
import { colors } from '../../constants';
import { screenResolution } from '../../app';
import Mouse from '../../service/mouse';
import { Line } from '../../physics/shapes';
import { clamp } from "../../math/util";

class Bar extends Container {

    hitbox: Line;

    constructor() {
        super();
        this._createGraphics();
        this.hitbox = new Line(0, 0, 128, 0);
    }

    private _createGraphics() {
        const rect = new Graphics();
        rect.beginFill(colors.primary);
        rect.drawRect(0, 0, 128, 32);
        rect.endFill();
        
        this.addChild(rect);
    }

    update() {
        const [minX, maxX, x] = [0, screenResolution.width - this.width, Mouse.getX() - this.width/2];
        this.x = clamp(x, minX, maxX);
        this.hitbox = this.shapeForCollisionTest();
    }

    shapeForCollisionTest(): Line {
        return new Line(this.x, this.y, this.x + this.width, this.y);
    }
}

export default Bar;