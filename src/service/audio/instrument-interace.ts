interface IInstrument {
    ctx: AudioContext,
    destination?: AudioNode,
    playNote(frequency: number, duration: number, args?: any): void,
}

export { IInstrument }