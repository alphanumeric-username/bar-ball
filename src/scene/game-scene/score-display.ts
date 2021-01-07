import { Container, Text, TextStyle } from "pixi.js";

import { colors } from '../../constants';

type ScoreDisplayOptions = {
    initialScore?: number,
    fontSize?: number
}


class ScoreDisplay extends Container{
    private _score: number;
    private _text: Text;
    private _fontSize: number;

    constructor(options?: ScoreDisplayOptions) {
        super();
        options = options || { initialScore: 0, fontSize: 72 };
        this._score = options.initialScore;
        this._fontSize = options.fontSize;
        this._createGraphics();
    }

    private _createGraphics() {
        this._text = new Text(this._score.toString(), new TextStyle({
            fill: colors.secondary_dark,
            fontSize: this._fontSize
        }));

        this.addChild(this._text);
    }

    getScore(): number {
        return this._score;
    }

    add(): void {
        this._score += 1;
        this.updateGraphics();
    }

    updateGraphics() {
        this._text.text = this._score.toString();
    }

}

export default ScoreDisplay;