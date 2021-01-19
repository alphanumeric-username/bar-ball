import { Container, Text, TextStyle } from "pixi.js";

import { colors } from '../../constants';

type ScoreDisplayOptions = {
    initialScore?: number,
    fontSize?: number
}


class ScoreDisplay extends Container{
    score: number;
    private _text: Text;
    private _fontSize: number;

    constructor(options?: ScoreDisplayOptions) {
        super();
        options = options || { initialScore: 0, fontSize: 72 };
        this.score = options.initialScore;
        this._fontSize = options.fontSize;
        this._createGraphics();
    }

    private _createGraphics() {
        this._text = new Text(this.score.toString(), new TextStyle({
            fill: colors.secondary_dark,
            fontFamily: 'Roboto-Thin',
            fontSize: this._fontSize
        }));

        this.addChild(this._text);
    }

    getScore(): number {
        return this.score;
    }

    add(): void {
        this.score += 1;
        this.updateGraphics();
    }

    updateGraphics() {
        this._text.text = this.score.toString();
    }

}

export default ScoreDisplay;