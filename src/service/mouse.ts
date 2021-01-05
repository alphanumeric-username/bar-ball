import app from '../app';

type MouseTracker = {
    getX: () => number,
    getY: () => number
};

var _mouseX: number = 0;
var _mouseY: number = 0;

app.view.addEventListener('mousemove', (e) => [_mouseX, _mouseY] = [e.clientX, e.clientY]);

const mouse: MouseTracker = {
    getX(): number {
        return _mouseX;
    },
    getY(): number {
        return _mouseY;
    }
};

export default mouse;