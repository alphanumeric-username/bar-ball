import { Scene, SceneClass } from './scene';
import GameOverScene from './game-over-scene';
import { screenResolution } from '../app';
import Ball from './game-scene/ball';
import Bar from './game-scene/bar';
import ScoreDisplay from './game-scene/score-display';
import PauseButton from './game-scene/pause-button';
import { Line, ShapeSpace } from '../physics/collision';
import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { IEventManager } from './game-scene/event/event-interface';
import { createEventManager } from './game-scene/event';
import { saveScore } from '../config/leaderboard';
import { colors } from '../constants';
import { clamp } from '../math/util';


class GameScene extends Scene {
    
    state: 'stopped' | 'running' | 'transition-out' | 'transition-in' | 'paused' | 'resuming';
    bar: Bar;
    ball: Ball;
    scoreDisplay: ScoreDisplay;
    shapeSpace: ShapeSpace;
    pauseButton: PauseButton;
    pauseMask: Graphics;
    resumeCountdown: Text;
    readonly resumeTime: number = 3;
    pauseKeyboardCallback: (e: KeyboardEvent) => void;
    
    eventManager: IEventManager;
    
    leftBound: Line;
    topBound: Line;
    rightBound: Line;
    bottomBound: Line;
    
    readonly transitionTime: number = 0.125;
    sceneToTransition: SceneClass;
    sceneToTransitionOptions: any;

    initStage() {
        this.eventManager = createEventManager(this);
        this.shapeSpace = new ShapeSpace();
        
        this.pauseKeyboardCallback = (e) => {
            if (e.key == ' ') {
                this.pauseButton.onClick();
            }
        }
        window.addEventListener('keyup', this.pauseKeyboardCallback);

        this._createBounds();
        this._createScoreDisplay();
        this._createBar();
        this._createBall();
        this._createPauseButton();
        this._createResumeCountdown();
        this._createPauseMask();
    }
    
    
    afterInitStage() {
        this.state = 'transition-in';
        this.stage.alpha = 0;
        this.update();
    }
    
    private _createBounds() {
        this.leftBound = new Line(0, screenResolution.height, 0, 0);
        this.topBound = new Line(0, 0, screenResolution.width, 0);
        this.rightBound = new Line(screenResolution.width, 0, screenResolution.width, screenResolution.height);
        this.bottomBound = new Line(screenResolution.width, screenResolution.height, 0, screenResolution.height);
        this.leftBound.group.add('reflective');
        this.topBound.group.add('reflective');
        this.rightBound.group.add('reflective');
        this.bottomBound.group.add('lose');
        
        this.shapeSpace.add(this.leftBound);
        this.shapeSpace.add(this.topBound);
        this.shapeSpace.add(this.rightBound);
        this.shapeSpace.add(this.bottomBound);
    }

    private _createBar() {
        this.bar = new Bar();
        this.bar.y = screenResolution.height - this.bar.height - 10;
        this.bar.onCollideBall = () => {
            this.scoreDisplay.add();
            this.eventManager.onScoreChange({ score: this.scoreDisplay.getScore() });
            this.centerX(this.scoreDisplay);
        }

        this.shapeSpace.add(this.bar.hitbox);
        this.stage.addChild(this.bar);
    }

    private _createBall() {
        this.ball = new Ball(16);
        this.ball.x = (screenResolution.width - this.ball.x)/2
        this.ball.y = (screenResolution.height - this.ball.y)/2
        this.ball.onLose = () => {
            this.eventManager.gameOver();
            this.cleanup();
            saveScore({ score: this.scoreDisplay.getScore() }).then(() => {
                this.sceneManager.changeScene(GameOverScene, { score: this.scoreDisplay.getScore(), previousScene: GameScene });
            });
        }

        // this.shapeSpace.add(this.ball.hitbox);
        this.shapeSpace.add(this.ball.velocityLine);
        this.stage.addChild(this.ball);
    }

    private _createScoreDisplay() {
        this.scoreDisplay = new ScoreDisplay();
        this.scoreDisplay.x = (screenResolution.width - this.scoreDisplay.width)/2;
        this.scoreDisplay.y = (screenResolution.height)/6;

        this.stage.addChild(this.scoreDisplay);
    }

    private _createPauseButton() {
        this.pauseButton = new PauseButton(32);
        this.pauseButton.onClick = () => {
            if (this.state == 'running') {
                this.pauseButton.pause();
                this.stage.addChild(this.pauseMask);
                this.state = 'paused';
            } else if (this.state == 'paused') {
                this.pauseButton.resume();
                this.elapsedTime = 0;
                this.state = 'resuming';
                this.centerObj(this.resumeCountdown);
                this.resumeCountdown.text = '3';
                this.stage.removeChild(this.pauseMask);
                this.stage.addChild(this.resumeCountdown);
            }
        };

        this.pauseButton.x = 16;
        this.pauseButton.y = 16;

        this.stage.addChild(this.pauseButton);
    }

    private _createResumeCountdown() {
        this.resumeCountdown = new Text('', new TextStyle({
            fontSize: 256,
            fontFamily: 'Roboto-Thin',
            fill: colors.primary,
        }));

        this.resumeCountdown.alpha = 0.8;
        this.centerObj(this.resumeCountdown);
    }

    private _createPauseMask() {
        this.pauseMask = new Graphics()
        .beginFill(colors.primary, 0.5)
        .drawRect(0, 0, screenResolution.width, screenResolution.height)
        .endFill();
    }

    update() {
        super.update();
        switch (this.state) {
            case 'transition-in':
                this.stage.alpha = clamp(this.elapsedTime/this.transitionTime, 0, 1);
                if (this.elapsedTime >= this.transitionTime) {
                    this.state = 'running';
                }
                requestAnimationFrame(() => this.update());
                break;
            case 'running':
                this.bar.update();
                this.ball.update();
                this.shapeSpace.update();
                this.eventManager.update(this.dt);
                requestAnimationFrame(() => this.update());
                break;
            case 'resuming':
                // console.log(Math.floor(3 - this.elapsedTime) + 1);
                this.resumeCountdown.text = clamp(Math.floor(3 - this.elapsedTime) + 1, 1, 3).toString();
                this.centerObj(this.resumeCountdown);
                if (this.elapsedTime >= this.resumeTime) {
                    this.stage.removeChild(this.resumeCountdown);
                    this.state = 'running';
                }
                requestAnimationFrame(() => this.update());
                break;
            case 'paused':
                requestAnimationFrame(() => this.update());
                break;
            case 'transition-out':
                this.stage.alpha = 1 - clamp(this.elapsedTime/this.transitionTime, 0, 1);
                if (this.elapsedTime >= this.transitionTime) {
                    this.state = 'stopped';
                    break;
                }
                requestAnimationFrame(() => this.update());
                break;
        }
    }

    centerX(obj: Container) {
        obj.x = (screenResolution.width - obj.width)/2;
    }
    centerY(obj: Container) {
        obj.y = (screenResolution.height - obj.height)/2;
    }

    cleanup() {
        this.state = 'stopped';
        window.removeEventListener('keydown', this.pauseKeyboardCallback);
    }

    centerObj(obj: Container) {
        this.centerX(obj);
        this.centerY(obj);
    }

    requestTransition(scene: SceneClass, options?: any) {
        this.sceneToTransition = scene;
        this.sceneToTransitionOptions = options;
        this.state = 'transition-out';
        this.elapsedTime = 0;
    }
}

export default GameScene;