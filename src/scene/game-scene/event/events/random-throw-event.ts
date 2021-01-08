import { Scene } from "../../../scene";
import GameScene from "../../../game-scene";
import EventImplementation from "./event-implementation";
import { clamp } from "../../../../math/util";
import Vec2 from "../../../../math/vec2";
import { Container } from "pixi.js";
import { Triangle } from "../../../../ui/geometry";
import { colors } from "../../../../constants";

class RandomThrowEvent extends EventImplementation {

    protected currentScene: GameScene;
    private _state: 'stopped' | 'rotating' | 'throwing' = 'stopped';
    private _angleParameter: number = 0;
    private _targetAngle: number = 0;
    private _currentAngle: number = 0;
    private _lastVelocityLength: number;
    private _lastAcceleration: Vec2;
    arrow: Container;

    readonly rotationTime: number = 1;
    readonly throwingTime: number = 0.5;

    constructor() {
        super();
        this._createGraphics();
    }

    start(scene: Scene, duration: number) {
        super.start(scene, duration);
        this._state = 'rotating';
        this._targetAngle = Math.random()*(2*Math.PI);
        this._lastVelocityLength = this.currentScene.ball.getVelocityLength();
        this.currentScene.ball.setVelocityLength(0);
        this._lastAcceleration = this.currentScene.ball.acceleration;
        this.currentScene.ball.acceleration = new Vec2(0, 0);
    }

    update(dt: number) {
        super.update(dt);
        switch(this._state) {
            case 'rotating':
                this._currentAngle = clamp(this.elapsedTime/this.rotationTime, 0, 1)*(2*Math.PI + this._targetAngle);
                if (this.elapsedTime >= this.rotationTime) {
                    this._state = 'throwing';
                    this.elapsedTime = 0;
                }
                break;
            case 'throwing':
                if(this.elapsedTime >= this.throwingTime) {
                    this.currentScene.ball.setVelocityLength(this._lastVelocityLength);
                    this.currentScene.ball.acceleration = this._lastAcceleration;
                }
                break;
        }
    }
    
    stop() {
        super.stop();
        this._angleParameter = 0;
        this._targetAngle = 0;
        this._lastVelocityLength = 0;
        this._state = 'stopped';
    }

    private _createGraphics() {
        this.arrow = new Triangle(0, 0, 1, 0.5, 0, 1, {
            fill: colors.primary
        });
    }
}

export default RandomThrowEvent;