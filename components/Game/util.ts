import { GamePlayerProps } from "../Home/type"
import { BoardType } from "./type"

export function switchPlayer(
    currentPlayer: GamePlayerProps,
    player1: GamePlayerProps,
    player2: GamePlayerProps,
    setCurrentPlayer: (player: GamePlayerProps) => void,
    finalWinner: boolean = false
) {
    console.log("Final Variable: ", finalWinner)
    if (finalWinner) return

    if (currentPlayer.id === player1.id) {
        setCurrentPlayer(player2)
    } else {
        setCurrentPlayer(player1)
    }
}

// Function to reduce player score
export function increaseOtherPlayerScore(
    currentPlayer: GamePlayerProps,
    player1: GamePlayerProps,
    player2: GamePlayerProps,
    updatePlayer1: (player: GamePlayerProps) => void,
    updatePlayer2: (player: GamePlayerProps) => void,
) {
    if (currentPlayer.id === player1.id) {
        let score = player2.score + 1
        updatePlayer2({ ...player2, score })


    } else {
        let score = player1.score + 1
        updatePlayer1({ ...player1, score })
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

export interface MiniMaxProps {
    score: number,
    position: string | null
}


export const minimax = (board: BoardType, isMaximizingPlayer: boolean, player1: GamePlayerProps, player2: GamePlayerProps):MiniMaxProps => {
    if (checkWinner(player1.mark, board)) {
        return {score:-1, position:null};
    } else if (checkWinner(player2.mark, board)) {
        return {score:1, position:null};
    } else if (isDraw(board)) {
        return {score:0, position: null};
    }

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        let bestPosition = null

        for (let position of Object.keys(board)) {
            if (board[position] === '') {
                board[position] = player2.mark;
                let state = minimax(board, false, player1, player2);
                board[position] = '';

                if(state.score > bestScore){
                    bestScore = state.score
                    bestPosition = position
                }
            }
        }
        return {score:bestScore, position: bestPosition};

    } else {
        let bestScore = Infinity;
        let bestPosition = null

        for (let position of Object.keys(board)) {
            if (board[position] === '') {
                board[position] = player1.mark;
                let state = minimax(board,true, player1, player2);
                board[position] = '';

                if(state.score < bestScore){   
                    bestScore = state.score
                    bestPosition = position
                }
            }
        }
        return {score: bestScore, position: bestPosition};
    }
}

export function getAvailablePositions(board: BoardType) {
    return Object.keys(board).filter(key => board[key] === '')
}