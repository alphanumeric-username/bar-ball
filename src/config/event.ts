interface EventsConfig {
    "ball-diminish": {
        "likeliness": number
    },
    "no-gravity": {
        "likeliness": number
    },
    "rain": {
        "likeliness": number
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

function getConfig(): EventsConfig {
    return eventsConfig;
}

const loadEventConfig = async () => eventsConfig = await fetch('/config/events.json').then(res => res.json());

export {
    getConfig,
    loadEventConfig
};