import { Scene, SceneClass } from './scene';
import StartMenuScene from './start-menu-scene';
import ScoreDisplay from './game-scene/score-display';
import Button from '../ui/button';
import { screenResolution } from '../app';
import { Text, TextStyle } from 'pixi.js';
import { colors } from '../constants';


type GameOverArgs = {
    score: number,
    previousScene: SceneClass
};

class GameOverScene extends Scene {
    private _score: number;
    private _previousScene: SceneClass;

    beforeInitStage(args: GameOverArgs) {
        this._score = args.score;
        this._previousScene = args.previousScene;
    }
    
    initStage() {
        const scoreDisplay = new ScoreDisplay({ initialScore: this._score, fontSize: 128 });
        scoreDisplay.x = (screenResolution.width - scoreDisplay.width)/2;
        scoreDisplay.y = 5*screenResolution.height/12;

        const playAgainButton = new Button('Play Again', new TextStyle({
            fill: 'white',
            fontSize: 48
        }), { padding: 8, backgroundColor: colors.primary });
        playAgainButton.position.set(
            (screenResolution.width - playAgainButton.width)/2,
            3*screenResolution.height/4
        )
        playAgainButton.onClick = () => {
            // this.sceneManager.changeScene(this._previousScene);
            this.sceneManager.changeScene(StartMenuScene);
        }

        const scoreText = new Text('Score:', new TextStyle({
            fill: colors.secondary_dark,
            fontSize: 24
        }));

        scoreText.x = (screenResolution.width - scoreText.width)/2;
        scoreText.y = scoreDisplay.y - scoreText.height - 8;
        
        const gameOverText = new Text('Game Over', new TextStyle({
            fill: colors.primary,
            fontSize: 72
        }));
        
        gameOverText.x = (screenResolution.width - gameOverText.width)/2;
        gameOverText.y = screenResolution.height/6;
        

        this.stage.addChild(scoreDisplay, playAgainButton, scoreText, gameOverText);
    }
}

export default GameOverScene;