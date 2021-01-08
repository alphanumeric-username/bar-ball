import { IEvent, IEventManager, ScoreChangeEvent } from './event-interface';
import { Scene } from '../../scene';
import { clamp } from '../../../math/util';

class EventManager implements IEventManager {

    scene: Scene;
    eventTable: [IEvent, number][] = [];
    
    private _lastTime: number = 0;

    constructor(scene: Scene) {
        this.scene = scene;
        this._lastTime = new Date().valueOf()/1000;
    }
    registerEvent(event: IEvent): void {
        this.eventTable.push([event, 0.0]);
    }

    onScoreChange({ score }: ScoreChangeEvent): void {
        this.eventTable.forEach((ep) => {
            if (!ep[0].running) {
                if (Math.random() < ep[1]) {
                    ep[0].start(this.scene, 8 + Math.floor(score/10));
                    ep[1] = 0;
                }
                ep[1] = clamp(ep[1] + 0.025, 0, 1);
            }
        });
    }

    update(): void {
        const t0 = this._lastTime;
        const t = new Date().valueOf()/1000;
        const dt = t - t0;
        this._lastTime = t;
        this.eventTable.forEach(([e, p]) => {
            if (e.running) {
                e.update(dt);
            }
        });
    }
}

export default EventManager;