import EventImplementation from './event-implementation';
import GameScene from '../../../game-scene';
import { Scene } from '../../../scene';
import { screenResolution } from '../../../../app';
import { Graphics } from 'pixi.js';
import { getEventConfig } from '../../../../config/event';
import { colors } from '../../../../constants';
import { clamp } from '../../../../math/util';

class CurtainEvent extends EventImplementation {
    name: string = 'curtain';
    likeliness: number = getEventConfig().curtain.likeliness;
    currentScene: GameScene;

    readonly width: number = screenResolution.width/2;
    readonly heigth: number = screenResolution.height;

    curtain: Graphics;
    readonly curtainAlpha = getEventConfig().curtain.curtain.alpha;

    state: 'stopped' | 'starting' | 'started' | 'stopping' = 'stopped';

    readonly startTime = 0.5;
    readonly stopTime = 1;
    
    start(scene: Scene, duration: number) {
        super.start(scene, duration);
        this._createGraphics();
        this.state = 'starting';
    }

    update(dt: number) {
        super.update(dt);
        var t;
        switch(this.state) {
            case 'starting':
                t = this.elapsedTime/this.startTime;
                this.curtain.height = clamp(t*this.heigth, 1, this.heigth);
                if (this.elapsedTime >= this.startTime) {
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
                t = this.elapsedTime / this.stopTime;
                this.curtain.alpha = clamp((1 - t)*this.curtainAlpha, 0, this.curtainAlpha);
                if (this.elapsedTime >= this.duration) {
                    this.stop();
                    this.state = 'stopped';
                }
                break;
        }
    }

    stop() {
        super.stop();
        this._clearGraphics();
    }

    private _createGraphics() {
        this.curtain = new Graphics();
        const x = Math.random()*(screenResolution.width - this.width);
        const y = 0;
        this.curtain.beginFill(colors.primary, this.curtainAlpha);
        this.curtain.drawRect(x, y, this.width, 1);
        this.curtain.endFill();

        this.currentScene.stage.addChild(this.curtain);
    }

    private _clearGraphics() {
        this.curtain.parent.removeChild(this.curtain);
    }

}

export default CurtainEvent;