import Button from '../ui/button';
import { Triangle } from '../ui/geometry';

import { Scene } from './scene';
import GameScene from './game-scene';
import { screenResolution } from '../app';
import { Text, TextStyle } from 'pixi.js';
import { colors } from '../constants';

import { initAudioService } from '../service/audio';

class StartMenuScene extends Scene {

    initStage() {
        const k = 48;
        const triangle = new Triangle(0, 0, 0, k*1, k*Math.sqrt(3)/2, k*0.5, {
            fill: 0xFFFFFF
        })
        const startButton = new Button(triangle, null, { padding: 16, backgroundColor: colors.primary });
        startButton.onClick = () => {
            initAudioService();
            this.sceneManager.changeScene(GameScene);
        };
        startButton.position.set(
            (screenResolution.width - startButton.width)/2,
            2*screenResolution.height/3
        );
        
        const copyright = new Text('© 2021 alphanumeric-username', new TextStyle({
            fill: colors.primary,
            fontSize: 20
        }));

        copyright.x = screenResolution.width - copyright.width - 4;
        copyright.y = screenResolution.height - copyright.height - 4;

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