import { Scene } from '../scene';
import { IEventManager } from './event/event-interface';
import EventManager from './event/event-manager';
import NoGravityEvent from './event/events/no-gravity-event';

function createEventManager(scene: Scene): IEventManager {
    const eventManager = new EventManager(scene);
    eventManager.registerEvent(new NoGravityEvent());
    return eventManager;
}

export {
    createEventManager,
    NoGravityEvent
};