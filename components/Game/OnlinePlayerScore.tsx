import { firestoreDB } from '@/firebase';
import { useEffect } from 'react';
import { useCurrentPlayer, useGameMode, useOnlineGameId } from '../Home/store';
import { OnlineGameDataProps } from '../Home/type';
import CircularBar from '../common/CircularBar';
import UserAvatar from '../common/UserAvatar';
import { increaseOtherPlayerOnlineScore, setTimer, switchOnlinePlayer, updateTotalRoundsOnline } from './util';

interface Props {
    game: OnlineGameDataProps;
    toggleDistortedMode: () => void;
}

const OnlinePlayerScore = ({ game, toggleDistortedMode }: Props) => {
    const onlineGameId = useOnlineGameId(state => state.id);
    const currentPlayerId = useCurrentPlayer(state => state.id);

    const countdown = game.countdown;
    const configTimer = game.config?.timer;
    const gameMode = useGameMode(state => state.gameMode);
    const percentage = countdown && ((countdown || 0) / configTimer) * 100;

    useEffect(() => {
        if (countdown === undefined || game.currentPlayer.id !== currentPlayerId) return;

        const interval = setInterval(() => {
            setTimer(firestoreDB, onlineGameId || "26", countdown - 1);
        }, 1000);

        if (game.pause) {
            clearInterval(interval);
            return;
        }

        if (countdown === 0) {
            clearInterval(interval);
            setTimer(firestoreDB, onlineGameId || "26", countdown || 10);
            increaseOtherPlayerOnlineScore(game.currentPlayer, game.player1, game.player2, firestoreDB, onlineGameId || "26");
            updateTotalRoundsOnline(onlineGameId, game.totalRounds + 1)
            switchOnlinePlayer(game.currentPlayer, game.player1, game.player2, firestoreDB, onlineGameId || "26");
        }

        return () => {
            clearInterval(interval);
        };
    }, [countdown, game.config.timer, game.pause, game.currentPlayer, game.player1, game.player2, onlineGameId, currentPlayerId, game.totalRounds]);

    return (
        <section className={`bg-card p-5 rounded-2xl  max-w-xl ${countdown ? "w-full" : "w-fit"} lg:mx-auto flex items-center justify-between`}>
            {game.currentPlayer ?
                <div className={`flex ${countdown ? "space-y-4  flex-col" : "space-x-4"} lg:flex-row items-center lg:space-y-0 lg:space-x-6`}>
                    <UserAvatar
                        name={game.currentPlayer.name}
                        id={game.currentPlayer.id}
                        className='w-[100px] h-[100px] lg:w-[130px] lg:h-[130px] border-2 border-gray-300 p-2' />

                    <div className='flex flex-col -mt-4 w-fit'>
                        <span className='text-sm text-center lg:text-left text-gray-500 font-light'>Current Player</span>
                        <h3 className='text-lg lg:text-2xl font-medium text-gray-700'>{game.currentPlayer.name}</h3>

                        {game.config.distortedMode && gameMode !== "ai" &&
                            <button
                                className='px-2 py-1 rounded-xl text-sm bg-secondary text-primary'
                                onClick={toggleDistortedMode}>
                                Show Distorted
                            </button>}
                    </div>
                </div> :
                <p>Loading Current Player.....</p>
            }
            {countdown &&
                <div className='flex flex-col items-center space-y-0.5 w-fit'>
                    <h6 className='font-light text-sm'>Timer</h6>
                    <CircularBar percentage={percentage || 0} radius={60} viewBoxDimension={150} text={`${countdown}s`} />
                </div>
            }
        </section>
    );
}

export default OnlinePlayerScore;