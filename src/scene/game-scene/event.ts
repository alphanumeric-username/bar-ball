import { Scene } from '../scene';
import { IEventManager } from './event/event-interface';
import EventManager from './event/event-manager';
import NoGravityEvent from './event/events/no-gravity-event';
import RandomThrowEvent from './event/events/random-throw-event';
import WindEvent from './event/events/wind-event';

function createEventManager(scene: Scene): IEventManager {
    const eventManager = new EventManager(scene);
    eventManager.registerEvent(new NoGravityEvent());
    eventManager.registerEvent(new RandomThrowEvent());
    eventManager.registerEvent(new WindEvent());
    return eventManager;
}

export {
    createEventManager,
    NoGravityEvent
};