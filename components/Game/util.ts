import { Firestore, addDoc, collection, doc, increment, updateDoc } from "firebase/firestore"
import { GameHistoryProps, GamePlayerProps, GameRepresentationStateProps, OnlinePlayerProps } from "../Home/type"
import { BoardType } from "./type"
import seedrandom from "seedrandom"
import { firestoreDB } from "@/firebase"

// Function to switch the current player
export function switchPlayer(
    currentPlayer: GamePlayerProps,
    player1: GamePlayerProps,
    player2: GamePlayerProps,
    setCurrentPlayer: (player: GamePlayerProps) => void,
    finalWinner: boolean = false
) {
    if (finalWinner) return

    if (currentPlayer.id === player1.id) {
        setCurrentPlayer(player2)
    } else {
        setCurrentPlayer(player1)
    }
}

// Function to increase the score of the other player
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

// Function to check if the game is a draw
export function isDraw(board: BoardType) {
    return Object.values(board).every(cell => cell !== '')
}

// Function to shuffle an array using a seed
export function shuffleArray(board: string[], seed: string | number) {
    const rng = seedrandom(seed.toString()); // Create a new seeded random number generator
    let m = board.length;
    let t, i 
    while (m) { 
        i = Math.floor(rng() * m--); 
        t = board[m]; 
        board[m] = board[i];
        board[i] = t;
    }
    return board;
}

// Interface for the MiniMax algorithm
export interface MiniMaxProps {
    score: number,
    position: string | null
}

// MiniMax algorithm implementation
export const minimax = (board: BoardType, isMaximizingPlayer: boolean, player1: GamePlayerProps, player2: GamePlayerProps): MiniMaxProps => {
    if (checkWinner(player1.mark, board)) {
        return { score: -1, position: null };
    } else if (checkWinner(player2.mark, board)) {
        return { score: 1, position: null };
    } else if (isDraw(board)) {
        return { score: 0, position: null };
    }

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        let bestPosition = null

        for (let position of Object.keys(board)) {
            if (board[position] === '') {
                board[position] = player2.mark;
                let state = minimax(board, false, player1, player2);
                board[position] = '';

                if (state.score > bestScore) {
                    bestScore = state.score
                    bestPosition = position
                }
            }
        }
        return { score: bestScore, position: bestPosition };

    } else {
        let bestScore = Infinity;
        let bestPosition = null

        for (let position of Object.keys(board)) {
            if (board[position] === '') {
                board[position] = player1.mark;
                let state = minimax(board, true, player1, player2);
                board[position] = '';

                if (state.score < bestScore) {
                    bestScore = state.score
                    bestPosition = position
                }
            }
        }
        return { score: bestScore, position: bestPosition };
    }
}

// Function to get the available positions on the board
export function getAvailablePositions(board: BoardType) {
    return Object.keys(board).filter(key => board[key] === '')
}

// Function to handle cell clicked event
export const handleCellClicked = (
    position: string,
    board: BoardType,
    currentPlayer: GamePlayerProps,
    player1: GamePlayerProps,
    player2: GamePlayerProps,
    roundsToWin: number,
    countdown: number,
    draws: number,
    totalRounds: number,
    updateTimeLeft: GameRepresentationStateProps["updateTimer"],
    setBoard: (board: BoardType) => void,
    resetBoard: (setBoard: (board: BoardType) => void) => void,
    setWinner: (player: GamePlayerProps | undefined) => void,
    updatePlayer1: Function,
    updatePlayer2: GameRepresentationStateProps["updatePlayer2"],
    updateDraws: GameRepresentationStateProps["updateDraws"],
    updateTotalRounds: GameRepresentationStateProps["updateTotalRounds"],
    setCurrentPlayer: (player: GamePlayerProps) => void
) => {
    if (board[position] !== '') return

    let newBoard = { ...board, [position]: currentPlayer.mark }
    // Update board
    updateTimeLeft(countdown)
    setBoard(newBoard)

    // Check for winner and update player score
    if (checkWinner(currentPlayer.mark, newBoard)) {
        updateTotalRounds(totalRounds + 1)

        if (currentPlayer.id === player1.id) {
            setWinner(player1)
            let score = player1.score + 1
            if (score <= roundsToWin)
                updatePlayer1({ ...player1, score })
        } else {
            setWinner(player2)
            let score = player2.score + 1
            if (score <= roundsToWin)
                updatePlayer2({ ...player2, score })
        }

        resetBoard(setBoard)
    }

    // Check for draw
    if (isDraw(newBoard)) {
         updateTotalRounds(totalRounds + 1)
        resetBoard(setBoard)
        updateDraws(draws + 1)
    }

    // Switch to the other player
    switchPlayer(currentPlayer, player1, player2, setCurrentPlayer)
}



//* ONLINE GAME FUNCTIONS

export async function setTimer(firestoreDB: Firestore, gameId: string, newTime: number) {
    const gameRef = doc(firestoreDB, 'games', gameId);
    await updateDoc(gameRef, {
        'countdown': newTime
    });
}

export async function updatePlayerScore(firestoreDB: Firestore, gameId: string, playerField: string, newScore: number) {
    const gameRef = doc(firestoreDB, 'games', gameId);
    await updateDoc(gameRef, {
        [`${playerField}.score`]: newScore
    });
}

export async function increaseOtherPlayerOnlineScore(
    currentPlayer: OnlinePlayerProps,
    player1: OnlinePlayerProps,
    player2: OnlinePlayerProps,
    firestoreDB: Firestore,
    gameId: string
) {
    const gameRef = doc(firestoreDB, 'games', gameId);

    if (currentPlayer.id === player1.id) {
        let newScore = player2.score + 1;
        await updateDoc(gameRef, {
            'player2.score': newScore
        });
    } else {
        let newScore = player1.score + 1;
        await updateDoc(gameRef, {
            'player1.score': newScore
        });
    }
}

export async function setCurrentPlayerOnline(firestoreDB: Firestore, gameId: string, currentPlayerId: OnlinePlayerProps) {
    const gameRef = doc(firestoreDB, 'games', gameId);
    await updateDoc(gameRef, {
        'currentPlayer': currentPlayerId
    });
}

export function switchOnlinePlayer(
    currentPlayer: OnlinePlayerProps,
    player1: OnlinePlayerProps,
    player2: OnlinePlayerProps,
    firestoreDB: Firestore,
    gameId: string,
    finalWinner: boolean = false
) {
    if (finalWinner) return

    if (currentPlayer.id === player1.id) {
        setCurrentPlayerOnline(firestoreDB, gameId, player2);
    } else {
        setCurrentPlayerOnline(firestoreDB, gameId, player1);
    }
}


export async function updatePositionInFirestore(firestoreDB: Firestore, gameId: string, position: string, mark: string) {
    const gameRef = doc(firestoreDB, 'games', gameId);
    await updateDoc(gameRef, {
        [`board.${position}`]: mark
    });
}


// Function to reset the board in Firestore
export async function resetBoardOnline(firestoreDB: Firestore, gameId: string, defaultBoard: BoardType) {
    const gameRef = doc(firestoreDB, 'games', gameId);
    await updateDoc(gameRef, {
        'board': defaultBoard
    });
}

export async function setOnlineWinner(firestoreDB: Firestore, gameId: string, winner: OnlinePlayerProps | null) {
    const gameRef = doc(firestoreDB, 'games', gameId);
    await updateDoc(gameRef, {
        'winner': winner
    });
}

// Function to reset the scores online
export async function resetScoreOnline(firestoreDB: Firestore, gameId: string) {
    const gameRef = doc(firestoreDB, 'games', gameId);
    await updateDoc(gameRef, {
        'player1.score': 0,
        'player2.score': 0
    });
}


export async function updateHistory(firestoreDB: Firestore, userId: string, game: GameHistoryProps) {
    const gameHistoryRef = collection(firestoreDB, 'users', userId, 'history');
    await addDoc(gameHistoryRef, game);
}

export async function updatePlayerStats(firestoreDB: Firestore, userId: string, won: boolean) {
    const userRef = doc(firestoreDB, 'users', userId);

    if (won) {
        await updateDoc(userRef, {
            'matches': increment(1),
            'win': increment(1),
        })
    } else {
        await updateDoc(userRef, {
            'matches': increment(1),
            'loss': increment(1),
        })
    }
}

export async function pauseGame(firestoreDB: Firestore, gameId: string, pause: boolean) {
    const gameRef = doc(firestoreDB, 'games', gameId);

    await updateDoc(gameRef, {
        'pause': pause
    });
}


export const updateOnlineGame = async (id: string | null, field: string, value: any) => {
    if (id) {
        const gameRef = doc(firestoreDB, 'games', id);
        await updateDoc(gameRef, { [`config.${field}`]: value });
    }
};

export const updateTotalRoundsOnline = async (id: string | null, totalRounds: number) => {
    if (id) {
        const gameRef = doc(firestoreDB, 'games', id);
        await updateDoc(gameRef, { 'totalRounds': totalRounds });
    }
};

export const updateOnlineDraws = async (id: string | null, draws: number) => {
    if (id) {
        const gameRef = doc(firestoreDB, 'games', id);
        await updateDoc(gameRef, { 'draws': draws });
    }
};