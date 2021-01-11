import { Scene } from '../../scene';

type ScoreChangeEvent = {
    score: number
};

interface IEvent {
    likeliness: number,
    running: boolean,
    update(dt: number): void
    start(scene: Scene, duration: number): void,
}

interface IEventManager {
    scene: Scene,
    onScoreChange(e: ScoreChangeEvent): void,
    update(): void,
    eventTable: IEvent[]
    registerEvent(event: IEvent): void
}

export {
    IEvent,
    ScoreChangeEvent,
    IEventManager
}