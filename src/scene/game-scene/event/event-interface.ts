import { Scene } from '../../scene';

type ScoreChangeEvent = {
    score: number
};

interface IEvent {
    running: boolean,
    update(dt: number): void
    start(scene: Scene, duration: number): void,
}

interface IEventManager {
    scene: Scene,
    onScoreChange(e: ScoreChangeEvent): void,
    update(): void,
    eventTable: [IEvent, number][]
    registerEvent(event: IEvent): void
}

export {
    IEvent,
    ScoreChangeEvent,
    IEventManager
}