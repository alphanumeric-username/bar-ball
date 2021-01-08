import { initInstruments, playNote, provideContext } from './audio/instruments';

var ctx: AudioContext = null
var initialized = false;

function initAudioService() {
    if (!initialized) {
        ctx = new AudioContext();
        provideContext(ctx);
        initInstruments();
        initialized = true;
    }
}

export {
    playNote,
    initAudioService
}