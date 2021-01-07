import { Container, Graphics } from "pixi.js";
import { colors } from '../../constants';
import { Circle, Line } from '../../physics/collision';
import Vec2 from "../../math/vec2";

class Ball extends Container {

    readonly radius: number;
    private _velocity: Vec2;
    private _acceleration: Vec2;
    readonly hitbox: Circle;
    private _currentCollidingLine: Line;
    private _colliding: boolean;

    constructor(radius: number) {
        super();
        this.radius = radius;
        this._velocity = new Vec2(-6*Math.random() + 3, 0);
        this._acceleration = new Vec2(0, 0.25);
        this._createGraphics();
        this.hitbox = new Circle(this.x, this.y, radius);
        this.hitbox.group = 'ball';
        this.hitbox.onCollide = ({ collidedShape }) => {
            this._colliding = true;
            if (collidedShape.group == 'lose') {
                this.onLose();
                return;
            } else if (this._currentCollidingLine == collidedShape) {
                return;
            } else if (collidedShape instanceof Line) {
                const normal = collidedShape.getNormal();
                this.reflect(normal);

                const group = collidedShape.group;
                if (group == 'bar') {
                    this.setVelocityLength(Math.max(Vec2.norm(this._velocity), 15));
                }

                this._currentCollidingLine = collidedShape;
            }
        }
    }

    private _createGraphics() {
        const circle = new Graphics();
        circle.beginFill(colors.primary);
        circle.drawCircle(0, 0, this.radius);
        // circle.drawRect(0, 0, this.radius, this.radius);
        circle.endFill();
        this.addChild(circle);
    }

    update() {
        if (this._colliding) {
            this._colliding = false;
        } else {
            this._currentCollidingLine = null;
        }
        this._velocity = Vec2.add(this._velocity, this._acceleration);
        [this.x, this.y] = Vec2.add(Vec2.fromTuple([this.x, this.y]), this._velocity).toTuple();
        this.hitbox.move(this.x, this.y);
    }

    reflect(normal: Vec2, bouncyness: number = 1) {
        const newVel = Vec2.scale(
            bouncyness,
            Vec2.sub(
                this._velocity,
                Vec2.scale(2*Vec2.dot(this._velocity, normal), normal)
            )
        );
        this._velocity = newVel;
        // this._velocity = Vec2.scale(1.0,
        //     Vec2.sub(
        //         this._velocity,
        //         Vec2.scale(2*Vec2.dot(this._velocity, normal), normal)
        //     )
        // );
        // const pos = new Vec2(this.x, this.y);
        // Vec2.add(pos, Vec2.scale(this.radius, normal));
    }

    setVelocityLength(length: number) {
        this._velocity = Vec2.scale(
            length,
            Vec2.normalize(this._velocity)
        );
    }

    onLose() {

    }
}

export default Ball;