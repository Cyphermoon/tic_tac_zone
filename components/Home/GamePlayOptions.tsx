import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AiOptions from './AiOptions';
import LocalOption from './LocalOption';
import OnlinePlayerOptions from './OnlinePlayerOptions';
import { useAIDifficulty, useGameMode, useLocalPlayer } from './store';
import { LocalPlayersProps } from './type';

interface TabProps {
    text: string;
    handleClick: (name: string) => void;
    tab: string;
    activeTab: string;
}

const GamePlayOptions = () => {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState("online");

    const updateGameMode = useGameMode(state => state.updateGameMode)
    const updateAIDifficulty = useAIDifficulty(state => state.updateAIDifficulty)
    const updateLocalPlayer = useLocalPlayer(state => state.updateLocalPlayer)

    function handleTabChange(tabName: string) {
        setSelectedTab(tabName)
    }

    function handleAiDifficultyChange(difficulty: string) {
        updateGameMode("ai")
        updateAIDifficulty(difficulty)
        router.push("/request")


    }

    function handleChallenge(id: string) {
        updateGameMode("online")
        router.push("/request")
    }

    function handleLocalPlayerStart(players: LocalPlayersProps) {
        // TODO: generate random id for player 2

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