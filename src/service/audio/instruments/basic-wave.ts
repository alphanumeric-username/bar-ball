import { IInstrument } from '../instrument-interace';

type PlayBasicWaveArgs = {
    type: 'triangle' | 'square' | 'sawtooth' | 'sine'
}

class BasicWave implements IInstrument {
    ctx: AudioContext;
    destination: AudioNode;

    constructor(ctx: AudioContext, destination: AudioNode = null) {
        this.ctx = ctx;
        this.destination = destination ? destination : ctx.destination;
    }
    
    playNote(frequency: number, duration: number, args?: PlayBasicWaveArgs): void {
        const osc = this.ctx.createOscillator();
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
        osc.type = args && args.type || 'sine';
        osc.connect(this.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
}

export default BasicWave;