interface EventsConfig {
    "ball-diminish": {
        "likeliness": number
    },
    "bar-diminish": {
        "likeliness": number,
        "diminish-factor": number,
        "transition-time": number,
    },
    "bar-lift": {
        "likeliness": number,
        "lift-amount": number,
        "delay": number,
        "transition-time": number
    },
    "curtain": {
        "likeliness": number,
        "curtain": {
            'alpha': number
        }
    },
    "no-gravity": {
        "likeliness": number
    },
    "rain": {
        "likeliness": number,
        "drop-generation-period": number
    },
    "random-bar": {
        "likeliness": number
    },
    "random-throw": {
        "likeliness": number
    },
    "wind": {
        "likeliness": number
    }
}

var eventsConfig: EventsConfig;

const getEventConfig = () => eventsConfig;

const loadEventConfig = async () => eventsConfig = await fetch('/config/event.json').then(res => res.json());

export {
    getEventConfig,
    loadEventConfig
};