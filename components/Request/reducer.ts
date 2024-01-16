import { GameAction, GameConfigType } from "./type";

export const gameConfigReducer = (state: GameConfigType, action: GameAction): GameConfigType => {
    switch (action.type) {
        case 'updateCurrentType':
            return { ...state, currentBoardType: action.payload };
        case 'updateTimer':
            return { ...state, timer: action.payload };
        case 'updateTotalRounds':
            return { ...state, totalRounds: action.payload };
        case 'updateRoundsToWin':
            return { ...state, roundsToWin: action.payload };
        case 'updateDistortedMode':
            return { ...state, distortedMode: action.payload };
        case 'updateRevealMode':
            return { ...state, revealMode: action.payload };
        default:
            throw new Error(`Unsupported action type`);
    }
};