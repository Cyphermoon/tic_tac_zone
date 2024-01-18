import { _board } from '@/game_settings'
import { useModal } from '@/hooks/index.hook'
import Image from 'next/image'
import { useState } from 'react'
import { useGameRepresentation } from '../Home/store'
import { GamePlayerProps } from '../Home/type'
import Button from '../common/Button'
import GameInfoDialog from '../modals/GameInfoModal'
import TicTacToeBoard from './TicTacToeBoard'
import { BoardType } from './type'
import { checkWinner, isDraw, switchPlayer } from './util'

interface Props {
    label: string
    player1: GamePlayerProps
    player2: GamePlayerProps
    currentPlayer: GamePlayerProps
    setCurrentPlayer: (player: GamePlayerProps) => void
    countdown: number,
}

// Function to reset the game board
export const resetBoard = (setBoard: (board: BoardType) => void) => {
    setBoard(_board)
}

const LocalTicTacToe = ({ label, currentPlayer, player1, player2, setCurrentPlayer, countdown }: Props) => {
    const [board, setBoard] = useState(_board);
    const { isOpen, openModal, closeModal } = useModal(false)
    const { isOpen: drawModal, openModal: openDrawModal, closeModal: closeDrawModal } = useModal(false)
    const updatePlayer1 = useGameRepresentation(state => state.updatePlayer1)
    const updatePlayer2 = useGameRepresentation(state => state.updatePlayer2)
    const updateTimeLeft = useGameRepresentation(state => state.updateTimer)
    const updatePauseGame = useGameRepresentation(state => state.updatePause)

    // Function to handle cell click event
    function handleCellClicked(position: string) {
        if (board[position] !== '') return

        const newBoard = { ...board, [position]: currentPlayer.mark }

        updateTimeLeft(countdown)
        setBoard(newBoard)

        if (checkWinner(currentPlayer.mark, newBoard)) {
            if (currentPlayer.id === player1.id)
                updatePlayer1({ ...player1, score: player1.score + 1 })
            else
                updatePlayer2({ ...player2, score: player2.score + 1 })

            resetBoard(setBoard)
            updatePauseGame(true)
            openModal()
            return
        }

        if (isDraw(newBoard)) {
            resetBoard(setBoard)
            updatePauseGame(true)
            openDrawModal()
            return
        }

        switchPlayer(currentPlayer, player1, player2, setCurrentPlayer)
    }

    function handleResetScore() {
        resetBoard(setBoard)
        updatePlayer1({ ...player1, score: 0 })
        updatePlayer2({ ...player2, score: 0 })
        handleCloseModal()
        switchPlayer(currentPlayer, player1, player2, setCurrentPlayer)

    }

    function handleCloseModal() {
        closeModal()
        updatePauseGame(false)
        switchPlayer(currentPlayer, player1, player2, setCurrentPlayer)

    }

    function handleDrawDialogClose() {
        closeDrawModal()
        updatePauseGame(false)
        switchPlayer(currentPlayer, player1, player2, setCurrentPlayer)
    }

    return (
        <>
            <TicTacToeBoard label={label} handleCellClicked={handleCellClicked} board={board} currentMarker={currentPlayer.mark} />
            <GameInfoDialog isOpen={isOpen || false} closeModal={handleCloseModal}>
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-center text-2xl font-semibold text-secondary'>
                        {currentPlayer.name} is the winner
                    </h1>
                    <Image alt="Celebration GIF" src="/celebration.gif" width={200} height={200} />
                    <div className='flex items-center space-x-5'>
                        <Button onClick={handleResetScore}>
                            Reset Score
                        </Button>
                        <Button variant='muted' onClick={handleCloseModal} >
                            Play Again
                        </Button>
                    </div>
                </div>
            </GameInfoDialog>
            <GameInfoDialog isOpen={drawModal || false} closeModal={handleDrawDialogClose}>
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-center text-2xl font-semibold text-secondary'>
                        You both did well 🤨
                    </h1>
                    <span>This round is a draw</span>
                    <Image alt="Celebration GIF" src="/celebration.gif" width={200} height={200} />
                </div>
            </GameInfoDialog>
        </>
    )
}

export default LocalTicTacToe

// Function to switch the current player
