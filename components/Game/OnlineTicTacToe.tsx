import { firestoreDB } from '@/firebase'
import { _board } from '@/game_settings'
import Image from 'next/image'
import { useCurrentPlayer, useOnlineGameId } from '../Home/store'
import { GameHistoryProps, OnlineGameDataProps } from '../Home/type'
import Button from '../common/Button'
import GameInfoDialog from '../modals/GameInfoModal'
import TicTacToeBoard from './TicTacToeBoard'
import { BoardType } from './type'
import { checkWinner, isDraw, resetBoardOnline, resetScoreOnline, setOnlineWinner, switchOnlinePlayer, updatePlayerScore, updatePositionInFirestore } from './util'
import { Firestore, addDoc, collection, doc, increment, updateDoc } from 'firebase/firestore'
import { useEffect } from 'react'

interface Props {
    distortedMode: boolean
    gameRep: OnlineGameDataProps

}

// Function to reset the game board
export const resetBoard = (setBoard: (board: BoardType) => void) => {
    setBoard(_board)
}

const OnlineTicTacToe = ({ gameRep, distortedMode }: Props) => {
    const onlineGameId = useOnlineGameId(state => state.id)
    const currentPlayerId = useCurrentPlayer(state => state.id)
    const board = gameRep.board

    const handleCloseModal = () => {
        if (!onlineGameId) return
        resetBoardOnline(firestoreDB, onlineGameId, _board)
        resetScoreOnline(firestoreDB, onlineGameId)
        setOnlineWinner(firestoreDB, onlineGameId, null)
    }


    const handleCellClicked = async (position: string) => {
        // If the cell at the clicked position is not empty or if there is no online game ID, return
        if (board[position] !== '' || !onlineGameId) return

        // If the current player is not the one who is supposed to make the move, return
        if (gameRep.currentPlayer.id !== currentPlayerId) return

        // Update the specific position in the board in Firestore
        const newBoard = { ...board, [position]: gameRep.currentPlayer.mark }
        await updatePositionInFirestore(firestoreDB, onlineGameId, position, gameRep.currentPlayer.mark);

        // If the current player has won
        if (checkWinner(gameRep.currentPlayer.mark, newBoard)) {
            // If the current player is player 1
            if (gameRep.currentPlayer.id === gameRep.player1.id) {
                // Set player 1 as the winner in Firestore

                // Increase player 1's score
                let score = gameRep.player1.score + 1

                // If player 1's score is less than or equal to the number of rounds to win
                if (score <= gameRep.config.roundsToWin) {
                    // Update player 1's score in Firestore
                    await updatePlayerScore(firestoreDB, onlineGameId, "player1", score)
                }
                // If player 1's score is equal to or greater than the number of rounds to win
                if (score >= gameRep.config.roundsToWin) {
                    // Set player 1 as the winner in Firestore
                    await setOnlineWinner(firestoreDB, onlineGameId, gameRep.player1);

                    // Update the game history for both players
                    updateHistory(firestoreDB, gameRep.player1.id, {
                        opponent: gameRep.player2.name,
                        gameType: gameRep.config.currentBoardType.value,
                        firstToWin: gameRep.config.roundsToWin,
                        result: "Win",
                    });

                    updateHistory(firestoreDB, gameRep.player2.id, {
                        opponent: gameRep.player1.name,
                        gameType: gameRep.config.currentBoardType.value,
                        firstToWin: gameRep.config.roundsToWin,
                        result: "Loss",
                    });

                    // Update both player stats
                    updatePlayerStats(firestoreDB, gameRep.player1.id, true)

                    updatePlayerStats(firestoreDB, gameRep.player2.id, false);
                }
            } else {
                // If the current player is player 2

                // Increase player 2's score
                let score = gameRep.player2.score + 1

                // If player 2's score is less than or equal to the number of rounds to win
                if (score <= gameRep.config.roundsToWin) {
                    // Update player 2's score in Firestore
                    await updatePlayerScore(firestoreDB, onlineGameId, "player2", score)
                }
                // If player 2's score is equal to or greater than the number of rounds to win
                if (score >= gameRep.config.roundsToWin) {
                    // Set player 2 as the winner in Firestore
                    await setOnlineWinner(firestoreDB, onlineGameId, gameRep.player2);

                    // Update the game history for both players
                    updateHistory(firestoreDB, gameRep.player2.id, {
                        opponent: gameRep.player1.name,
                        gameType: gameRep.config.currentBoardType.value,
                        firstToWin: gameRep.config.roundsToWin,
                        result: "Win",
                    });

                    updateHistory(firestoreDB, gameRep.player1.id, {
                        opponent: gameRep.player2.name,
                        gameType: gameRep.config.currentBoardType.value,
                        firstToWin: gameRep.config.roundsToWin,
                        result: "Loss",
                    });

                    // Update both player stats
                    updatePlayerStats(firestoreDB, gameRep.player2.id, true);

                    updatePlayerStats(firestoreDB, gameRep.player1.id, false);
                }
            }

            // Reset the board in Firestore
            await resetBoardOnline(firestoreDB, onlineGameId, _board)
        }

        // If the game is a draw
        if (isDraw(newBoard)) await resetBoardOnline(firestoreDB, onlineGameId, _board)

        // Switch the current player
        switchOnlinePlayer(gameRep.currentPlayer, gameRep.player1, gameRep.player2, firestoreDB, onlineGameId)
    }

    return (
        <>
            <TicTacToeBoard distortedMode={distortedMode} label={gameRep.config.currentBoardType.value} handleCellClicked={handleCellClicked} board={board} currentMarker={gameRep.currentPlayer.mark} />

            {
                gameRep.winner && <GameInfoDialog isOpen={Boolean(gameRep.winner)} closeModal={handleCloseModal} showCloseButton={false}>
                    <div className='flex flex-col items-center justify-center'>
                        <h1 className='text-center text-2xl font-semibold text-secondary'>
                            {gameRep?.winner.name} humiliated {gameRep.winner.id === gameRep.player1.id ? gameRep.player2.name : gameRep.player1.name}
                        </h1>
                        <p className='text-center mt-4'>
                            Roses are red, violet are blue. {gameRep.winner.id === gameRep.player1.id ? gameRep.player2.name : gameRep.player1.name} you are meant to lose
                        </p>
                        <Image alt="Celebration GIF" src="/celebration.gif" width={200} height={200} />
                        <div className='flex items-center space-x-5'>
                            <Button disabled={gameRep.winner.id === currentPlayerId ? false : true} onClick={(e) => handleCloseModal()}>
                                Continue
                            </Button>
                        </div>
                    </div>
                </GameInfoDialog>
            }
        </>
    )
}

export default OnlineTicTacToe


export async function updateHistory(firestoreDB: Firestore, userId: string, game: GameHistoryProps) {
    const gameHistoryRef = collection(firestoreDB, 'users', userId, 'history');
    await addDoc(gameHistoryRef, game);
}
async function updatePlayerStats(firestoreDB: Firestore, userId: string, won: boolean) {
    const userRef = doc(firestoreDB, 'users', userId);

    if (won) {
        await updateDoc(userRef, {
            'matches': increment(1),
            'win': increment(1),
        });
    } else {
        await updateDoc(userRef, {
            'matches': increment(1),
            'loss': increment(1),
        });
    }
}