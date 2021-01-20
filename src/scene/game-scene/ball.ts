import { Container, Graphics } from "pixi.js";
import { colors } from '../../constants';
import { Circle, Line, CollideEvent } from '../../physics/collision';
import Vec2 from "../../math/vec2";
import { playNote } from '../../service/audio';
import { clamp, randomElement } from "../../math/util";
import { screenResolution } from "../../app";


type BallState = {
    acceleration?: {
        dir?: Vec2,
        length?: number
    },
    velocity?: {
        dir?: Vec2,
        length?: number
    },
    position?: Vec2
};

type BallStateFilter = 'acceleration.dir' | 'acceleration.length' | 'velocity.dir' | 'velocity.length' | 'position';

class Ball extends Container {

    radius: number;
    velocity: Vec2;
    acceleration: Vec2;
    readonly hitbox: Circle;
    readonly velocityLine: Line;

    currentCollidingLine: Line;
    colliding: boolean;
    color: number = colors.primary;

    constructor(radius: number) {
        super();
        this.radius = radius;
        this.velocity = new Vec2(-6*Math.random() + 3, 0);
        this.acceleration = new Vec2(0, 0.25);
        this._createGraphics();
        this.hitbox = new Circle(this.x, this.y, radius);
        this.hitbox.group.add('ball');
        this.hitbox.onCollide = (e) => {
            // this._onCollide(e);
        }

        this.velocityLine = new Line(this.x, this.y, this.x + this.velocity.x, this.y + this.velocity.y);
        this.velocityLine.group.add('ball-velocity');
        this.velocityLine.onCollide = (e) => {
            this._onCollide(e);
        }
    }

    private _createGraphics() {
        const circle = new Graphics();
        circle.beginFill(this.color);
        circle.drawCircle(0, 0, this.radius);
        circle.endFill();
        this.addChild(circle);
    }

    private _clearGraphics() {
        this.removeChildren();
    }

    recreate(radius: number = this.radius, color: number = this.color) {

        this.radius = radius;
        this.color = color;

        const children = this.children.slice(1);

        this._clearGraphics();
        this._createGraphics();

        children.forEach(c => this.addChild(c));
    }

    update() {
        if (this.colliding) {
            this.colliding = false;
        } else {
            this.currentCollidingLine = null;
        }
        [this.x, this.y] = Vec2.add(new Vec2(this.x, this.y), this.velocity).toTuple();
        this.velocity = Vec2.add(this.velocity, this.acceleration);
        this.velocityLine.move(this.x, this.y, this.x + this.velocity.x, this.y + this.velocity.y);
        this.hitbox.move(this.x, this.y);
        this.hitbox.resize(this.radius);
    }

    reflect(normal: Vec2, bounciness: number = 1) {
        const newVel = Vec2.scale(
            bounciness,
            Vec2.sub(
                this.velocity,
                Vec2.scale(2*Vec2.dot(this.velocity, normal), normal)
            )
        );
        this.velocity = newVel;
    }

    setVelocityLength(length: number) {
        this.velocity = Vec2.scale(
            length,
            Vec2.normalize(this.velocity)
        );
    }

    getVelocityLength(): number {
        return Vec2.norm(this.velocity);
    }

    private _onCollide({ collidedShape }: CollideEvent) {
        this.colliding = true;
        console.log(collidedShape);
        if (collidedShape.group.has('lose')) {
            playNote('basic-wave', 440*Math.pow(2, -21/12), 0.1, { type: 'sawtooth' });
            this.onLose();
        } else if (this.currentCollidingLine == collidedShape) {
            return;
        } else if (collidedShape instanceof Line && collidedShape.group.has('reflective')) {
            const normal = collidedShape.getNormal();
            this.reflect(normal);

            const group = collidedShape.group;
            if (group.has('bar')) {
                this._collidedWithBar(collidedShape);
                playNote('basic-wave', 440*Math.pow(2, randomElement([-2, 3])/12), 0.1, { type: 'sawtooth' });
            } else {
                playNote('basic-wave', 440*Math.pow(2, randomElement([-9, -5])/12), 0.1, { type: 'sawtooth' });
            }

            this.currentCollidingLine = collidedShape;
        }
    }

    private _collidedWithBar(bar: Line) {
        const maxDeviation = 0.5;
        const currentVelocityLength = Vec2.norm(this.velocity);
        const currentPosition = new Vec2(this.x, this.y);
        const barOrigin = bar.getMiddlePoint();
        const barCurrentPosition = Vec2.sub(currentPosition, barOrigin);
        const barTangent = Vec2.normalize(Vec2.sub(bar.endPos, barOrigin));
        const deviation = maxDeviation * Vec2.dot(Vec2.normalize(barCurrentPosition), barTangent);
        
        const newVelocity = Vec2.add(
            bar.getNormal(),
            Vec2.scale(deviation, barTangent)
        );

        this.velocity = newVelocity;

        this.setVelocityLength(Math.max(currentVelocityLength, 15));
    }

    getState(filter: BallStateFilter[] = ["acceleration.dir", "acceleration.length", "velocity.dir", "velocity.length", "position"]): BallState {
        const state: BallState = {
            acceleration: {
                dir: null,
                length: null,
            },
            velocity: {
                dir: null,
                length: null,
            },
            position: null
        };
        for (const f of filter) {
            switch(f) {
                case 'acceleration.dir':
                    state.acceleration.dir = Vec2.normalize(this.acceleration);
                    break;
                case 'acceleration.length':
                    state.acceleration.length = Vec2.norm(this.acceleration);
                    break;
                case 'velocity.dir':
                    state.velocity.dir = Vec2.normalize(this.velocity);
                    break;
                case 'velocity.length':
                    state.velocity.length = Vec2.norm(this.velocity);
                    break;
                case 'position':
                    state.position = new Vec2(this.x, this.y);
            }
        }
        return state;
    }

    setState(state: BallState) {
        if (state.acceleration) {
            var newAccelerationDir = Vec2.normalize(this.acceleration);
            var newAccelerationLength = Vec2.norm(this.acceleration);

            if (state.acceleration.dir != null && state.acceleration.dir != undefined) {
                newAccelerationDir = state.acceleration.dir;
            }
            if (state.acceleration.length != null && state.acceleration.length != undefined) {
                newAccelerationLength = state.acceleration.length;
            }

            this.acceleration = Vec2.scale(
                newAccelerationLength,
                newAccelerationDir
            );
        }
        if (state.velocity) {
            var newVelocityDir = Vec2.normalize(this.velocity);
            var newVelocityLength = Vec2.norm(this.velocity);

            if (state.velocity.dir != null && state.velocity.dir != undefined) {
                newVelocityDir = state.velocity.dir;
            }
            if (state.velocity.length != null && state.velocity.length != undefined) {
                newVelocityLength = state.velocity.length;
            }

            this.velocity = Vec2.scale(
                newVelocityLength,
                newVelocityDir
            );
        }
        if (state.position != null && state.position != undefined) {
            [this.x, this.y] = state.position.toTuple();
        }
    }

    onLose() {

    }
}

export default Ball;

export {
    BallState
}