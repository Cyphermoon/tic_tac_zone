import React from 'react'
import { UserAvatarProps } from '../common/type'
import UserAvatar from '../common/UserAvatar'
import { AiCharacters } from '@/game_settings';

type Difficulty = "hard" | "medium" | "easy";

interface Props {
    handleAiDifficultyChange: (difficulty: Difficulty) => void;
}

interface AiCardProps {
    avatar: UserAvatarProps;
    difficulty: Difficulty;
    className?: string;
    handleAiDifficultyChange: (difficulty: Difficulty) => void;
}

const AiOptions = ({ handleAiDifficultyChange }: Props) => {
    return (
        <section className='grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 '>
            {AiCharacters.map((avatar, i) => (
                <AiCard
                    key={i}
                    avatar={avatar}
                    difficulty={avatar.difficulty as Difficulty}
                    handleAiDifficultyChange={handleAiDifficultyChange}
                />
            ))}

        </section>
    )
}

export default AiOptions

const AiCard = ({ avatar, difficulty, className = "", handleAiDifficultyChange }: AiCardProps) => {
    return (
        <div
            className={`bg-card shadow-sm rounded-2xl py-3 px-12 flex flex-col items-center cursor-pointer transition-transform duration-500 hover:-translate-y-5 space-y-10 ${className}`}
            onClick={() => handleAiDifficultyChange(difficulty)}>
            <span>{difficulty}</span>
            <UserAvatar {...avatar} className='w-[120px] h-[120px]' />
            <h2 className='font-bold text-xl'>{avatar.name}</h2>
        </div>
    )
}