import { Container, Graphics } from "pixi.js";
import { colors } from '../../constants';
import { Circle, Line, CollideEvent } from '../../physics/collision';
import Vec2 from "../../math/vec2";
import { playNote } from '../../service/audio';

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
        this.hitbox.onCollide = (e) => {
            this._onCollide(e);
        }
    }

    private _createGraphics() {
        const circle = new Graphics();
        circle.beginFill(colors.primary);
        circle.drawCircle(0, 0, this.radius);
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

    reflect(normal: Vec2, bounciness: number = 1) {
        const newVel = Vec2.scale(
            bounciness,
            Vec2.sub(
                this._velocity,
                Vec2.scale(2*Vec2.dot(this._velocity, normal), normal)
            )
        );
        this._velocity = newVel;
    }

    setVelocityLength(length: number) {
        this._velocity = Vec2.scale(
            length,
            Vec2.normalize(this._velocity)
        );
    }

    private _onCollide({ collidedShape }: CollideEvent) {
        this._colliding = true;
        if (collidedShape.group == 'lose') {
            playNote('basic-wave', 440*Math.pow(2, -21/12), 0.1, { type: 'sawtooth' });
            this.onLose();
        } else if (this._currentCollidingLine == collidedShape) {
            return;
        } else if (collidedShape instanceof Line) {
            const normal = collidedShape.getNormal();
            this.reflect(normal);

            const group = collidedShape.group;
            if (group == 'bar') {
                this._collidedWithBar(collidedShape);
                playNote('basic-wave', 440*Math.pow(2, -2/12), 0.1, { type: 'sawtooth' });
            } else {
                playNote('basic-wave', 440*Math.pow(2, -9/12), 0.1, { type: 'sawtooth' });
            }

            this._currentCollidingLine = collidedShape;
        }
    }

    private _collidedWithBar(bar: Line) {
        const maxDeviation = 0.5;
        const currentVelocityLength = Vec2.norm(this._velocity);
        const currentPosition = new Vec2(this.x, this.y);
        const barOrigin = bar.getMiddlePoint();
        const barCurrentPosition = Vec2.sub(currentPosition, barOrigin);
        const barTangent = Vec2.normalize(Vec2.sub(bar.endPos, barOrigin));
        const deviation = maxDeviation * Vec2.dot(Vec2.normalize(barCurrentPosition), barTangent);
        
        const newVelocity = Vec2.add(
            bar.getNormal(),
            Vec2.scale(deviation, barTangent)
        );

        this._velocity = newVelocity;

        this.setVelocityLength(Math.max(currentVelocityLength, 15));
    }

    onLose() {

    }
}

export default Ball;