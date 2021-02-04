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

class Ball extends Circle {

    readonly stage: Container;
    color: number = colors.primary;

    justReflected: boolean = false;

    constructor(radius: number) {
        super(0, 0, radius);
        
        this.tags.add('ball');
        this.pivot.velocity = new Vec2(-6*Math.random() + 3, 0);
        this.pivot.acceleration = new Vec2(0, 0.25);
        
        this.stage = new Container();
        this._createGraphics();
    }

    private _createGraphics() {
        const circle = new Graphics();
        circle.beginFill(this.color);
        circle.drawCircle(0, 0, this.radius);
        circle.endFill();
        this.stage.addChild(circle);
    }

    private _clearGraphics() {
        this.stage.removeChildren();
    }

    recreate(radius: number = this.radius, color: number = this.color) {

        this.radius = radius;
        this.color = color;

        const children = this.stage.children.slice(1);

        this._clearGraphics();
        this._createGraphics();

        children.forEach(c => this.stage.addChild(c));
    }

    update(dt: number) {
        if (this.justReflected) {
            this.justReflected = false;
        } else {
            super.update(dt);
        }
        [this.stage.x, this.stage.y] = this.pivot.position.toTuple();
    }

    reflect(normal: Vec2, bounciness: number = 1) {
        this.justReflected = true;
        const newVel = Vec2.scale(
            bounciness,
            Vec2.sub(
                this.pivot.velocity,
                Vec2.scale(2*Vec2.dot(this.pivot.velocity, normal), normal)
            )
        );
        this.pivot.velocity = newVel;
    }

    setVelocityLength(length: number) {
        this.pivot.velocity = Vec2.scale(
            length,
            Vec2.normalize(this.pivot.velocity)
        );
    }

    getVelocityLength(): number {
        return Vec2.norm(this.pivot.velocity);
    }

    onCollide({ collidedShape }: CollisionEvent) {
        super.onCollide({ collidedShape });
        const tags = collidedShape.tags;

        if (tags.has('lose')) {
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
        }
    }

    private _collidedWithBar(bar: Line) {
        const maxDeviation = 0.5;
        const currentVelocityLength = Vec2.norm(this.pivot.velocity);
        const currentPosition = this.pivot.position;
        const barOrigin = bar.getMiddlePoint();
        const barCurrentPosition = Vec2.sub(currentPosition, barOrigin);
        const barTangent = Vec2.normalize(Vec2.sub(bar.endPos, barOrigin));
        const deviation = maxDeviation * Vec2.dot(Vec2.normalize(barCurrentPosition), barTangent);
        
        const newVelocity = Vec2.add(
            bar.getNormal(),
            Vec2.scale(deviation, barTangent)
        );

        this.pivot.velocity = newVelocity;

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
                    state.acceleration.dir = Vec2.normalize(this.pivot.acceleration);
                    break;
                case 'acceleration.length':
                    state.acceleration.length = Vec2.norm(this.pivot.acceleration);
                    break;
                case 'velocity.dir':
                    state.velocity.dir = Vec2.normalize(this.pivot.velocity);
                    break;
                case 'velocity.length':
                    state.velocity.length = Vec2.norm(this.pivot.velocity);
                    break;
                case 'position':
                    state.position = new Vec2(this.pivot.position.x, this.pivot.position.y);
            }
        }
        return state;
    }

    setState(state: BallState) {
        if (state.acceleration) {
            var newAccelerationDir = Vec2.normalize(this.pivot.acceleration);
            var newAccelerationLength = Vec2.norm(this.pivot.acceleration);

            if (state.acceleration.dir != null && state.acceleration.dir != undefined) {
                newAccelerationDir = state.acceleration.dir;
            }
            if (state.acceleration.length != null && state.acceleration.length != undefined) {
                newAccelerationLength = state.acceleration.length;
            }

            this.pivot.acceleration = Vec2.scale(
                newAccelerationLength,
                newAccelerationDir
            );
        }
        if (state.velocity) {
            var newVelocityDir = Vec2.normalize(this.pivot.velocity);
            var newVelocityLength = Vec2.norm(this.pivot.velocity);

            if (state.velocity.dir != null && state.velocity.dir != undefined) {
                newVelocityDir = state.velocity.dir;
            }
            if (state.velocity.length != null && state.velocity.length != undefined) {
                newVelocityLength = state.velocity.length;
            }

            this.pivot.velocity = Vec2.scale(
                newVelocityLength,
                newVelocityDir
            );
        }
        if (state.position != null && state.position != undefined) {
            this.pivot.position = state.position;
        }
    }

    onLose() {

    }
}

export default Ball;

export {
    BallState
}