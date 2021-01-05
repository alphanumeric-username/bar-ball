import Button from '../ui/button';

import { Scene } from './scene';
import GameScene from './game-scene';
import { screenResolution } from '../app';
import { Graphics, Text, TextStyle } from 'pixi.js';
import { colors } from '../constants';

class StartMenuScene extends Scene {

    initStage() {

        const startButton = new Button('|>', new TextStyle({
            fontSize: 64,
            fill: 'white'
        }));
        startButton.onClick = () => {
            this.sceneManager.changeScene(GameScene);
        };
        startButton.position.set(
            (screenResolution.width - startButton.width)/2,
            2*screenResolution.height/3
        );
        
        const copyright = new Text('by Alphanumeric-username', new TextStyle({
            fill: colors.primary,
            fontSize: 20
        }));

        copyright.x = screenResolution.width - copyright.width - 2;
        copyright.y = screenResolution.height - copyright.height - 2;

        const title = new Text('Bar/Ball', new TextStyle({
            fill: colors.primary,
            fontSize: 96
        }))
        title.x = (screenResolution.width - title.width)/2
        title.y = screenResolution.height/3

        this.stage.addChild(startButton, copyright, title);
    }
}

export default StartMenuScene;