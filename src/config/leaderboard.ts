import { StoreConfig, openDatabase, readAll, writeAll, removeAll } from '../service/database';

interface LeaderboardEntry {
    id?: number,
    score: number,
    order?: number
};

const MAX_LEADERBOARD_ENTRIES = 10;

const stores: StoreConfig[] = [
    {
        name: 'leaderboard',
        storeParams: {
            autoIncrement: true,
            keyPath: 'id'
        }
    }
];

async function initDatabase() {
    await openDatabase(stores);
}

async function saveScore(newEntry:LeaderboardEntry) {
    const entries = await readAll<LeaderboardEntry>('leaderboard');
    
    entries.push(newEntry);
    const sortedEntries = entries.sort((a, b) => a.score - b.score);
    
    sortedEntries.forEach((entry, i) => {
        entry.order = sortedEntries.length - i
    });

    const reversedEntries = sortedEntries.reverse();

    const [stayEntries, removeEntries] = [reversedEntries.slice(0, MAX_LEADERBOARD_ENTRIES), reversedEntries.slice(MAX_LEADERBOARD_ENTRIES)];

    await writeAll('leaderboard', stayEntries);
    await removeAll('leaderboard', removeEntries.map(entry => entry.id).filter(id => id != null && id != undefined));
}

async function getScores(): Promise<LeaderboardEntry[]> {
    const scores = await readAll<LeaderboardEntry>('leaderboard');
    return scores.sort((a, b) => a.order - b.order);
}

export {
    initDatabase,
    LeaderboardEntry,
    getScores,
    saveScore,
};