import { Scene } from "../../../scene";
import { IEvent } from "../event-interface";

abstract class EventImplementation implements IEvent {

    abstract name: string;
    likeliness: number = 0;
    running: boolean;
    mutex: Set<string> = new Set();
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
        this.elapsedTime = 0;
    }

    stop(): void {
        this.elapsedTime = 0;
        this.duration = 0;
        this.running = false;
        this.currentScene = null;
    }
}

export default EventImplementation;