import { Container, Text, TextStyle } from "pixi.js";
import { LeaderboardEntry } from "../../config/leaderboard";
import { colors } from "../../constants";

class LeaderboardDisplay extends Container {
    
    scores: LeaderboardEntry[];

    constructor(scores: LeaderboardEntry[]) {
        super();
        this.scores = scores;
        this._createGraphics();
    }

    private _createGraphics() {
        this.scores.forEach((score, idx) => {
            const text = new Text(`${score.order}${this._getOrderSuffix(score.order)} - ${score.score} `, new TextStyle({
                fill: colors.primary,
                fontFamily: 'Roboto',
                fontSize: 24
            }));
            text.y = idx * text.height;
            this.addChild(text);
        })
    }

    private _getOrderSuffix(n: number) {
        return n == 1 ? 'st' :
               n == 2 ? 'nd' :
               n == 3 ? 'rd' : 
                        'th';
    }
}

export default LeaderboardDisplay;