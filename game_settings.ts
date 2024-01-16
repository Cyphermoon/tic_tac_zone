import { GameConfigType } from "./components/Request/type";

export const DEFAULT_GAME_CONFIG: GameConfigType = {
    mode: "online",
    boardType: [{
        dimension: "3",
        value: "3x3 Board",
        id: "3x3"
    }, {
        dimension: "4",
        value: "4x4 Board",
        id: "4x4"
    }, {
        dimension: "5x5",
        value: "5x5 Board",
        id: "5x5"
    }],
    currentBoardType: {
        dimension: "3",
        value: "3x3 Board",
        id: "3x3"
    },
    timer: 30,
    totalRounds: 3,
    roundsToWin: 2,
    distortedMode: true,
    revealMode: false
};

export const AiCharacters = [
    {
        "name": "Rookie Robot",
        "id": "moon-1",
        "difficulty": "easy",
        "className": "shadow-green-400"
    },
    {
        "name": "Clever Cyborg",
        "id": "stable-xxl",
        "difficulty": "medium",
        "className": "shadow-blue-400"
    },
    {
        "name": "Master Mindbot",
        "id": "moon-3",
        "difficulty": "hard",
        "className": "shadow-accent"
    }
]