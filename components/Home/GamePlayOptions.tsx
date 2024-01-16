import React, { useState } from 'react';
import AiOptions from './AiOptions';
import OnlinePlayerOptions from './OnlinePlayerOptions';
import LocalOption from './LocalOption';
import { LocalPlayersProps } from './type';

interface TabProps {
    text: string;
    handleClick: (name: string) => void;
    tab: string;
    activeTab: string;
}

const GamePlayOptions = () => {
    const [selectedTab, setSelectedTab] = useState("online");

    function handleTabChange(tabName: string) {
        setSelectedTab(tabName)
    }

    function handleAiDifficultyChange(difficulty: string) {
        console.log(difficulty)
    }

    function handleChallenge(id: string) {
        console.log(id, " has been challenged")
    }

    function handleLocalPlayerStart(players: LocalPlayersProps) {
        console.log(players)
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