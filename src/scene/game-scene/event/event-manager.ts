import { IEvent, IEventManager, ScoreChangeEvent } from './event-interface';
import { Scene } from '../../scene';
import { clamp } from '../../../math/util';

class EventManager implements IEventManager {

    scene: Scene;
    eventTable: Map<string, IEvent> = new Map();
    
    private _lastTime: number = 0;
    eventIsRunning: boolean = false;

    constructor(scene: Scene) {
        this.scene = scene;
        this._lastTime = new Date().valueOf()/1000;
    }
    registerEvent(event: IEvent): void {
        this.eventTable.set(event.name, event);
    }

    onScoreChange({ score }: ScoreChangeEvent): void {
        this.eventTable.forEach((e) => {
            if (!e.running) {
                if (Math.random() < e.likeliness*(1 + score/100)) {
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

    update(): void {
        const t0 = this._lastTime;
        const t = new Date().valueOf()/1000;
        const dt = t - t0;
        this._lastTime = t;
        this.eventTable.forEach(e => {
            if (e.running) {
                e.update(dt);
            }
        });
    }

    gameOver() {
        this.eventTable.forEach(e => e.running ? e.stop() : null);
    }
}

export default EventManager;