import { Scene } from '../../../scene';
import GameScene from '../../../game-scene';
import EventImplementation from './event-implementation';
import Vec2 from '../../../../math/vec2';
import { BallState } from '../../ball';

class NoGravityEvent extends EventImplementation {
    protected currentScene: GameScene;
    likeliness: number = 0;//.025;
    private _lastBallState: BallState;

    update(dt: number): void {
        super.update(dt);
        if (this.elapsedTime >= this.duration) {
            this.stop();
        }
    }
    start(scene: Scene, duration: number): void {
        super.start(scene, duration);
        console.log('NO_GRAVITY: start');
        this._lastBallState = this.currentScene.ball.getState([
            'acceleration.dir',
            'acceleration.length',
            'velocity.length'
        ]);
        this._lastBallState.velocity.length = 5;
        this.currentScene.ball.setState({
            acceleration: {
                dir: new Vec2(0, 0)
            },
            velocity: {
                length: 5
            }
        });
        this.duration = duration;
        this.running = true;
    }
    
    protected stop() {
        this.currentScene.ball.setState(this._lastBallState);
        console.log('NO_GRAVITY: stop');
        super.stop();
    }
}

export default NoGravityEvent;