import { Scene } from '../../../scene';
import GameScene from '../../../game-scene';
import EventImplementation from './event-implementation';
import Vec2 from '../../../../math/vec2';
import { BallState } from '../../ball';
import { colors } from '../../../../constants';
import { getConfig } from '../../../../config/event';

class NoGravityEvent extends EventImplementation {
    likeliness: number = getConfig()['no-gravity'].likeliness;
    name: string = 'no-gravity';
    protected currentScene: GameScene;
    private _lastBallState: BallState;

    constructor() {
        super();
        this.mutex.add('random-throw');
        this.mutex.add('wind');
    }

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
        this.currentScene.ball.recreate(this.currentScene.ball.radius, colors.primary_cold);
    }
    
    stop() {
        this.currentScene.ball.setState(this._lastBallState);
        this.currentScene.ball.recreate(this.currentScene.ball.radius, colors.primary);
        console.log('NO_GRAVITY: stop');
        super.stop();
    }
}

export default NoGravityEvent;