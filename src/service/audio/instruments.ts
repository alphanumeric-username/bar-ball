import { IInstrument } from "./instrument-interace";
import BasicWave from './instruments/basic-wave';

const instruments: Map<string, IInstrument> = new Map<string, IInstrument>();
var _ctx: AudioContext = null;
var initialized = false;

function provideContext(ctx:AudioContext) {
    _ctx = ctx;
}

function initInstruments() {
    if (!initialized) {
        instruments.set('basic-wave', new BasicWave(_ctx));
        initialized = true;
    }
}

function playNote(instrumentName: string, frequency: number, duration: number, args?: any) {
    const instrument = instruments.get(instrumentName);
    if (instrument) {
        instrument.playNote(frequency, duration, args);
    } else {
        console.warn(`Instrument "${instrumentName}" does not exist.`);
    }
}

export {
    instruments,
    provideContext,
    initInstruments,
    playNote
}