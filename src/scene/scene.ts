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

    constructor(options: SceneOptions) {
        this.stage = new Container();
        this.sceneManager = options.sceneManager;
        this.beforeInitStage(options.args);
        this.initStage();
        this.afterInitStage();
    }

    beforeInitStage(args: any) {}
    initStage() {}
    afterInitStage() {}
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
        this._currentScene = nextScene;
        this.stage.removeChildren();
        this.stage.addChild(nextScene.stage);
    }
}

export { Scene, SceneManager, SceneOptions, SceneClass };