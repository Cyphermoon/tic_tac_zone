import { GamePlayerProps, PlayerProps } from "../Home/type"
import { BoardType } from "./type"

export function switchPlayer(
    currentPlayer: GamePlayerProps,
    player1: GamePlayerProps,
    player2: GamePlayerProps,
    setCurrentPlayer: (player: GamePlayerProps) => void,
) {
    if (currentPlayer.id === player1.id) {
        setCurrentPlayer(player2)
    } else {
        setCurrentPlayer(player1)
    }
}

// Function to reduce player score
export function reducePlayerScore(
    currentPlayer: GamePlayerProps,
    player1: GamePlayerProps,
    player2: GamePlayerProps,
    updatePlayer1: (player: GamePlayerProps) => void,
    updatePlayer2: (player: GamePlayerProps) => void,
) {
    if (currentPlayer.id === player1.id) {
        updatePlayer1({ ...player1, score: player1.score - 1 })
    } else {
        updatePlayer2({ ...player2, score: player2.score - 1 })
    }
}

// Function to check if a player has won
export function checkWinner(marker: string, board: BoardType) {
    const winningCombination = [
        // Horizontal
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],

        // Vertical
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],

        // Diagonal
        [1, 5, 9],
        [3, 5, 7],
    ]

    const isMarkerWinner = winningCombination.some(combination =>
        combination.every(position => board[position] === marker)
    )

    return isMarkerWinner
}

export function isDraw(board: BoardType) {
    return Object.values(board).every(cell => cell !== '')
}


export const minimax = (board: BoardType, isMaximizingPlayer: boolean, player1: GamePlayerProps, player2: GamePlayerProps): number => {
    if (checkWinner(player1.mark, board)) {
        return -1;
    } else if (checkWinner(player2.mark, board)) {
        return 1;
    } else if (isDraw(board)) {
        return 0;
    }

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        for (let position of Object.keys(board)) {
            if (board[position] === '') {
                board[position] = player2.mark;
                let score = minimax(board, false, player1, player2);
                board[position] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let position of Object.keys(board)) {
            if (board[position] === '') {
                board[position] = player1.mark;
                let score = minimax(board,true, player1, player2);
                board[position] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}