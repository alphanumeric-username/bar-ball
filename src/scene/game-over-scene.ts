import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import '@pixi/graphics-extras';
import { Scene, SceneClass } from './scene';
import StartMenuScene from './start-menu-scene';
import ScoreDisplay from './game-scene/score-display';
import Button from '../ui/button';
import HomeButton from './common-elements/home-button';
import { screenResolution } from '../app';
import { colors } from '../constants';
import { Triangle } from '../ui/geometry';
import Vec2 from '../math/vec2';
import GameScene from './game-scene';


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

        

        const scoreText = new Text('Score:', new TextStyle({
            fill: colors.secondary_dark,
            fontFamily: 'Roboto-Regular',
            fontSize: 24
        }));

        scoreText.x = (screenResolution.width - scoreText.width)/2;
        scoreText.y = scoreDisplay.y - scoreText.height - 8;

        const buttonContainer = new Container();

        const playAgainButton = this._createPlayAgainButton();
        const mainMenuButton = this._createMainMenuButton();
        
        buttonContainer.addChild(playAgainButton);
        mainMenuButton.x = playAgainButton.width + 16;
        buttonContainer.addChild(mainMenuButton);
        buttonContainer.position.set(
            (screenResolution.width - buttonContainer.width)/2,
            3*screenResolution.height/4
        )

        const gameOverText = new Text('Game Over', new TextStyle({
            fill: colors.primary,
            fontFamily: 'Roboto-Regular',
            fontSize: 72
        }));
        
        gameOverText.x = (screenResolution.width - gameOverText.width)/2;
        gameOverText.y = screenResolution.height/6;
        
        this.stage.addChild(scoreDisplay, scoreText, gameOverText, buttonContainer);
    }

    private _createPlayAgainButton() {
        const arc = new Graphics().beginFill(0xFFFFFF)
        .drawTorus(0, 0, 0.25, 0.5, Math.PI/2, 7*Math.PI/4)
        .endFill();
        
        const [x0, y0] = [Math.cos(7*Math.PI/4), Math.sin(7*Math.PI/4)];
        
        const [xn, yn] = Vec2.normal(new Vec2(x0, y0)).toTuple();
                                  
        const p1 = new Vec2(0.1*x0, 0.1*y0);
        const p2 = new Vec2(0.65*x0, 0.65*y0);
        const [tipx, tipy] = Vec2.add(
            Vec2.scale(
                1/2,
                Vec2.add(p1, p2)
            ), 
            new Vec2(0.3*xn, 0.3*yn)
        ).toTuple();
        const arrowTip = new Triangle(p1.x, p1.y, p2.x, p2.y, tipx, tipy, {
            fill: 0xFFFFFF
        });

        arc.addChild(arrowTip);

        arc.pivot.set(-0.5, -0.5);
        arc.scale.set(48, 48);

        const playAgainButton = new Button(arc, null, { padding: 16, backgroundColor: colors.primary });
        playAgainButton.onClick = () => {
            this.sceneManager.changeScene(GameScene);
        }

        // this.stage.addChild(playAgainButton);
        return playAgainButton;
    }

    private _createMainMenuButton() {

        // const content = new Graphics()
        // .beginFill(0xFFFFFF)
        // .moveTo(24, 0)
        // .lineTo(0, 20)
        // .lineTo(8, 20)
        // .lineTo(8, 48)
        // .lineTo(40, 48)
        // .lineTo(40, 20)
        // .lineTo(48, 20)
        // .lineTo(24, 0)
        // .endFill()
        // .beginFill(colors.primary)
        // .drawRect(16, 28, 16, 20)
        // .endFill();

        // const mainMenuButton = new Button(content, null, {
        //     padding: 16,
        //     backgroundColor: colors.primary
        // });
        const mainMenuButton = new HomeButton();

        mainMenuButton.onClick = () => {
            this.sceneManager.changeScene(StartMenuScene);
        };

        // this.stage.addChild(mainMenuButton);
        return mainMenuButton;
    }
}

export default GameOverScene;