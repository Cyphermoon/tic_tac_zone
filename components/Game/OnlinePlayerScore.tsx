import { firestoreDB } from '@/firebase'
import { Firestore, doc, updateDoc } from 'firebase/firestore'
import { use, useEffect, useState } from 'react'
import { useGameMode, useGameRepresentation, useOnlineGameId } from '../Home/store'
import { OnlineGameDataProps, OnlinePlayerProps } from '../Home/type'
import CircularBar from '../common/CircularBar'
import UserAvatar from '../common/UserAvatar'

interface Props {
    game: OnlineGameDataProps
}

const OnlinePlayerScore = ({ game }: Props) => {
    const onlineGameId = useOnlineGameId(state => state.id)

    //online game state
    const countdown = game.countdown
    const configTimer = game.config?.timer
    const matchRound = useGameRepresentation(state => state.round)
    const roundsToWin = useGameRepresentation(state => state.config?.roundsToWin || 1)
    const percentage = countdown && ((countdown || 0) / configTimer) * 100
    const gameMode = useGameMode(state => state.gameMode)
    const [distortedMode, setDistortedMode] = useState(game.config.distortedMode);


    const toggleDistorted = () => {
        setDistortedMode(true);

        // Automatically turn off distortedMode after 2 seconds
        setTimeout(() => {
            setDistortedMode(false);
        }, 2000);
    };

    useEffect(() => {
        console.log("percentage", percentage, "configTimer", configTimer, "countdown", countdown)
    })

    useEffect(() => {
        if (countdown === undefined) return
        // Starts countdown immediately
        const interval = setInterval(() => {
            setTimer(firestoreDB, onlineGameId || "26", countdown - 1)
        }, 1000)

        if (game.pause) {
            clearInterval(interval)
            return
        }

        if (countdown === 0) {
            clearInterval(interval)

            // reset timer and increase other player score
            setTimer(firestoreDB, onlineGameId || "26", countdown || 10)
            increaseOtherPlayerScore(game.currentPlayer, game.player1, game.player2, firestoreDB, onlineGameId || "26")
            switchPlayer(game.currentPlayer, game.player1, game.player2, firestoreDB, onlineGameId || "26")

        }
        return () => {
            clearInterval(interval)
        }
    }, [countdown, matchRound, roundsToWin, game.config?.timer, game.pause, game.currentPlayer, game.player1, game.player2, onlineGameId])

    return (
        <section className={`bg-card p-5 rounded-2xl  max-w-xl ${countdown ? "w-full" : "w-fit"} lg:mx-auto flex items-center justify-between`}>

            {
                game.currentPlayer ?
                    <div className={`flex ${countdown ? "space-y-4  flex-col" : "space-x-4"} lg:flex-row items-center lg:space-y-0 lg:space-x-6`}>
                        <UserAvatar
                            name={game.currentPlayer.name}
                            id={game.currentPlayer.id}
                            className='w-[100px] h-[100px] lg:w-[130px] lg:h-[130px] border-2 border-gray-300 p-2' />

                        <div className='flex flex-col -mt-4 w-fit'>
                            <span className='text-sm text-center lg:text-left text-gray-500 font-light'>Current Player</span>
                            <h3 className='text-lg lg:text-2xl font-medium text-gray-700'>{game.currentPlayer.name}</h3>
                            {distortedMode && gameMode !== "ai" && <button className='px-2 py-1 rounded-xl text-sm bg-secondary text-primary' onClick={toggleDistorted}>Show Distorted</button>}

                        </div>
                    </div> :
                    <p>Loading Current Player.....</p>
            }
            {
                countdown &&

                <div className='flex flex-col items-center space-y-0.5 w-fit'>
                    <h6 className='font-light text-sm'>Timer</h6>
                    <CircularBar percentage={percentage || 0} radius={60} viewBoxDimension={150} text={`${countdown}s`} />
                </div>
            }

        </section>
    )
}

export default OnlinePlayerScore


// Utility firestore functions

async function setTimer(firestoreDB: Firestore, gameId: string, newTime: number) {
    const gameRef = doc(firestoreDB, 'games', gameId);
    await updateDoc(gameRef, {
        'countdown': newTime
    });
}

async function updatePlayerScore(firestoreDB: Firestore, gameId: string, playerField: string, newScore: number) {
    const gameRef = doc(firestoreDB, 'games', gameId);
    await updateDoc(gameRef, {
        [`${playerField}.score`]: newScore
    });
}

export async function increaseOtherPlayerScore(
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

async function setCurrentPlayerOnline(firestoreDB: Firestore, gameId: string, currentPlayerId: OnlinePlayerProps) {
    const gameRef = doc(firestoreDB, 'games', gameId);
    await updateDoc(gameRef, {
        'currentPlayerId': currentPlayerId
    });
}

export function switchPlayer(
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