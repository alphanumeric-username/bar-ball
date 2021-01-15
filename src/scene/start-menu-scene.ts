import Button from '../ui/button';
import { Triangle } from '../ui/geometry';

import { Scene } from './scene';
import GameScene from './game-scene';
import LeaderboardScene from './leaderboard-scene';
import { screenResolution } from '../app';
import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { colors } from '../constants';

import { initAudioService } from '../service/audio';
import { getScores } from '../config/leaderboard';

class StartMenuScene extends Scene {

    initStage() {
        
        const buttonsContainer = new Container();
        
        const k = 48;
        const triangle = new Triangle(0, 0, 0, k*1, k*Math.sqrt(3)/2, k*0.5, {
            fill: 0xFFFFFF
        });
        const startButton = new Button(triangle, null, { padding: 16, backgroundColor: colors.primary });
        startButton.onClick = () => {
            initAudioService();
            this.sceneManager.changeScene(GameScene);
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
            getScores().then(scores => this.sceneManager.changeScene(LeaderboardScene, {
                scores: scores
            }))
        }

        leaderboardButton.x = startButton.width + 16;

        buttonsContainer.addChild(leaderboardButton);
        
        buttonsContainer.position.set(
            (screenResolution.width - buttonsContainer.width)/2,
            2*screenResolution.height/3
        );
        
        const copyright = new Text('© 2021 alphanumeric-username', new TextStyle({
            fontFamily: 'Roboto',
            fill: colors.primary,
            fontSize: 20
        }));

        copyright.x = screenResolution.width - copyright.width - 4;
        copyright.y = screenResolution.height - copyright.height - 4;

        const title = new Text('Bar/Ball', new TextStyle({
            fontFamily: 'Roboto',
            fill: colors.primary,
            fontSize: 96
        }))
        title.x = (screenResolution.width - title.width)/2
        title.y = screenResolution.height/3

        this.stage.addChild(buttonsContainer, copyright, title);
    }
}

export default StartMenuScene;