import { getEventConfig } from "../../../../config/event";
import { clamp } from "../../../../math/util";
import GameScene from "../../../game-scene";
import { Scene } from "../../../scene";
import EventImplementation from "./event-implementation";

class BarDiminishEvent extends EventImplementation {
    name: string = 'bar-diminish';
    likeliness = getEventConfig()["bar-diminish"].likeliness;
    currentScene: GameScene;

    readonly diminishFactor: number = getEventConfig()["bar-diminish"]["diminish-factor"];
    targetWidth: number;
    lastWidth: number;

    state: 'stopped' | 'starting' | 'started' | 'stopping';

    readonly transitionTime = getEventConfig()["bar-diminish"]["transition-time"];

    start(scene: Scene, duration: number) {
        super.start(scene, duration);
        this.targetWidth = this.currentScene.bar.width*this.diminishFactor;
        this.lastWidth = this.currentScene.bar.width;
        this.state = 'starting';
    }

    update(dt: number) {
        super.update(dt);
        var t: number;
        switch(this.state) {
            case 'starting':
                t = clamp(this.elapsedTime/this.transitionTime, 0, 1);
                this.currentScene.bar.width = (1 - t)*this.lastWidth + this.targetWidth*t;
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
                t = clamp(this.elapsedTime/this.transitionTime, 0, 1);
                this.currentScene.bar.width = (1 - t)*this.targetWidth + this.lastWidth*t;
                if (this.elapsedTime >= this.transitionTime) {
                    this.state = 'stopping';
                    this.stop();
                }
                break;
        }
    }

    stop() {
        super.stop();
        this.state = 'stopped';
    }
}

export default BarDiminishEvent;