import { getEventConfig } from "../../../../config/event";
import { clamp } from "../../../../math/util";
import GameScene from "../../../game-scene";
import { Scene } from "../../../scene";
import EventImplementation from "./event-implementation";

class BallDiminishEvent extends EventImplementation {
    name: string = 'ball-diminish';
    likeliness: number = getEventConfig()["ball-diminish"].likeliness;
    currentScene: GameScene;
    lastRadius: number;
    targetRadius: number;

    diminishFactor: number = getEventConfig()["bar-diminish"]["diminish-factor"];

    state: 'stopped' | 'starting' | 'started' | 'stopping' = 'stopped';

    readonly transitionTime = getEventConfig()["ball-diminish"]["transition-time"];

    start(scene: Scene, duration: number) {
        console.log('BALL_DIMINISH: start');
        super.start(scene, duration);
        this.lastRadius = this.currentScene.ball.hitbox.radius;
        this.state = 'starting';
        this.targetRadius = this.diminishFactor*this.lastRadius;
    }

    update(dt: number) {
        super.update(dt);
        var t = 0;
        switch(this.state) {
            case 'starting':
                t = clamp(this.elapsedTime / this.transitionTime, 0, 1);
                this.currentScene.ball.recreate(this.lastRadius*(1 - t) + this.targetRadius*t);
                if (this.elapsedTime >= this.transitionTime) {
                    this.state = 'started';
                    this.elapsedTime = 0;
                }
                break;
            case 'started':
                if (this.elapsedTime >= this.duration) {
                    this.state = 'stopping';
                    this.elapsedTime = 0;
                }
                break;
            case 'stopping':
                t = clamp(this.elapsedTime / this.transitionTime, 0, 1);
                this.currentScene.ball.recreate(this.targetRadius*(1 - t) + this.lastRadius*t);
                if (this.elapsedTime >= this.transitionTime) {
                    this.stop();
                    this.state = 'stopped';
                }
                break;
        }
    }

    stop() {
        console.log('BALL_DIMINISH: stop');
        super.stop();
    }
}

export default BallDiminishEvent;