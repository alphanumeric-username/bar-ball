import { Scene } from '../../../scene';
import GameScene from '../../../game-scene';
import EventImplementation from './event-implementation';
import Vec2 from '../../../../math/vec2';

class NoGravityEvent extends EventImplementation {
    protected currentScene: GameScene;

    private _lastAcceleration: Vec2;

    update(dt: number): void {
        super.update(dt);
        if (this.elapsedTime >= this.duration) {
            this.stop();
        }
    }
    start(scene: Scene, duration: number): void {
        super.start(scene, duration);
        console.log('NO_GRAVITY: start');
        this._lastAcceleration = this.currentScene.ball.acceleration;
        this.currentScene.ball.setVelocityLength(5);
        this.currentScene.ball.acceleration = new Vec2(0, 0);
        this.duration = duration;
        this.running = true;
    }
    
    protected stop() {
        this.currentScene.ball.acceleration = this._lastAcceleration;
        this.currentScene.ball.setVelocityLength(5);
        console.log('NO_GRAVITY: stop');
        super.stop();
    }
}

export default NoGravityEvent;