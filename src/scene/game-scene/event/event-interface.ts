import { Scene } from '../../scene';

type ScoreChangeEvent = {
    score: number
};

interface IEvent {
    name: string,
    likeliness: number,
    running: boolean,
    mutex: Set<string>,
    update(dt: number): void
    start(scene: Scene, duration: number): void,
    stop(): void
}

interface IEventManager {
    scene: Scene,
    onScoreChange(e: ScoreChangeEvent): void,
    update(dt: number): void,
    eventTable: Map<string, IEvent>,
    registerEvent(event: IEvent): void
    gameOver(): void;
}

export {
    IEvent,
    ScoreChangeEvent,
    IEventManager
}