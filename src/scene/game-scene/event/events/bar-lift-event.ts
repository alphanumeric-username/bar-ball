import { getConfig } from "../../../../config/event";
import { clamp } from "../../../../math/util";
import GameScene from "../../../game-scene";
import { Scene } from "../../../scene";
import EventImplementation from "./event-implementation";

class BarLiftEvent extends EventImplementation {
    name: string = 'bar-lift';
    likeliness = getConfig()["bar-lift"].likeliness;

    currentScene: GameScene;

    readonly liftAmount = getConfig()["bar-lift"]["lift-amount"];
    readonly delay = getConfig()["bar-lift"].delay;
    readonly transitionTime = getConfig()["bar-lift"]["transition-time"];

    lastY: number;
    targetY: number;

    state: 'stopped' | 'delay' | 'starting' | 'started' | 'stopping' = 'stopped';
    
    start(scene: Scene, duration: number) {
        super.start(scene, duration);
        this.lastY = this.currentScene.bar.y;
        this.targetY = this.currentScene.bar.y - this.liftAmount;
        this.state = 'delay';
    }

    update(dt: number) {
        super.update(dt);

        var t: number;
        switch (this.state) {
            case 'delay':
                if (this.elapsedTime >= this.delay) {
                    this.state = 'starting';
                    this.elapsedTime = 0;
                }
                break;
            case 'starting':
                t = clamp(this.elapsedTime / this.transitionTime, 0, 1);
                this.currentScene.bar.y = (1 - t)*this.lastY + t*this.targetY;
                if (this.elapsedTime >= this.transitionTime) {
                    this.state = 'started';
                    this.elapsedTime = 0;
                }
                break;
            case 'started':
                if (this.elapsedTime >= this.duration) {
                    this.state = 'stopping'
                    this.elapsedTime = 0;
                }
                break;
            case 'stopping':
                t = clamp(this.elapsedTime / this.transitionTime, 0, 1);
                this.currentScene.bar.y = (1 - t)*this.targetY + t*this.lastY;
                if (this.elapsedTime >= this.transitionTime) {
                    this.stop();
                    this.state = 'stopped';
                }
                break;
        }
    }

    stop() {
        super.stop();
    }
}

export default BarLiftEvent;