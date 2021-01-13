import { Scene } from '../scene';
import { IEventManager } from './event/event-interface';
import EventManager from './event/event-manager';
import BallDiminishEvent from './event/events/ball-diminish-event';
import CurtainEvent from './event/events/curtain-event';
import NoGravityEvent from './event/events/no-gravity-event';
import RandomThrowEvent from './event/events/random-throw-event';
import RandomBarEvent from './event/events/random-bar-event';
import WindEvent from './event/events/wind-event';

function createEventManager(scene: Scene): IEventManager {
    const eventManager = new EventManager(scene);
    eventManager.registerEvent(new BallDiminishEvent());
    eventManager.registerEvent(new CurtainEvent());
    eventManager.registerEvent(new NoGravityEvent());
    eventManager.registerEvent(new RandomThrowEvent());
    eventManager.registerEvent(new RandomBarEvent());
    eventManager.registerEvent(new WindEvent());
    return eventManager;
}

export {
    createEventManager
};