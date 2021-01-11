import { IEvent, IEventManager, ScoreChangeEvent } from './event-interface';
import { Scene } from '../../scene';
import { clamp } from '../../../math/util';

class EventManager implements IEventManager {

    scene: Scene;
    eventTable: IEvent[] = [];
    
    private _lastTime: number = 0;

    constructor(scene: Scene) {
        this.scene = scene;
        this._lastTime = new Date().valueOf()/1000;
    }
    registerEvent(event: IEvent): void {
        this.eventTable.push(event);
    }

    onScoreChange({ score }: ScoreChangeEvent): void {
        this.eventTable.forEach((e) => {
            if (!e.running) {
                if (Math.random() < e.likeliness) {
                    e.start(this.scene, 8 + Math.floor(score/10));
                    // e[1] = 0;
                }
                // e[1] = clamp(e[1] + 0.025, 0, 1);
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
}

export default EventManager;