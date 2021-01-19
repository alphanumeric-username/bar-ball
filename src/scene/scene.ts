import { Container } from "pixi.js";

type SceneOptions = {
    sceneManager: SceneManager,
    args: any
};

type SceneClass = {
    new(options: SceneOptions): Scene
};

type SceneManagerOptions = {
    firstScene: SceneClass,
    sceneArgs: any
}

abstract class Scene {
    readonly sceneManager: SceneManager;
    readonly stage: Container;
    private _lastTime: number;
    dt: number;
    elapsedTime: number = 0;

    constructor(options: SceneOptions) {
        this.stage = new Container();
        this.sceneManager = options.sceneManager;
        this.beforeInitStage(options.args);
        // this.initStage();
        // this.afterInitStage();
        this._lastTime =new Date().valueOf()/1000;
    }

    beforeInitStage(args: any) {}
    initStage() {}
    afterInitStage() {
    }

    update() {
        const t = new Date().valueOf()/1000;
        const t0 =this._lastTime;
        const dt = t - t0;

        this.elapsedTime += dt;
        this.dt = dt;
        this._lastTime = t;
    }
}

class SceneManager {
    private _currentScene: Scene
    readonly stage: Container;

    constructor(options: SceneManagerOptions) {
        this.stage = new Container();
        this.changeScene(options.firstScene, options.sceneArgs);
    }

    changeScene(sceneClass: SceneClass, options: any = null) {
        const nextScene: Scene = new sceneClass({
            args: options,
            sceneManager: this
        });
        nextScene.initStage();
        this._currentScene = nextScene;
        this.stage.removeChildren();
        this.stage.addChild(nextScene.stage);
        nextScene.afterInitStage();
    }
}

export { Scene, SceneManager, SceneOptions, SceneClass };