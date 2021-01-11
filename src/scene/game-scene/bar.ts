import { Container, Graphics } from "pixi.js";
import { colors } from '../../constants';
import { screenResolution } from '../../app';
import Mouse from '../../service/mouse';
import { Line } from '../../physics/collision';
import { clamp } from "../../math/util";

class Bar extends Container {

    readonly hitbox: Line;

    constructor() {
        super();
        this._createGraphics();
        this.hitbox = new Line(this.x + 128, this.y, this.x, this.y);
        this.hitbox.group.add('bar');
        this.hitbox.onCollide = ({ collidedShape }) => {
            if (collidedShape.group.has('ball')) {
                this.onCollideBall();
            }
        }
        
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
        this.hitbox.move(this.x + this.width, this.y, this.x, this.y);
    }

    onCollideBall() {

    }
}

export default Bar;