import EventImplementation from './event-implementation';
import GameScene from '../../../game-scene';
import { Scene } from '../../../scene';
import { EmptyRectangle, IShape, Line } from '../../../../physics/collision';
import Vec2 from '../../../../math/vec2';
import { clamp, randomInt } from '../../../../math/util';
import { screenResolution } from '../../../../app';
import { Container, Graphics } from 'pixi.js';
import { colors } from '../../../../constants';
import { getEventConfig } from '../../../../config/event';

class RandomBarEvent extends EventImplementation {
    name: string = 'random-bar'
    likeliness: number = getEventConfig()['random-bar'].likeliness;
    currentScene: GameScene;

    barGraphics: Graphics;
    barShape: EmptyRectangle;

    readonly minWidth = getEventConfig()['random-bar'].bar['min-width'];
    readonly maxWidth = getEventConfig()['random-bar'].bar['max-width'];
    readonly height = getEventConfig()['random-bar'].bar.height;//32;

    state: 'stopped' | 'starting' | 'started' | 'stopping' = 'stopped'
    readonly startTime = getEventConfig()['random-bar']['start-time'];
    readonly stopTime = getEventConfig()['random-bar']['stop-time'];

    lastCollidedShape: IShape = null;

    start(scene: Scene, duration: number): void {
        console.log('RANDOM_BAR: start');
        super.start(scene, duration);
        this._createShape();
        this._createGraphics();
        this.state = 'starting';
        this.lastCollidedShape = null;
    }

    update(dt: number) {
        super.update(dt);
        switch(this.state) {
            case 'starting':
                this.barGraphics.alpha = clamp(this.elapsedTime / this.startTime, 0, 1);
                if (this.elapsedTime >= this.startTime && !this._isTouchingBall()) {
                    this._initShapeGroup();
                    this.state = 'started';
                    this.elapsedTime = 0;
                    break;
                }
                this.lastCollidedShape = null;
                break;
            case 'started':
                if (this.elapsedTime >= this.duration) {
                    this.state = 'stopping';
                    this.elapsedTime = 0;
                }
                break;
            case 'stopping':
                this.barGraphics.alpha = Math.max(1 - this.elapsedTime / this.stopTime, 0);
                if (this.elapsedTime >= this.stopTime) {
                    this.stop();
                }
                break;
        }
    }

    stop() {
        console.log('RANDOM_BAR: stop');
        super.stop();
        this.barShape.sides.forEach(s => s.shapeSpace.remove(s));
        this.barGraphics.parent.removeChild(this.barGraphics);
    }

    private _createShape() {
        const x = Math.random()*screenResolution.width;
        const y = Math.random()*screenResolution.height/2 + screenResolution.height/4;

        const width = Math.random()*(this.maxWidth - this.minWidth) + this.minWidth;

        const rotation = Math.random()*Math.PI/2 - Math.PI/4;

        this.barShape = new EmptyRectangle(
            x, y,
            width, this.height,
            rotation
        );
        // this.barShape.sides.forEach(s => s.group.add('reflective'));
        this.barShape.sides.forEach(s => {
            this.currentScene.shapeSpace.add(s);
            s.onCollide = ({ collidedShape }) => {
                this.lastCollidedShape = collidedShape;
            };
        });
    }
    
    private _initShapeGroup() {
        this.barShape.sides.forEach(s => s.group.add('reflective'));
    }

    private _isTouchingBall(): boolean {
        return this.lastCollidedShape != null && this.lastCollidedShape.group.has('ball') || this.barShape.pointIsInside(this.currentScene.ball.x, this.currentScene.ball.y);
    }

    private _createGraphics() {
        this.barGraphics = new Graphics();
        this.barGraphics.beginFill(colors.primary);
        this.barGraphics.moveTo(...this.barShape.points[0].toTuple());
        this.barShape.points.forEach(p => {
            this.barGraphics.lineTo(...p.toTuple());
        });
        this.barGraphics.endFill();
        this.currentScene.stage.addChild(this.barGraphics);
    }
}

export default RandomBarEvent;