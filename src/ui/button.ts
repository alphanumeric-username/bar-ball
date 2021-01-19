import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { colors } from '../constants';

type ButtonStyle = {
    backgroundColor?: number,
    padding?: number,
}

class Button extends Container{
    private _box: Graphics;
    private _content: Container;
    onClick: () => void;

    constructor(
        content: string | Container, 
        textStyle? : TextStyle, 
        buttonStyle: ButtonStyle = {
            backgroundColor: colors.primary,
            padding: 2
        }
    ) {
        super();
        if (typeof content === 'string') {
            const style = textStyle || new TextStyle({
                fill: 'white',
                fontSize: 24,
            });
            this._content = new Text(content, style);
        } else {
            this._content = content;
        }
        this._content.position.set(buttonStyle.padding, buttonStyle.padding);

        this._box = new Graphics();
        this._box.beginFill();
        this._box.beginFill(buttonStyle.backgroundColor, 1);
        this._box.drawRoundedRect(0, 0, this._content.width + 2*buttonStyle.padding, this._content.height + 2*buttonStyle.padding, 12);
        this._box.endFill();

        this.addChild(this._box);
        this.addChild(this._content);

        this.interactive = true;
        this.addListener('mousedown', () => {
            this._box.alpha = 0.6;
        });
        this.addListener('mouseup', () => {
            this.onClick();
            this._box.alpha = 1;
        });
        this.addListener('mouseover', () => {
            this._box.alpha = 0.8;
        });
        this.addListener('mouseout', () => {
            this._box.alpha = 1;
        });
    }
}

export default Button;