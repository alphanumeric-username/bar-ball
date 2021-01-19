import { LeaderboardEntry } from "../config/leaderboard";
import { Scene } from "./scene";

import LeaderboardDisplay from './leaderboard-scene/leaderboard-display';
import { screenResolution } from "../app";
import { Text, TextStyle } from "pixi.js";
import { colors } from "../constants";
import Button from "../ui/button";
import StartMenuScene from "./start-menu-scene";
import HomeButton from "./common-elements/home-button";

type LeaderboardSceneArgs = {
    scores: LeaderboardEntry[],
}

class LeaderboardScene extends Scene {

    scores: LeaderboardEntry[];

    state: 'running' | 'transition-in' | 'transition-out';

    beforeInitStage(args: LeaderboardSceneArgs) {
        this.scores = args.scores;
    }

    initStage() {
        const padding = 16;
        const title = new Text('Leaderboard', new TextStyle({
            fill: colors.primary,
            fontFamily: 'Roboto-Regular',
            fontSize: 72
        }))
        title.x = (screenResolution.width - title.width)/2;
        title.y = 32;

        const leaderboardDisplay = new LeaderboardDisplay(this.scores);

        leaderboardDisplay.x = (screenResolution.width - leaderboardDisplay.width)/2;
        leaderboardDisplay.y = title.y + title.height + padding;

        

        const backButton = new HomeButton();

        backButton.x = (screenResolution.width - backButton.width)/2;
        // backButton.y = leaderboardDisplay.y + leaderboardDisplay.height + 2*padding;
        backButton.y = screenResolution.height - backButton.height - 2*padding;

        backButton.onClick = () => this.sceneManager.changeScene(StartMenuScene);

        this.stage.addChild(leaderboardDisplay, title, backButton);
    }
}

export default LeaderboardScene;