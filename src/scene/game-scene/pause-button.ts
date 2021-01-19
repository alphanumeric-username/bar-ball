import { Container, Graphics } from "pixi.js";
import { colors } from '../../constants';
import { Triangle } from "../../ui/geometry";

class PauseButton extends Container {
    size: number;

    pauseGraphics: Graphics;
    resumeGraphics: Triangle;

    constructor(size: number) {
        super();
        this.size = size;
        this._createGraphics();
        this.interactive = true;
        this.addListener('click', () => this.onClick());
    }

    onClick() {}

    private _createGraphics() {

        this.addChild(
            new Graphics().beginFill(colors.secondary)
                          .drawRect(0, 0, this.size, this.size)
                          .endFill()
            );

        this.pauseGraphics = new Graphics().beginFill(colors.primary)
                                           .drawRect(0, 0, this.size/3, this.size)
                                           .drawRect(2*this.size/3, 0, this.size/3, this.size)
                                           .endFill();
                                           
        this.resumeGraphics = new Triangle(0, 0, this.size, this.size/2, 0, this.size, {
            fill: colors.primary
        });


        this.addChild(this.pauseGraphics);
    }

    pause() {
        this.removeChild(this.pauseGraphics);
        this.addChild(this.resumeGraphics);
    }
    
    resume() {
        this.removeChild(this.resumeGraphics);
        this.addChild(this.pauseGraphics);
    }
}

export default PauseButton;