import { _board } from '@/game_settings'
import { useCallback, useEffect, useState } from 'react'
import { useGameRepresentation } from '../Home/store'
import { GamePlayerProps } from '../Home/type'
import { resetBoard } from './LocalTicTacToe'
import TicTacToeBoard from './TicTacToeBoard'
import { checkWinner, isDraw, minimax, switchPlayer } from './util'

interface Props {
    label: string
    currentPlayer: GamePlayerProps
    setCurrentPlayer: (player: GamePlayerProps) => void
    countdown: number,
    player1: GamePlayerProps
    player2: GamePlayerProps
}

const AiTicTacToe = ({ label, currentPlayer, countdown, player1, player2, setCurrentPlayer }: Props) => {
    const [board, setBoard] = useState(_board);
    const updatePlayer1 = useGameRepresentation(state => state.updatePlayer1)
    const updatePlayer2 = useGameRepresentation(state => state.updatePlayer2)
    const updateTimeLeft = useGameRepresentation(state => state.updateTimer)
    const updatePauseGame = useGameRepresentation(state => state.updatePause)
    const isAITurn = currentPlayer.id === player2.id
    const aiDifficulty = player2.difficulty

    // Handle cell clicked event
    const handleCellClicked = useCallback((position: string) => {
        if (board[position] !== '') return

        let newBoard = { ...board, [position]: currentPlayer.mark }

        updateTimeLeft(countdown)
        setBoard(newBoard)

        // Check for winner
        if (checkWinner(currentPlayer.mark, newBoard)) {
            if (currentPlayer.id === player1.id)
                updatePlayer1({ ...player1, score: player1.score + 1 })
            else
                updatePlayer2({ ...player2, score: player2.score + 1 })

            resetBoard(setBoard)
            updatePauseGame(true)
            return
        }

        // Check for draw
        if (isDraw(newBoard)) {
            resetBoard(setBoard)
            updatePauseGame(true)
            return
        }

        switchPlayer(currentPlayer, player1, player2, setCurrentPlayer)
    }, [board, countdown, currentPlayer, player1, player2, setCurrentPlayer, updatePauseGame, updatePlayer1, updatePlayer2, updateTimeLeft])

    // Handle easy AI move
    const handleEasyAiMove = useCallback(() => {
        let availablePositions = Object.keys(board).filter(position => board[position] === '')
        let randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)]

        return randomPosition
    }, [board])

    // Handle medium AI move
    const handleMediumAiMove = useCallback(() => {
        let availablePositions = Object.keys(board).filter(position => board[position] === "")
        let aiMove = null;

        for (let position of availablePositions) {
            let humanSimulationBoard = { ...board, [position]: player1.mark }
            let aiSimulationBoard = { ...board, [position]: player2.mark }

            // Check for winning move for AI
            if (checkWinner(player2.mark, aiSimulationBoard)) {
                console.log("Winning Move Found for AI")
                aiMove = position
                break
            }

            // Check for winning move for human
            if (checkWinner(player1.mark, humanSimulationBoard)) {
                aiMove = position
                console.log("Winning Move Found for Human")
            }
        }

        // If no winning move found, choose a random position
        if (!aiMove) {
            aiMove = availablePositions[Math.floor(Math.random() * availablePositions.length)]
        }

        return aiMove
    }, [board, player1.mark, player2.mark]);

    type Board = { [key: string]: string };
    type Player = { mark: string };



    const handleHardAiMove = useCallback(() => {
        let bestScore = -Infinity;
        let move: string = ""

        for (let position of Object.keys(board)) {
            if (board[position] === '') {
                board[position] = player2.mark;
                let score = minimax(board, false, player1, player2);
                board[position] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = position;
                }
            }
        }

        return move;
    }, [board, player1, player2]);

    useEffect(() => {
        // Perform AI move based on difficulty
        if (isAITurn && aiDifficulty === "easy") {
            handleCellClicked(handleEasyAiMove())
        } else if (isAITurn && aiDifficulty === "medium") {
            handleCellClicked(handleMediumAiMove())
        } else if (isAITurn && aiDifficulty === "hard") {
            handleCellClicked(handleHardAiMove())
        }
    }, [aiDifficulty, handleCellClicked, handleEasyAiMove, handleHardAiMove, handleMediumAiMove, isAITurn])

    return (
        <>
            <TicTacToeBoard label={label} handleCellClicked={handleCellClicked} board={board} currentMarker={currentPlayer.mark} />
        </>
    )
}

export default AiTicTacToe