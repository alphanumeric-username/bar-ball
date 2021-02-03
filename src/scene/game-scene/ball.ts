import { Container, Graphics } from "pixi.js";
import { colors } from '../../constants';
import { Circle, Line, CollisionEvent } from '../../physics/collision';
import Vec2 from "../../math/vec2";
import { playNote } from '../../service/audio';
import { randomElement } from "../../math/util";


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

    readonly hitbox: Circle;

    currentCollidingLine: Line;
    colliding: boolean;
    color: number = colors.primary;

    justReflected: boolean = false;

    constructor(radius: number) {
        super();
        this.hitbox = new Circle(this.x, this.y, radius);
        this.hitbox.tags.add('ball');
        this.hitbox.onCollide = (e) => {
            this._onCollide(e);
        }
        
        this.hitbox.pivot.velocity = new Vec2(-6*Math.random() + 3, 0);
        this.hitbox.pivot.acceleration = new Vec2(0, 0.25);
        this._createGraphics();
    }

    private _createGraphics() {
        const circle = new Graphics();
        circle.beginFill(this.color);
        circle.drawCircle(0, 0, this.hitbox.radius);
        circle.endFill();
        this.addChild(circle);
    }

    private _clearGraphics() {
        this.removeChildren();
    }

    recreate(radius: number = this.hitbox.radius, color: number = this.color) {

        this.hitbox.radius = radius;
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
        if (this.justReflected) {
            this.justReflected = false;
        }

        [this.x, this.y] = this.hitbox.pivot.position.toTuple();
    }

    reflect(normal: Vec2, bounciness: number = 1) {
        this.justReflected = true;
        const newVel = Vec2.scale(
            bounciness,
            Vec2.sub(
                this.hitbox.pivot.velocity,
                Vec2.scale(2*Vec2.dot(this.hitbox.pivot.velocity, normal), normal)
            )
        );
        this.hitbox.pivot.velocity = newVel;
    }

    setVelocityLength(length: number) {
        this.hitbox.pivot.velocity = Vec2.scale(
            length,
            Vec2.normalize(this.hitbox.pivot.velocity)
        );
    }

    getVelocityLength(): number {
        return Vec2.norm(this.hitbox.pivot.velocity);
    }

    private _onCollide({ collidedShape }: CollisionEvent) {
        this.colliding = true;
        const tags = collidedShape.tags;
        if (this.currentCollidingLine == collidedShape) {
            return;
        }
        else if (tags.has('lose')) {
            playNote('basic-wave', 440*Math.pow(2, -21/12), 0.1, { type: 'sawtooth' });
            this.onLose();
        }
        else if (collidedShape instanceof Line && tags.has('reflective')) {
            const normal = collidedShape.getNormal();
            this.reflect(normal);

            if (tags.has('bar')) {
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
        const currentVelocityLength = Vec2.norm(this.hitbox.pivot.velocity);
        const currentPosition = new Vec2(this.x, this.y);
        const barOrigin = bar.getMiddlePoint();
        const barCurrentPosition = Vec2.sub(currentPosition, barOrigin);
        const barTangent = Vec2.normalize(Vec2.sub(bar.endPos, barOrigin));
        const deviation = maxDeviation * Vec2.dot(Vec2.normalize(barCurrentPosition), barTangent);
        
        const newVelocity = Vec2.add(
            bar.getNormal(),
            Vec2.scale(deviation, barTangent)
        );

        this.hitbox.pivot.velocity = newVelocity;

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
                    state.acceleration.dir = Vec2.normalize(this.hitbox.pivot.acceleration);
                    break;
                case 'acceleration.length':
                    state.acceleration.length = Vec2.norm(this.hitbox.pivot.acceleration);
                    break;
                case 'velocity.dir':
                    state.velocity.dir = Vec2.normalize(this.hitbox.pivot.velocity);
                    break;
                case 'velocity.length':
                    state.velocity.length = Vec2.norm(this.hitbox.pivot.velocity);
                    break;
                case 'position':
                    state.position = new Vec2(this.x, this.y);
            }
        }
        return state;
    }

    setState(state: BallState) {
        if (state.acceleration) {
            var newAccelerationDir = Vec2.normalize(this.hitbox.pivot.acceleration);
            var newAccelerationLength = Vec2.norm(this.hitbox.pivot.acceleration);

            if (state.acceleration.dir != null && state.acceleration.dir != undefined) {
                newAccelerationDir = state.acceleration.dir;
            }
            if (state.acceleration.length != null && state.acceleration.length != undefined) {
                newAccelerationLength = state.acceleration.length;
            }

            this.hitbox.pivot.acceleration = Vec2.scale(
                newAccelerationLength,
                newAccelerationDir
            );
        }
        if (state.velocity) {
            var newVelocityDir = Vec2.normalize(this.hitbox.pivot.velocity);
            var newVelocityLength = Vec2.norm(this.hitbox.pivot.velocity);

            if (state.velocity.dir != null && state.velocity.dir != undefined) {
                newVelocityDir = state.velocity.dir;
            }
            if (state.velocity.length != null && state.velocity.length != undefined) {
                newVelocityLength = state.velocity.length;
            }

            this.hitbox.pivot.velocity = Vec2.scale(
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