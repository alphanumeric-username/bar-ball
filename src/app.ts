import { Application } from 'pixi.js';
import { colors } from './constants';

function isWebGLSupported(): boolean {
    const ctx = document.createElement('canvas').getContext('webgl2');
    return ctx != null && ctx != undefined;
}

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
    forceCanvas: !isWebGLSupported()
});

document.body.appendChild(app.view);

export default app;
export { screenResolution };