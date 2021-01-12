import { Scene } from './scene';
import GameOverScene from './game-over-scene';
import { screenResolution } from '../app';
import Ball from './game-scene/ball';
import Bar from './game-scene/bar';
import ScoreDisplay from './game-scene/score-display';
import { Line, Circle, ShapeSpace } from '../physics/collision';
import { Container } from 'pixi.js';
import { IEventManager } from './game-scene/event/event-interface';
import { createEventManager } from './game-scene/event';


class GameScene extends Scene {
    
    private _running: boolean;
    bar: Bar;
    ball: Ball;
    scoreDisplay: ScoreDisplay;
    shapeSpace: ShapeSpace;
    eventManager: IEventManager;

    leftBound: Line;
    topBound: Line;
    rightBound: Line;
    bottomBound: Line;

    initStage() {
        this.eventManager = createEventManager(this);
        this.shapeSpace = new ShapeSpace();
        
        this.leftBound = new Line(0, screenResolution.height, 0, 0);
        this.topBound = new Line(0, 0, screenResolution.width, 0);
        this.rightBound = new Line(screenResolution.width, 0, screenResolution.width, screenResolution.height);
        this.bottomBound = new Line(screenResolution.width, screenResolution.height, 0, screenResolution.height);
        this.leftBound.group.add('reflective');
        this.topBound.group.add('reflective');
        this.rightBound.group.add('reflective');
        this.bottomBound.group.add('lose');
        
        this.bar = new Bar();
        this.bar.y = screenResolution.height - this.bar.height - 10;
        this.bar.onCollideBall = () => {
            this.scoreDisplay.add();
            this.eventManager.onScoreChange({ score: this.scoreDisplay.getScore() });
            this.centerX(this.scoreDisplay);
        }

        this.ball = new Ball(16);
        this.ball.x = (screenResolution.width - this.ball.x)/2
        this.ball.y = (screenResolution.height - this.ball.y)/2
        this.ball.onLose = () => {
            this.sceneManager.changeScene(GameOverScene, { score: this.scoreDisplay.getScore(), previousScene: GameScene });
            this.eventManager.gameOver();
            this._running = false;
        }

        this.scoreDisplay = new ScoreDisplay();
        this.scoreDisplay.x = (screenResolution.width - this.scoreDisplay.width)/2
        this.scoreDisplay.y = (screenResolution.height)/6

        this.shapeSpace.add(this.bar.hitbox);
        this.shapeSpace.add(this.ball.hitbox);
        this.shapeSpace.add(this.leftBound);
        this.shapeSpace.add(this.topBound);
        this.shapeSpace.add(this.rightBound);
        this.shapeSpace.add(this.bottomBound);

        this.stage.addChild(this.scoreDisplay, this.bar, this.ball);
    }

    afterInitStage() {
        this._running = true;
        this.update();
    }

    update() {
        if (this._running) {
            this.bar.update();
            this.ball.update();
            this.shapeSpace.update();
            this.eventManager.update();

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