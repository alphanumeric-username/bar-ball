import { Application, Container } from 'pixi.js';

import { SceneClass, SceneManager } from '../scene/scene';
import StartMenuScene from '../scene/start-menu-scene';

type gameOptions = {
    app: Application
};

const firstSceneClass: SceneClass = StartMenuScene;

class Game {
    readonly app: Application;
    readonly sceneManager: SceneManager;

    constructor(options: gameOptions) {
        this.app = options.app;
        this.sceneManager = new SceneManager({
            firstScene: firstSceneClass,
            sceneArgs: null
        });
        this.app.stage.addChild(this.sceneManager.stage);
    }
}

export default Game;