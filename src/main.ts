import { loadEventConfig } from './config/event';
import app from './app'
import Game from './game/game'

loadEventConfig()
.then(() => {
    new Game({
        app: app
    });
})
.catch(err => console.error('Could not load config:\n', err));
