import { Container, Graphics, Text, TextStyle } from "pixi.js";
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
            const tableEntry = new Container();
            
            const orderTxt = new Text(`${score.order}${this._getOrderSuffix(score.order)}`, new TextStyle({
                fill: colors.primary,
                fontFamily: 'Roboto-Regular',
                fontSize: 24
            }));

            orderTxt.x = (32 - orderTxt.width);
            orderTxt.y = (32 - orderTxt.height)/2;

            const scoreTxt = new Text(`${score.score} `, new TextStyle({
                fill: colors.primary,
                fontFamily: 'Roboto-Regular',
                fontSize: 24
            }));

            scoreTxt.x = (32 - scoreTxt.width)/2 + 64;
            scoreTxt.y = (32 - scoreTxt.height)/2;

            tableEntry.addChild(orderTxt);
            tableEntry.addChild(scoreTxt);

            tableEntry.y = idx * 32 + 8;
            
            if (idx < this.scores.length - 1) {
                const lineWidth = 256;
                const line = new Graphics()
                .beginFill(colors.secondary_dark)
                .drawRoundedRect((tableEntry.width - lineWidth)/2, 30, lineWidth, 2, 24)
                .endFill();
    
                // tableEntry.addChild(line);
            }

            this.addChild(tableEntry);
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