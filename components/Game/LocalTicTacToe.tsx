import { _board } from '@/game_settings'
import { useModal } from '@/hooks/index.hook'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { useGameRepresentation } from '../Home/store'
import { GamePlayerProps } from '../Home/type'
import Button from '../common/Button'
import GameInfoDialog from '../modals/GameInfoModal'
import TicTacToeBoard from './TicTacToeBoard'
import { BoardType } from './type'
import { handleCellClicked as _handleCellClicked, switchPlayer } from './util'

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

    const roundsToWin = useGameRepresentation(state => state.config?.roundsToWin || 1)
    const [winner, setWinner] = useState<GamePlayerProps>()

    const updatePlayer1 = useGameRepresentation(state => state.updatePlayer1)
    const updatePlayer2 = useGameRepresentation(state => state.updatePlayer2)
    const updateTimeLeft = useGameRepresentation(state => state.updateTimer)
    const updatePauseGame = useGameRepresentation(state => state.updatePause)

    // Function to handle cell click event
    const handleCellClicked = useCallback((position: string) => {
        return _handleCellClicked(position, board, currentPlayer, player1, player2, roundsToWin, countdown, updateTimeLeft, setBoard, resetBoard, setWinner, updatePlayer1, updatePlayer2, setCurrentPlayer)

    }, [board, currentPlayer, player1, player2, roundsToWin, countdown, updateTimeLeft, updatePlayer1, updatePlayer2, setCurrentPlayer]);


    function handleDrawDialogClose() {
        closeDrawModal()
        resetBoard(setBoard)
        updatePauseGame(false)
        switchPlayer(currentPlayer, player1, player2, setCurrentPlayer)
    }

    function handleCloseModal(turn: "player1" | "player2" | "switch" = "switch") {
        // Reset board and update player score  
        closeModal()
        updatePauseGame(false)
        resetBoard(setBoard)
        updatePlayer1({ ...player1, score: 0 })
        updatePlayer2({ ...player2, score: 0 })

        // Switch player turn based on the provided parameter
        if (turn === "switch") {
            switchPlayer(currentPlayer, player1, player2, setCurrentPlayer)
        } else if (turn === "player1") {
            setCurrentPlayer(player1)
        } else if (turn === "player2") {
            setCurrentPlayer(player2)
        }
    }

    useEffect(() => {
        if (player1.score >= roundsToWin || player2.score >= roundsToWin) {
            updatePauseGame(true)
            openModal()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [player1.score, player2.score, roundsToWin])

    return (
        <>
            <TicTacToeBoard label={label} handleCellClicked={handleCellClicked} board={board} currentMarker={currentPlayer.mark} />
            {
                winner && <GameInfoDialog isOpen={isOpen || false} closeModal={handleCloseModal}>
                    <div className='flex flex-col items-center justify-center'>
                        <h1 className='text-center text-2xl font-semibold text-secondary'>
                            {winner.name} is one of the best 🎉
                        </h1>
                        <Image alt="Celebration GIF" src="/celebration.gif" width={200} height={200} />
                        <div className='flex items-center space-x-5'>
                            <Button onClick={(e) => handleCloseModal("player1")}>
                                {player1.name} Turn?
                            </Button>
                            <Button variant='muted' onClick={(e) => handleCloseModal("player2")} >
                                {player2.name} Turn?
                            </Button>
                        </div>
                    </div>
                </GameInfoDialog>
            }

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
