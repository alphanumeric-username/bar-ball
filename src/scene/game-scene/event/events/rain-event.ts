import EventImplementation from './event-implementation';
import { getConfig } from '../../../../config/event';
import GameScene from '../../../game-scene';
import { Scene } from '../../../scene';
import Vec2 from '../../../../math/vec2';
import { Container } from 'pixi.js';
import { EmptyRectangle } from '../../../../physics/collision';

class RainDrop extends Container {
    hitbox: EmptyRectangle = new EmptyRectangle(0, 0, 8, 64, 0);;
    velocity: Vec2 = new Vec2(0, 0);
    acceleration: Vec2 = new Vec2(0, 0.25);

    constructor() {
        super();
    }

    update() {
        this.velocity = Vec2.add(this.velocity, this.acceleration);
        const position = new Vec2(this.x, this.y);
        [this.x, this.y] = Vec2.add(position, this.velocity).toTuple();
        
    }
    
    createGraphics() {

    }

}

class RainEvent extends EventImplementation {
    name: string = 'rain';
    likeliness: number = getConfig().rain.likeliness;
    currentScene: GameScene;

    gravity: Vec2 = new Vec2(0, 0.25);

    start(scene: Scene, duration: number) {
        super.start(scene, duration);

    }


}

export default RainEvent;