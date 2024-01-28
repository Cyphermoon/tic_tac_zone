
import {create} from 'zustand';
import { AiDifficultyProps, CurrentPlayerStateProps, GameMode, GameModeProps, GamePlayerProps, GameRepresentationStateProps, LocalPlayerProps, LocalPlayerStateProps, OnlineGameStateRepresentationProps, PlayerProps } from './type';
import { GameConfigType } from '../Request/type';


export const useGameMode = create<GameModeProps>((set) => ({
    gameMode: null,
    updateGameMode: (gameMode: GameMode) => set({gameMode: gameMode})
}))


export const useAIDifficulty = create<AiDifficultyProps>((set) => ({
    aiDifficulty: "easy",
    updateAIDifficulty: (difficulty: string) => set({aiDifficulty: difficulty})
}))

export const useCurrentPlayer = create<CurrentPlayerStateProps>((set) => ({
    isAnonymous: true,
    name: "",
    id: "",
    imageUrl: null,
    email: "",
    match: 0,
    win: 0,
    loss: 0,
    matches: 0, 
    online: false, 
    updateCurrentPlayer: (player: PlayerProps) => set({...player}),
    updateOnline: (online: boolean) => set({online})
}))

export const useLocalPlayer = create<LocalPlayerStateProps>((set) => ({
    name: "",
    id: "",
    updateLocalPlayer: (player: LocalPlayerProps) => set({...player})
}))

export const useGameRepresentation = create<GameRepresentationStateProps>(set =>({
    config: null,
    player1: null,
    player2: null,
    draws: 0,
    round: 0,
    timer: 0,
    pause: false,
    distortedGhost: false,
    updateGameConfig: (game: GameConfigType) => set({config: {...game}}),
    updatePlayer1: (player: GamePlayerProps) => set({player1: {...player}}),
    updatePlayer2: (player: GamePlayerProps) => set({player2: {...player}}),
    updateDraws: (draws: number) => set({draws}),
    updateTimer: (timer: number) => set({timer}),
    updatePause: (pause: boolean) => set({pause}),
    updateRound: (round: number) => set({round}),
    updateDistortedGhost: (distortedGhost: boolean) => set({distortedGhost})
}))


export const useOnlineGameId = create<OnlineGameStateRepresentationProps>((set) => ({
    id: null,
    updateOnlineGameId: (id: string) => set({id})
}))

