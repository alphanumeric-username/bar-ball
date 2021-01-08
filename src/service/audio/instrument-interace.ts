interface IInstrument {
    ctx: AudioContext,
    playNote(frequency: number, duration: number, args?: any): void,
}

export { IInstrument }