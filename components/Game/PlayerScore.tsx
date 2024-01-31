import { useEffect } from 'react'
import { useGameMode, useGameRepresentation } from '../Home/store'
import { GamePlayerProps, OnlinePlayerProps } from '../Home/type'
import CircularBar from '../common/CircularBar'
import UserAvatar from '../common/UserAvatar'
import { increaseOtherPlayerScore, switchPlayer } from './util'

interface Props {
    imageURL?: string
    countdown?: number
    player1: GamePlayerProps
    player2: GamePlayerProps
    currentPlayer: GamePlayerProps | OnlinePlayerProps | undefined
    setCurrentPlayer: (player: GamePlayerProps) => void
}

const PlayerScore = ({ imageURL, countdown, player1, player2, currentPlayer, setCurrentPlayer }: Props) => {
    //local game state
    const timeLeft = useGameRepresentation(state => state.timer)
    const pauseGame = useGameRepresentation(state => state.pause)
    const matchRound = useGameRepresentation(state => state.round)
    const roundsToWin = useGameRepresentation(state => state.config?.roundsToWin || 1)
    const percentage = countdown && ((timeLeft || 0) / countdown) * 100
    const gameMode = useGameMode(state => state.gameMode)
    const distortedMode = useGameRepresentation(state => state.config?.distortedMode || false)
    const totalRounds = useGameRepresentation(state => state.totalRounds)

    // state setters
    const updatePlayer1 = useGameRepresentation(state => state.updatePlayer1)
    const updatePlayer2 = useGameRepresentation(state => state.updatePlayer2)
    const updateTimeLeft = useGameRepresentation(state => state.updateTimer)
    const updateMatchRound = useGameRepresentation(state => state.updateRound)
    const updateDistortedGhost = useGameRepresentation(state => state.updateDistortedGhost)
    const updateTotalRounds = useGameRepresentation(state => state.updateTotalRounds)

    function toggleDistorted() {
        updateDistortedGhost(true)

        setTimeout(() => {
            updateDistortedGhost(false)
        }, 1000)
    }

    useEffect(() => {
        if (timeLeft === undefined) return
        // Starts countdown immediately
        const interval = setInterval(() => {
            updateTimeLeft(timeLeft - 1)
        }, 1000)

        if (pauseGame) {
            clearInterval(interval)
            return
        }

        if (timeLeft === 0) {
            clearInterval(interval)

            updateTimeLeft(countdown || 10)
            updateTotalRounds(totalRounds + 1)
            currentPlayer && increaseOtherPlayerScore(currentPlayer, player1, player2, updatePlayer1, updatePlayer2)
            currentPlayer && switchPlayer(currentPlayer, player1, player2, setCurrentPlayer)

        }
        return () => {
            clearInterval(interval)
        }
    }, [timeLeft, currentPlayer, player1, player2, countdown, pauseGame, updateTimeLeft, updateMatchRound, matchRound, updatePlayer1, updatePlayer2, roundsToWin, setCurrentPlayer, updateTotalRounds, totalRounds])

    return (
        <section className={`bg-card p-5 rounded-2xl  max-w-xl ${countdown ? "w-full" : "w-fit"} lg:mx-auto flex items-center justify-between`}>

            {
                currentPlayer ?
                    <div className={`flex ${countdown ? "space-y-4  flex-col" : "space-x-4"} lg:flex-row items-center lg:space-y-0 lg:space-x-6`}>
                        <UserAvatar
                            name={currentPlayer.name}
                            id={currentPlayer.id}
                            imageUrl={imageURL}
                            className='w-[100px] h-[100px] lg:w-[130px] lg:h-[130px] border-2 border-gray-300 p-2' />

                        <div className='flex flex-col -mt-4 w-fit'>
                            <span className='text-sm text-center lg:text-left text-gray-500 font-light'>Current Player</span>
                            <h3 className='text-lg lg:text-2xl font-medium text-gray-700'>{currentPlayer.name}</h3>
                            {distortedMode && gameMode !== "ai" && <button className='px-2 py-1 rounded-xl text-sm bg-secondary text-primary' onClick={toggleDistorted}>Show Distorted</button>}

                        </div>
                    </div> :
                    <p>Loading Current Player.....</p>
            }
            {
                countdown &&

                <div className='flex flex-col items-center space-y-0.5 w-fit'>
                    <h6 className='font-light text-sm'>Timer</h6>
                    <CircularBar percentage={percentage || 0} radius={60} viewBoxDimension={150} text={`${timeLeft}s`} />
                </div>
            }

        </section>
    )
}

export default PlayerScore