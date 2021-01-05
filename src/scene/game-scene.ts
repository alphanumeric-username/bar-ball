import { Scene } from './scene';
import { screenResolution } from '../app';
import Ball from './game-scene/ball';
import Bar from './game-scene/bar';
import { Line, Circle, ShapeSpace } from '../physics/shapes';

class GameScene extends Scene {
    
    private _running: boolean;
    private _bar: Bar;
    private _ball: Ball;
    private _shapeSpace: ShapeSpace;

    initStage() {
        this._shapeSpace = new ShapeSpace();

        this._bar = new Bar();
        this._bar.y = screenResolution.height - this._bar.height - 10;

        this._ball = new Ball(16);
        this._ball.x = (screenResolution.width - this._ball.x)/2
        this._ball.y = (screenResolution.height - this._ball.y)/2

        this.stage.addChild(this._bar, this._ball);
    }

    afterInitStage() {
        this._running = true;
        this.update();
    }

    update() {
        if (this._running) {
            this._bar.update();
            this._ball.update();
            requestAnimationFrame(() => this.update());
        }
    }
}

export default GameScene;