import Button from '../ui/button';
import { Triangle } from '../ui/geometry';

import { Scene, SceneClass } from './scene';
import GameScene from './game-scene';
import LeaderboardScene from './leaderboard-scene';
import { screenResolution } from '../app';
import { Container, Graphics, Text, TextStyle, TilingSprite } from 'pixi.js';
import { colors } from '../constants';

import { initAudioService } from '../service/audio';
import { getScores } from '../config/leaderboard';
import { clamp } from '../math/util';
import Game from '../game/game';

class StartMenuScene extends Scene {

    state: 'running' | 'transition-out' | 'transition-in' | 'ready-to-transition';

    readonly transitionTime = 0.25;
    sceneToTransition: SceneClass = null;
    sceneToTransitionOptions: any = null;

    initStage() {
        
        const buttonsContainer = new Container();
        
        const k = 48;
        const triangle = new Triangle(0, 0, 0, k*1, k*Math.sqrt(3)/2, k*0.5, {
            fill: 0xFFFFFF
        });
        const startButton = new Button(triangle, null, { padding: 16, backgroundColor: colors.primary });
        startButton.onClick = () => {
            if (this.state == 'running') {
                initAudioService();
                this.requestTransition(GameScene, null);
            }
        };
        buttonsContainer.addChild(startButton);

        const leaderboard = new Graphics();
        leaderboard.beginFill(0xFFFFFF);
        leaderboard.drawRect(0, 16, 15, 32);
        leaderboard.drawRect(16, 0, 15, 48);
        leaderboard.drawRect(32, 32, 16, 16);
        leaderboard.endFill();

        const leaderboardButton = new Button(leaderboard, null, { padding: 16, backgroundColor: colors.primary });
        leaderboardButton.onClick = () => {
            if (this.state == 'running') {
                getScores().then(scores => {
                    this.requestTransition(LeaderboardScene, {
                        scores: scores
                    });
                });
            }
        }

        leaderboardButton.x = startButton.width + 16;

        buttonsContainer.addChild(leaderboardButton);
        
        buttonsContainer.position.set(
            (screenResolution.width - buttonsContainer.width)/2,
            2*screenResolution.height/3
        );
        
        const copyright = new Text('© 2021 alphanumeric-username', new TextStyle({
            fontFamily: 'Roboto-Regular',
            fill: colors.primary,
            fontSize: 20
        }));

        copyright.x = screenResolution.width - copyright.width - 4;
        copyright.y = screenResolution.height - copyright.height - 4;

        const title = new Text('Bar|Ball', new TextStyle({
            fontFamily: 'Roboto-Thin',
            fill: colors.primary,
            fontSize: 128
        }))
        title.x = (screenResolution.width - title.width)/2
        title.y = screenResolution.height/3

        this.stage.addChild(buttonsContainer, copyright, title);
    }

    afterInitStage() {
        this.stage.alpha = 0;
        this.state = 'transition-in';
        this.update();
    }

    update() {
        super.update();
        switch (this.state) {
            case 'transition-out':
                this.stage.alpha = 1 - clamp(this.elapsedTime/this.transitionTime, 0, 1);
                if (this.elapsedTime >= this.transitionTime) {
                    this.sceneManager.changeScene(this.sceneToTransition, this.sceneToTransitionOptions);
                    break;
                }
                requestAnimationFrame(() => this.update());
                break;
            case 'transition-in':
                this.stage.alpha = clamp(this.elapsedTime/this.transitionTime, 0, 1);
                if (this.elapsedTime >= this.transitionTime) {
                    this.state = 'running';
                }
                requestAnimationFrame(() => this.update());
                break;
            case 'running':
                requestAnimationFrame(() => this.update());
                break;
        }
    }

    requestTransition(scene: SceneClass, options?: any) {
        this.state = 'transition-out';
        this.sceneToTransition = scene;
        this.sceneToTransitionOptions = options;
        this.elapsedTime = 0;
    }
}

export default StartMenuScene;