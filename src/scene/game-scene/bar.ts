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
        this.hitbox.tags.add('bar');
        this.hitbox.tags.add('reflective');
        this.hitbox.onCollide = ({ collidedShape }) => {
            if (collidedShape.tags.has('ball')) {
                this.onCollideBall();
            }
        }
        this.hitbox.update = (dt) => {
            const [minX, maxX, x] = [0, screenResolution.width - this.width, Mouse.getX() - this.width/2];
            const newX = clamp(x, minX, maxX);
            this.hitbox.move(newX + this.width, this.hitbox.pivot.position.y, newX, this.hitbox.pivot.position.y);
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
        [this.x, this.y] = this.hitbox.endPos.toTuple();
    }

    onCollideBall() {

    }
}

export default Bar;