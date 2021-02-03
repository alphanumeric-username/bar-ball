import { Scene } from "../../../scene";
import { BallState } from "../../../game-scene/ball";
import GameScene from "../../../game-scene";
import EventImplementation from "./event-implementation";
import Vec2 from "../../../../math/vec2";
import { randomElement } from "../../../../math/util";
import { Line } from "../../../../physics/collision";
import { Container } from "pixi.js";
import { Triangle } from "../../../../ui/geometry";
import { colors } from "../../../../constants";
import { getEventConfig } from "../../../../config/event";


class WindEvent extends EventImplementation {
    currentScene: GameScene;
    likeliness: number = getEventConfig().wind.likeliness;
    name: string = 'wind';

    windDirection: Vec2;
    windForce: number;

    bouncyBar: Line;
    lastBallState: BallState;

    windDirectionIndicator: Container;

    constructor() {
        super();
        this.mutex.add('no-gravity');
        this.mutex.add('random-throw');
    }

    start(scene: Scene, duration: number): void {
        console.log('WIND: start');
        super.start(scene, duration);
        const direction: -1 | 1 = randomElement([-1, 1]);
        this.windDirection = new Vec2(direction, 0);
        if (direction == 1) {
            this.bouncyBar = this.currentScene.leftBound;
        } else {
            this.bouncyBar = this.currentScene.rightBound;
        }
        this.bouncyBar.tags.add('bouncy');
        this.lastBallState = this.currentScene.ball.getState([
            "acceleration.dir",
            "acceleration.length",
        ]);
        this._createGraphics(direction);
        this.windForce = 0.25;
        this.currentScene.ball.hitbox.pivot.acceleration = Vec2.scale(this.windForce, Vec2.add(
            this.lastBallState.acceleration.dir,
            this.windDirection
        ));
        // this.bouncyBar.bounciness = 1.1;
    }

    update(dt: number) {
        super.update(dt);
        if (this.elapsedTime >= this.duration) {
            this.stop();
        }
    }

    stop() {
        console.log('WIND: stop');
        this.currentScene.ball.setState(this.lastBallState);
        this.lastBallState = null;
        super.stop();
        this.bouncyBar.tags.delete('bouncy');
        this.bouncyBar = null;
        this.windDirectionIndicator.parent.removeChild(this.windDirectionIndicator);
    }

    private _createGraphics(dir: -1 | 1) {
        this.windDirectionIndicator = new Triangle(0, 0, dir*64, 32, 0, 64, {
            fill: colors.secondary_dark
        });
        this.windDirectionIndicator.zIndex = 0;
        this.currentScene.stage.addChildAt(this.windDirectionIndicator, 0);
        this.currentScene.centerX(this.windDirectionIndicator);
        this.currentScene.centerY(this.windDirectionIndicator);
    }

}

export default WindEvent;