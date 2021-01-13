interface EventsConfig {
    "ball-diminish": {
        "likeliness": number
    },
    "bar-diminish": {
        "likeliness": number
    },
    "bar-lift": {
        "likeliness": number
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

const getConfig = () => eventsConfig;

const loadEventConfig = async () => eventsConfig = await fetch('/config/events.json').then(res => res.json());

export {
    getConfig,
    loadEventConfig
};