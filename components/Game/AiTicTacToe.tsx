import { _board } from '@/game_settings'
import { useModal } from '@/hooks/index.hook'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { useGameRepresentation } from '../Home/store'
import { GamePlayerProps } from '../Home/type'
import Button from '../common/Button'
import GameInfoDialog from '../modals/GameInfoModal'
import { resetBoard } from './LocalTicTacToe'
import TicTacToeBoard from './TicTacToeBoard'
import { handleCellClicked as _handleCellClicked, checkWinner, getAvailablePositions, minimax, switchPlayer } from './util'

interface Props {
    label: string
    currentPlayer: GamePlayerProps
    setCurrentPlayer: (player: GamePlayerProps) => void
    countdown: number,
    player1: GamePlayerProps
    player2: GamePlayerProps
}

const AiTicTacToe = ({ label, currentPlayer, countdown, player1, player2, setCurrentPlayer }: Props) => {
    const updatePlayer1 = useGameRepresentation(state => state.updatePlayer1)
    const updatePlayer2 = useGameRepresentation(state => state.updatePlayer2)
    const updateTimeLeft = useGameRepresentation(state => state.updateTimer)
    const updatePauseGame = useGameRepresentation(state => state.updatePause)
    const updateMatchRound = useGameRepresentation(state => state.updateRound)
    const updateDraws = useGameRepresentation(state => state.updateDraws)
    const updateTotalRounds = useGameRepresentation(state => state.updateTotalRounds)


    const roundsToWin = useGameRepresentation(state => state.config?.roundsToWin || 1)
    const totalRounds = useGameRepresentation(state => state.totalRounds)
    const draws = useGameRepresentation(state => state.draws || 0)

    const { isOpen, openModal, closeModal } = useModal(false)

    const [board, setBoard] = useState(_board);
    const [gameDraw, setGameDraw] = useState(false)
    const [gameWon, setGameWon] = useState(false)
    const [winner, setWinner] = useState<GamePlayerProps>()

    const isAITurn = currentPlayer.id === player2.id
    const aiDifficulty = player2.difficulty

    // Handle cell clicked event
    const handleCellClicked = useCallback(
        (position: string) => {
            return _handleCellClicked(
                position,
                board,
                currentPlayer,
                player1,
                player2,
                roundsToWin,
                countdown,
                draws,
                totalRounds,
                updateTimeLeft,
                setBoard,
                resetBoard,
                setWinner,
                updatePlayer1,
                updatePlayer2,
                updateDraws,
                updateTotalRounds,
                setCurrentPlayer
            );
        },
        [board, currentPlayer, player1, player2, roundsToWin, countdown, draws, totalRounds, updateTimeLeft, updatePlayer1, updatePlayer2, updateDraws, updateTotalRounds, setCurrentPlayer]
    );

    // Handle easy AI move
    const handleEasyAiMove = useCallback(() => {
        let availablePositions = getAvailablePositions(board)
        let randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)]
        return randomPosition
    }, [board])

    // Handle medium AI move
    const handleMediumAiMove = useCallback(() => {
        let availablePositions = getAvailablePositions(board)
        let aiMove = null;

        for (let position of availablePositions) {
            let humanSimulationBoard = { ...board, [position]: player1.mark }
            let aiSimulationBoard = { ...board, [position]: player2.mark }

            // Check for winning move for AI
            if (checkWinner(player2.mark, aiSimulationBoard)) {
                aiMove = position
                break
            }

            // Check for winning move for human
            if (checkWinner(player1.mark, humanSimulationBoard)) {
                aiMove = position
            }
        }

        // If no winning move found, choose a random position
        if (!aiMove) {
            aiMove = availablePositions[Math.floor(Math.random() * availablePositions.length)]
        }

        return aiMove
    }, [board, player1.mark, player2.mark]);

    // Handle hard AI move
    const handleHardAiMove = useCallback(() => {
        // Get available positions
        const availablePositions = getAvailablePositions(board).length
        let move

        // Assign random position if board is empty otherwise use minimax algorithm
        if (availablePositions === 9) {
            move = handleEasyAiMove()
        } else {
            move = minimax(board, true, player1, player2)["position"]
        }

        // Ensure move is a string
        if (typeof move === "string")
            return move;

        return ""
    }, [board, handleEasyAiMove, player1, player2]);

    // Handle closing the game info modal
    function handleCloseModal(turn: "human" | "ai" | "switch" = "switch") {
        // Reset board and update player score  
        closeModal()
        setGameDraw(false)
        setGameWon(false)
        updatePauseGame(false)
        updateMatchRound(0)
        updateTotalRounds(0)
        updateDraws(0)
        resetBoard(setBoard)
        updatePlayer1({ ...player1, score: 0 })
        updatePlayer2({ ...player2, score: 0 })

        // Switch player turn based on the provided parameter
        if (turn === "switch") {
            switchPlayer(currentPlayer, player1, player2, setCurrentPlayer)
        } else if (turn === "human") {
            setCurrentPlayer(player1)
        } else if (turn === "ai") {
            setCurrentPlayer(player2)
        }
    }

    useEffect(() => {
        // Check if a player has won the game
        if (player1.score >= roundsToWin || player2.score >= roundsToWin) {
            updatePauseGame(true)
            openModal()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [player1.score, player2.score, roundsToWin])

    // Perform AI move based on difficulty
    useEffect(() => {
        if (isAITurn && aiDifficulty === "easy") {
            handleCellClicked(handleEasyAiMove())
        } else if (isAITurn && aiDifficulty === "medium") {
            handleCellClicked(handleMediumAiMove())
        } else if (isAITurn && aiDifficulty === "hard") {
            handleCellClicked(handleHardAiMove())
        }
    }, [aiDifficulty, gameDraw, gameWon, handleCellClicked, handleEasyAiMove, handleHardAiMove, handleMediumAiMove, isAITurn])


    return (
        <>
            <TicTacToeBoard
                label={label}
                handleCellClicked={handleCellClicked}
                board={board}
                currentMarker={currentPlayer.mark}
                distortedMode={false}
                distortedGhost={false} />

            <GameInfoDialog isOpen={isOpen || false} closeModal={handleCloseModal}>
                {winner &&
                    <div className='flex flex-col items-center justify-center'>
                        <h1 className='text-center text-2xl font-semibold text-secondary'>
                            {
                                !gameDraw ?
                                    `${winner.name} is the winner` :
                                    `It's a draw`
                            }
                        </h1>
                        {winner.id === player2.id && player2.difficulty === "hard" && <span>You {"can't"} really beat me. The best you can get is a draw </span>}
                        <Image alt="Celebration GIF" src="/celebration.gif" width={200} height={200} />
                        <div className='flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-5'>
                            <Button variant='muted' onClick={() => handleCloseModal("human")} >
                                Take Next Turn
                            </Button>
                            <Button onClick={() => handleCloseModal("ai")} >
                                Give {player2.name} Next Turn
                            </Button>
                        </div>
                    </div>
                }
            </GameInfoDialog>
        </>
    )
}

export default AiTicTacToe