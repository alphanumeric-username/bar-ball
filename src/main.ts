import { loadEventConfig } from './config/event';
import { initDatabase } from './config/leaderboard';
import app from './app';
import Game from './game/game'

Promise.all([
    loadEventConfig(),
    initDatabase(),

]).then(() => {
    new Game({
        app: app
    });
}).catch(err => console.error('Could not init:\n', err));

window.addEventListener('keydown', (e) => {
    if (e.key == ' ' && e.target == document.body) {
        e.preventDefault();
    }
});