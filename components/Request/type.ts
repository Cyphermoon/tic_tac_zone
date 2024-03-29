type BoardType = {
    dimension: string
    value: string
    id: string

}

export type GameConfigType = {
    boardType: BoardType[],
    currentBoardType: BoardType,
    timer: number,
    totalRounds: number,
    roundsToWin: number
    distortedMode: boolean
    revealMode: boolean
}

export type ViewModeType = "edit" | "view"

export type GameAction =
| { type: 'updateCurrentType'; payload: { dimension: string; value: string; id: string } }
| { type: 'updateTimer'; payload: number }
| { type: 'updateTotalRounds'; payload: number }
| { type: 'updateRoundsToWin'; payload: number }
| { type: 'updateDistortedMode'; payload: boolean }
| { type: 'updateRevealMode'; payload: boolean }
| {type:  'updateConfig'; payload: GameConfigType}