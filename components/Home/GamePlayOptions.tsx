import { DEFAULT_GAME_CONFIG, _board } from '@/game_settings';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import AiOptions from './AiOptions';
import LocalOption from './LocalOption';
import OnlinePlayerOptions from './OnlinePlayerOptions';
import { useAIDifficulty, useCurrentPlayer, useGameMode, useLocalPlayer, useOnlineGameId } from './store';
import { GameMode, LocalPlayersProps, OnlineGameDataProps, OnlinePlayerProps, PlayerProps } from './type';
import { createChat, updateOrGetGame } from './util';


interface TabProps {
    text: string;
    handleClick: (name: string) => void;
    tab: string;
    activeTab: string;
}

const GamePlayOptions = () => {
    const router = useRouter();
    const gameMode = useGameMode(state => state.gameMode)
    const [selectedTab, setSelectedTab] = useState(() => {
        if (gameMode) return gameMode
        return "online"
    });

    const updateGameMode = useGameMode(state => state.updateGameMode)
    const updateAIDifficulty = useAIDifficulty(state => state.updateAIDifficulty)
    const updateLocalPlayer = useLocalPlayer(state => state.updateLocalPlayer)
    const updateOnlineGameId = useOnlineGameId(state => state.updateOnlineGameId)
    const currentPlayer = useCurrentPlayer(state => state)

    function handleTabChange(tabName: any) {
        setSelectedTab(tabName)
    }

    function handleAiDifficultyChange(difficulty: string) {
        updateGameMode("ai")
        updateAIDifficulty(difficulty)
        router.push("/request")


    }

    async function handleChallenge(selectedPlayer: PlayerProps) {
        // create or get the current game  
        // update it locally
        const gameId = [currentPlayer.id, selectedPlayer.id].sort().join('-') + "-game";

        const { boardType, ...rest } = DEFAULT_GAME_CONFIG


        const gameData = {
            player1: {
                id: currentPlayer.id,
                name: currentPlayer.name,
                mark: "x",
                photoURL: currentPlayer.imageUrl,
                score: 0,
                online: currentPlayer.online,
                view: "edit",
            },
            player2: {
                id: selectedPlayer.id,
                name: selectedPlayer.name,
                mark: "o",
                photoURL: selectedPlayer.imageUrl,
                score: 0,
                online: selectedPlayer.online,
                view: "view"
            },
            board: _board,
            config: rest,
            currentPlayer: {
                id: currentPlayer.id,
                name: currentPlayer.name,
                mark: "x",
                photoURL: currentPlayer.imageUrl,
                score: 0,
                online: currentPlayer.online
            },
            boardOpened: true,
            isDraw: false,
            initiatingPlayerId: currentPlayer.id,
            pause: false,
            countdown: rest.timer,
            draws: 0,
            totalRounds: 0,
            winner: null
        }

        updateOrGetGame(gameId, gameData)
            .then(() => {
                updateGameMode("online")
                updateOnlineGameId(gameId)
            })
            .catch((err) => {
                console.error(err)
            })

        createChat(gameId, [currentPlayer.id, selectedPlayer.id])
            .then(() => {
                router.push("/request")
            })
            .catch((err) => {
                console.error(err)
            })
    }

    function handleLocalPlayerStart(players: LocalPlayersProps) {
        updateGameMode("local")
        updateLocalPlayer({
            name: players.player2.name,
            id: "player-2"
        })
        router.push("/request")
    }

    return (
        <div className=''>
            <h2 className='font-semibold text-2xl text-secondary mb-5'> Play Options </h2>

            <div className='flex items-center space-x-4 mb-8'>
                <Tab text="Online" handleClick={handleTabChange} tab="online" activeTab={selectedTab} />
                <Tab text="AI" handleClick={handleTabChange} tab="ai" activeTab={selectedTab} />
                <Tab text="Local" handleClick={handleTabChange} tab="local" activeTab={selectedTab} />
            </div>

            {selectedTab === "ai" && <AiOptions handleAiDifficultyChange={handleAiDifficultyChange} />}
            {selectedTab === "online" && <OnlinePlayerOptions handleChallenge={handleChallenge} />}
            {selectedTab === "local" && <LocalOption handleLocalPlayerStart={handleLocalPlayerStart} />}
        </div>
    );
}

const Tab = ({ text, handleClick, tab, activeTab }: TabProps) => {
    const isActive = activeTab === tab;

    return (
        <button className={`text-md transition-colors ${isActive ? "text-accent underline" : "text-secondary"}`} onClick={() => handleClick(tab)}>
            {text}
        </button>
    );
}

export default GamePlayOptions;