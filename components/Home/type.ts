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
    isFirstPlayer: boolean;
}

export type LocalPlayersProps = {
    player1: Player;
    player2: Player;
}