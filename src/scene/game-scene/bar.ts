import { Container, Graphics } from "pixi.js";
import { colors } from '../../constants';
import { screenResolution } from '../../app';
import Mouse from '../../service/mouse';
import { Line } from '../../physics/collision';
import { clamp } from "../../math/util";

class Bar extends Line {

    readonly stage: Container;
    width: number;
    height: number;


    constructor(y: number) {
        super(128, y, 0, y);
        this.width = 128;
        this.height = 16;

        this.stage = new Container();
        this._createGraphics();
        
        this.tags.add('bar');
        this.tags.add('reflective');
    }

    private _createGraphics() {
        const rect = new Graphics();
        rect.beginFill(colors.primary);
        rect.drawRect(0, 0, this.width, this.height);
        rect.endFill();
        
        this.stage.addChild(rect);
    }

    update(dt: number) {
        super.update(dt);
        const [minX, maxX, x] = [0, screenResolution.width - this.width, Mouse.getX() - this.width/2];
        const newX = clamp(x, minX, maxX);
        this.move(newX + this.width, this.pivot.position.y, newX, this.pivot.position.y);

        [this.stage.x, this.stage.y] = this.endPos.toTuple();
        this.stage.width = this.width;
    }

    onCollide = ({ collidedShape }) => {
        super.onCollide({ collidedShape });
        if (collidedShape.tags.has('ball')) {
            this.onCollideBall();
        }
    }

    onCollideBall() {

    }
}

export default Bar;