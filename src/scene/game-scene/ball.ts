import { Container, Graphics } from "pixi.js";
import { colors } from '../../constants';
import { Circle } from '../../physics/shapes';
import Vec2 from "../../math/vec2";

class Ball extends Container {

    readonly radius: number;
    private _velocity: Vec2;
    private _acceleration: Vec2;

    constructor(radius: number) {
        super();
        this.radius = radius;
        this._velocity = new Vec2(0, 0);
        this._acceleration = new Vec2(0, 0.5);
        this._createGraphics();
    }

    private _createGraphics() {
        const circle = new Graphics();
        // circle.drawCircle(screenResolution.width/2, screenResolution.height/2, this.radius);
        circle.beginFill(colors.primary);
        circle.drawRect(0, 0, this.radius, this.radius);
        circle.endFill();

        this.addChild(circle);
    }

    update() {
        this._velocity = Vec2.add(this._velocity, this._acceleration);
        [this.x, this.y] = Vec2.add(Vec2.fromTuple([this.x, this.y]), this._velocity).toTuple();
    }

    reflect(normal: Vec2) {
        this._velocity = Vec2.sub(
            this._velocity,
            Vec2.scale(2*Vec2.dot(this._velocity, normal), normal)
        );
    }

    shapeForCollisionTest(): Circle {
        return new Circle(this.x, this.y, this.radius);
    }
}

export default Ball;