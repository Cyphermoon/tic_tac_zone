import { GameConfigType } from "../Request/type"
import { UserAvatarProps } from "../common/type"

export type PlayerCardProps = {
    id: string
    avatar: UserAvatarProps
    matches: number
    wins: number
    loss: number
    handleChallenge?: () => void
    online?: boolean
}

export type SelectedPlayerType = Omit<PlayerCardProps, 'handleChallenge'>


export type Player = {
    name: string;
}

export type LocalPlayersProps = {
    player2: Player;
}


// Store Types
export type PlayerProps = {
    id: string
    name: string
    isAnonymous: boolean
    matches?: number
    win?: number
    loss?: number
    draw?: number
    email?: string
}

export type LocalPlayerProps = {
    id: string
    name: string
}

export type CurrentPlayerStateProps = PlayerProps & {
    updateCurrentPlayer: (player: PlayerProps) => void

}

export type LocalPlayerStateProps = LocalPlayerProps & {
    updateLocalPlayer: (player: LocalPlayerProps) => void

}

export type GameMode = "online" | "ai" | "local" | null;

export type GameModeProps = {
    gameMode: GameMode;
    updateGameMode: (gameMode: GameMode) => void
} 

export type AiDifficultyProps = {
    aiDifficulty: string;
    updateAIDifficulty: (aiDifficulty: string) => void
}

export type GamePlayerProps = {
    name: string
    id: string
    mark: string
    score: number
    difficulty?: string
}

export type GameRepresentationProps = {
    gameConfig: GameConfigType
    player1: GamePlayerProps
    player2: GamePlayerProps
    draws: 0
}

export type GameRepresentationStateProps = {
    gameConfig: GameConfigType | null
    player1: GamePlayerProps | null
    player2: GamePlayerProps | null
    timer: number
    round: number
    pause: boolean
    draws: number | null
    updateGameConfig: (game: GameConfigType) => void
    updatePlayer1: (player: GamePlayerProps) => void
    updatePlayer2: (player: GamePlayerProps) => void
    updateDraws: (draws: number) => void
    updateTimer: (timer: number) => void
    updatePause: (pause: boolean) => void
    updateRound: (round: number) => void
}
