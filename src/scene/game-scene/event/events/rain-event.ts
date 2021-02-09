import EventImplementation from './event-implementation';
import { getEventConfig } from '../../../../config/event';
import GameScene from '../../../game-scene';
import { Scene } from '../../../scene';
import Vec2 from '../../../../math/vec2';
import { Container, Graphics } from 'pixi.js';
import { Rectangle } from '../../../../physics/collision';
import { colors } from '../../../../constants';
import { screenResolution } from '../../../../app';

class RainDrop extends Container {
    hitbox: Rectangle;
    
    readonly dropWidth: number = 8;
    readonly dropHeight: number = 64;

    constructor(acceleration: Vec2) {
        super();
        this.hitbox = new Rectangle(0, 0, this.dropWidth, this.dropHeight, 0);
        this.hitbox.sides.forEach(s => s.tags.add('reflective'));
        this.hitbox.pivot.acceleration = acceleration;
        this.createGraphics();
    }

    update() {
        [this.x, this.y] = this.hitbox.pivot.position.toTuple();
    }
    
    createGraphics() {
        const drop = new Graphics();
        drop.beginFill(colors.primary_cold)
        drop.drawRect(this.hitbox.pivot.position.x, this.hitbox.pivot.position.y, this.dropWidth, this.dropHeight);
        drop.endFill();

        this.addChild(drop);
    }

}

class RainEvent extends EventImplementation {
    name: string = 'rain';
    likeliness: number = getEventConfig().rain.likeliness;
    currentScene: GameScene;

    gravity: Vec2 = new Vec2(0, 0.25);

    raindrops: RainDrop[];
    readonly dropGenerationPeriod: number = getEventConfig().rain['drop-generation-period'];
    dropGenerationTimeCounter: number = 0;

    state: 'stopped' | 'stopping' | 'raining' = 'stopped';

    start(scene: Scene, duration: number) {
        console.log('RAIN: start');
        super.start(scene, duration);
        this.state = 'raining';
        this.raindrops = [];
    }
    
    update(dt: number) {
        super.update(dt);
        
        const nextRaindrops: RainDrop[] = [];
        this.raindrops.forEach(r => {
            if (r.y < screenResolution.height) {
                r.update()
                nextRaindrops.push(r);
            } else {
                this.removeRainDrop(r);
            }
        });
        this.raindrops = nextRaindrops;

        switch (this.state) {
            case 'raining':
                this.dropGenerationTimeCounter += dt;
                if (this.dropGenerationTimeCounter >= this.dropGenerationPeriod) {
                    this.dropGenerationTimeCounter = 0;
                    this.generateDrop();
                }
                if (this.elapsedTime >= this.duration) {
                    this.state = 'stopping';
                }
                break;
            case 'stopping':
                var stillHasDrops = false;
                this.raindrops.forEach(r => {
                    stillHasDrops = stillHasDrops || (r.y <= screenResolution.height);
                });
                if (!stillHasDrops) {
                    this.stop();
                    this.state = 'stopped';
                }
                break;
        }
    }
    
    stop() {
        console.log('RAIN: stop');
        super.stop();
        this.raindrops.forEach(r => {
            this.removeRainDrop(r);
        });
    }

    generateDrop() {
        const x = Math.random()*screenResolution.width - 8;
        const y = -64;

        const raindrop = new RainDrop(this.gravity);
        raindrop.hitbox.move(x, y);

        this.currentScene.stage.addChild(raindrop);
        this.currentScene.shapeSpace.add(raindrop.hitbox);
        this.raindrops.push(raindrop);
    }

    removeRainDrop(r: RainDrop) {
        r.parent.removeChild(r);
        r.hitbox.shapeSpace.remove(r.hitbox);
    }
}

export default RainEvent;