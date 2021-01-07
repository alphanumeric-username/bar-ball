import { Application } from 'pixi.js';
import { colors } from './constants';

type ScreenResolution = {
    readonly width: number,
    readonly height: number
}

const screenResolution: ScreenResolution = {
    width: 800,
    height: 600
}

const app = new Application({
    width: screenResolution.width,
    height: screenResolution.height,
    backgroundColor: colors.secondary,
    antialias: true,
});

document.body.appendChild(app.view);

export default app;
export { screenResolution };