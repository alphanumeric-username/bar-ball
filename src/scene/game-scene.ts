import { Scene } from './scene';
import GameOverScene from './game-over-scene';
import { screenResolution } from '../app';
import Ball from './game-scene/ball';
import Bar from './game-scene/bar';
import ScoreDisplay from './game-scene/score-display';
import { Line, Circle, ShapeSpace } from '../physics/collision';
import { Container } from 'pixi.js';

class GameScene extends Scene {
    
    private _running: boolean;
    private _bar: Bar;
    private _ball: Ball;
    private _scoreDisplay: ScoreDisplay;
    private _shapeSpace: ShapeSpace;

    private _leftBound: Line;
    private _topBound: Line;
    private _rightBound: Line;
    private _bottomBound: Line;

    initStage() {
        this._shapeSpace = new ShapeSpace();
        
        this._leftBound = new Line(0, screenResolution.height, 0, 0);
        this._topBound = new Line(0, 0, screenResolution.width, 0);
        this._rightBound = new Line(screenResolution.width, 0, screenResolution.width, screenResolution.height);
        this._bottomBound = new Line(screenResolution.width, screenResolution.height, 0, screenResolution.height);
        this._bottomBound.group = 'lose';
        
        this._bar = new Bar();
        this._bar.y = screenResolution.height - this._bar.height - 10;
        this._bar.onCollideBall = () => {
            this._scoreDisplay.add();
            this.centerX(this._scoreDisplay);
        }

        this._ball = new Ball(16);
        this._ball.x = (screenResolution.width - this._ball.x)/2
        this._ball.y = (screenResolution.height - this._ball.y)/2
        this._ball.onLose = () => {
            this.sceneManager.changeScene(GameOverScene, { score: this._scoreDisplay.getScore(), previousScene: GameScene });
        }

        this._scoreDisplay = new ScoreDisplay();
        this._scoreDisplay.x = (screenResolution.width - this._scoreDisplay.width)/2
        this._scoreDisplay.y = (screenResolution.height)/6

        this._shapeSpace.add(this._bar.hitbox);
        this._shapeSpace.add(this._ball.hitbox);
        this._shapeSpace.add(this._leftBound);
        this._shapeSpace.add(this._topBound);
        this._shapeSpace.add(this._rightBound);
        this._shapeSpace.add(this._bottomBound);

        this.stage.addChild(this._scoreDisplay, this._bar, this._ball);
    }

    afterInitStage() {
        this._running = true;
        this.update();
    }

    update() {
        if (this._running) {
            this._bar.update();
            this._ball.update();
            this._shapeSpace.update();

            requestAnimationFrame(() => this.update());
        }
    }

    centerX(obj: Container) {
        obj.x = (screenResolution.width - obj.width)/2;
    }
    centerY(obj: Container) {
        obj.y = (screenResolution.height - obj.height)/2;
    }
}

export default GameScene;