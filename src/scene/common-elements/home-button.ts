import { Graphics } from 'pixi.js';
import { colors } from '../../constants';
import Button from '../../ui/button';

class HomeButton extends Button {
    constructor() {
        super(
        new Graphics()
        .beginFill(0xFFFFFF)
        .moveTo(24, 0)
        .lineTo(0, 20)
        .lineTo(8, 20)
        .lineTo(8, 48)
        .lineTo(16, 48)
        .lineTo(16, 28)
        .lineTo(32, 28)
        .lineTo(32, 48)
        .lineTo(40, 48)
        .lineTo(40, 20)
        .lineTo(48, 20)
        .lineTo(24, 0)
        .endFill()
        , null, {
            padding: 16,
            backgroundColor: colors.primary
        });
    }
};

export default HomeButton;