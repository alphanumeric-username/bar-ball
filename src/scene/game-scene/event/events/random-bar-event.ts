import EventImplementation from './event-implementation';
import GameScene from '../../../game-scene';
import { Scene } from '../../../scene';
import { Line } from '../../../../physics/collision';
import Vec2 from '../../../../math/vec2';
import { randomInt } from '../../../../math/util';
import { screenResolution } from '../../../../app';

class RandomBarEvent extends EventImplementation {
    likeliness: number = 0.2;
    currentScene: GameScene;

    sides: Line[];

    start(scene: Scene, duration: number): void {
        super.start(scene, duration);
        this._createBar();
        this._createGraphics();
    }

    stop() {
        super.stop();
    }

    private _createBar() {
        
    }

    private _createGraphics() {
        const width = Math.random()*24;
        const height = 8;
        const p1 = new Vec2(
            randomInt(0, screenResolution.width),
            randomInt(0, screenResolution.height),
        );
        const angle = Math.random()*2*Math.PI;
        const length = Math.random()*24;
        const p2 = new Vec2(
            p1.x + length*Math.Math.cos()
        ) 

        this.sides = [

        ];
    }


}

export default RandomBarEvent;