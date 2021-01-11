import { Scene } from "../../../scene";
import GameScene from "../../../game-scene";
import { BallState } from "../../../game-scene/ball";
import EventImplementation from "./event-implementation";
import { clamp } from "../../../../math/util";
import Vec2 from "../../../../math/vec2";
import { Container } from "pixi.js";
import { Triangle } from "../../../../ui/geometry";
import { colors } from "../../../../constants";


class RandomThrowEvent extends EventImplementation {

    protected currentScene: GameScene;
    private _state: 'stopped' | 'starting' | 'rotating' | 'throwing' = 'stopped';
    private _targetAngle: number = 0;
    private _currentAngle: number = 0;
    private _lastBallState: BallState;
    likeliness: number = 0.2;
    arrow: Container;

    startTime: number = 2;
    readonly rotationTime: number = 1.5;
    readonly throwingTime: number = 0.5;
    
    start(scene: Scene, duration: number) {
        console.log('THROW: start');
        super.start(scene, duration);
        this._createGraphics();
        this._state = 'starting';
        this._targetAngle = Math.random()*(2*Math.PI);
    }

    update(dt: number) {
        super.update(dt);
        switch(this._state) {
            case 'starting':
                if (this.elapsedTime >= this.startTime) {
                    if (this.currentScene.ball.currentCollidingLine != null) {
                        this.startTime += 0.5;
                        return;
                    }
                    this._lastBallState = this.currentScene.ball.getState([
                        'acceleration.dir',
                        'acceleration.length',
                        'velocity.length',
                    ]);
                    this.currentScene.ball.setState({
                        acceleration: {
                            dir: new Vec2(0, 0)
                        },
                        velocity: {
                            dir: new Vec2(0, 0)
                        }
                    });
                    this._state = 'rotating';
                    this.currentScene.ball.addChild(this.arrow);
                    this.elapsedTime = 0;
                }
                break;
            case 'rotating':
                this._currentAngle = clamp(this.elapsedTime/this.rotationTime, 0, 1)*(2*Math.PI + this._targetAngle);
                this._updateGraphics();
                if (this.elapsedTime >= this.rotationTime) {
                    this._state = 'throwing';
                    this.elapsedTime = 0;
                }
                break;
            case 'throwing':
                if(this.elapsedTime >= this.throwingTime) {
                    this._lastBallState.velocity.dir = new Vec2(
                        Math.cos(this._currentAngle),
                        Math.sin(this._currentAngle),
                    );
                    this.currentScene.ball.setState(this._lastBallState);
                    this.stop();
                }
                break;
        }
    }
    
    stop() {
        console.log('THROW: stop');
        super.stop();
        this.arrow.parent.removeChild(this.arrow);
        this.arrow = null;
        this._targetAngle = 0;
        this._state = 'stopped';
    }

    private _createGraphics() {
        this.arrow = new Triangle(0, 0, 8, 4, 0, 8, {
            fill: colors.primary
        });
        this.arrow.pivot.set(
            0,
            this.arrow.height/2
        );
    }

    private _updateGraphics() {
        this.arrow.rotation = this._currentAngle;
        this.arrow.position.set(
            (this.currentScene.ball.radius + 4)*Math.cos(this._currentAngle),
            (this.currentScene.ball.radius + 4)*Math.sin(this._currentAngle),
        );
    }
}

export default RandomThrowEvent;