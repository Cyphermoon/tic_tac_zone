import { useEffect, useState } from 'react'
import { GamePlayerProps } from '../Home/type'
import TicTacToeBoard from './TicTacToeBoard'
import { BoardType } from './type'
import { _board } from '@/game_settings'
import { useGameRepresentation } from '../Home/store'
import GameInfoDialog from '../modals/GameInfoModal'
import { useModal } from '@/hooks/index.hook'
import Image from 'next/image'
import Button from '../common/Button'

interface Props {
    label: string
    player1: GamePlayerProps
    player2: GamePlayerProps
    currentPlayer: GamePlayerProps
    setCurrentPlayer: (player: GamePlayerProps) => void
    countdown: number,
    setTimeLeft: (time: number) => void
}

// Function to reset the game board
export const resetBoard = (setBoard: (board: BoardType) => void) => {
    setBoard(_board)
}

const LocalTicTacToe = ({ label, currentPlayer, player1, player2, setCurrentPlayer, countdown, setTimeLeft }: Props) => {
    const [board, setBoard] = useState(_board);
    const { isOpen, openModal, closeModal } = useModal(false)
    const updatePlayer1 = useGameRepresentation(state => state.updatePlayer1)
    const updatePlayer2 = useGameRepresentation(state => state.updatePlayer2)

    // Function to handle cell click event
    function handleCellClicked(position: string) {
        if (board[position] !== '') return

        const newBoard = { ...board, [position]: currentPlayer.mark }

        setTimeLeft(countdown)
        setBoard(newBoard)

        if (checkWinner(currentPlayer.mark, newBoard)) {
            if (currentPlayer.id === player1.id)
                updatePlayer1({ ...player1, score: player1.score + 1 })
            else
                updatePlayer2({ ...player2, score: player2.score + 1 })

            resetBoard(setBoard)
            openModal()
            return
        }

        switchPlayer(currentPlayer, player1, player2, setCurrentPlayer)
    }

    function handleResetScore() {
        resetBoard(setBoard)
        updatePlayer1({ ...player1, score: 0 })
        updatePlayer2({ ...player2, score: 0 })
        closeModal()
    }

    function handleContinueGame() {
        closeModal()
    }

    return (
        <>
            <TicTacToeBoard label={label} handleCellClicked={handleCellClicked} board={board} currentMarker={currentPlayer.mark} />
            <GameInfoDialog isOpen={isOpen || false} closeModal={closeModal}>
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-center text-2xl font-semibold text-secondary'>
                        {currentPlayer.name} is the winner
                    </h1>
                    <Image alt="Celebration GIG" src="/celebration.gif" width={200} height={200} />
                    <div className='flex items-center space-x-5'>
                        <Button onClick={handleResetScore}>
                            Reset Score
                        </Button>
                        <Button variant='muted' onClick={handleContinueGame} >
                            Play Again
                        </Button>
                    </div>
                </div>


            </GameInfoDialog>
        </>
    )
}

export default LocalTicTacToe

// Function to switch the current player
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