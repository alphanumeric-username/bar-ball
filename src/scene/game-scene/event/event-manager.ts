import { IEvent, IEventManager, ScoreChangeEvent } from './event-interface';
import { Scene } from '../../scene';
import { clamp } from '../../../math/util';

class EventManager implements IEventManager {

    scene: Scene;
    eventTable: Map<string, IEvent> = new Map();
    
    runningEvents: number = 0;

    constructor(scene: Scene) {
        this.scene = scene;
    }
    registerEvent(event: IEvent): void {
        this.eventTable.set(event.name, event);
    }

    onScoreChange({ score }: ScoreChangeEvent): void {
        this.eventTable.forEach((e) => {
            if (!e.running) {
                if (Math.random() < e.likeliness*(1 + score/100 - this.runningEvents/10)) {
                    var mutexIsRunning = false;
                    e.mutex.forEach(evtName => {
                        if (this.eventTable.get(evtName).running) {
                            mutexIsRunning = true;
                        }
                    });
                    if (!mutexIsRunning) {
                        e.start(this.scene, 8 + Math.floor(score/100));
                    }
                }
            }
        });
    }

    update(dt: number): void {
        var _runningEvents = 0;
        this.eventTable.forEach(e => {
            if (e.running) {
                e.update(dt);
                _runningEvents++;
            }
        });
        this.runningEvents = _runningEvents;
    }

    gameOver() {
        this.eventTable.forEach(e => e.running ? e.stop() : null);
    }
}

export default EventManager;