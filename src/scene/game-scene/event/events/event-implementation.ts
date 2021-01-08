import { Scene } from "../../../scene";
import { IEvent } from "../event-interface";

abstract class EventImplementation implements IEvent {

    running: boolean;
    protected duration: number = 0;
    protected elapsedTime: number = 0;
    protected currentScene: Scene

    update(dt: number): void {
        this.elapsedTime += dt
    }

    start(scene: Scene, duration: number): void {
        this.running = true;
        this.currentScene = scene;
        this.duration = duration;
    }

    protected stop(): void {
        this.elapsedTime = 0;
        this.duration = 0;
        this.running = false;
        this.currentScene = null;
    }
}

export default EventImplementation;