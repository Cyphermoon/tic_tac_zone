import { isPlural } from '@/hooks/index.hook'
import React from 'react'
import UserAvatar from '../common/UserAvatar'

type playerProps = {
    id: string
    name: string
    score: number,
    imageURL?: string
    mark: string
}

interface Props {
    rounds: number,
    draws: number
    player1: playerProps,
    player2: playerProps
    bestOf?: number
}

const ScoreBoard = ({ rounds, draws, player1, player2, bestOf }: Props) => {
    return (
        <section className='bg-card py-4 px-8 rounded-2xl w-full max-w-md space-y-10'>
            <div className='bg-neutral-200 rounded-lg px-5 py-1.5 w-fit mx-auto flex items-center space-x-2'>
                <span>{rounds} round{isPlural(rounds) ? "s" : ""}</span>
                {draws !== 0 && <span className='text-sm text-neutral-600'>({draws} draw{isPlural(draws) ? "s" : ""})</span>}
            </div>

            <div className='flex justify-between items-center'>
                <Profile id={player1.id} name={player1.name} score={player1.score} imageURL={player1.imageURL} mark={player1.mark} />
                <h2 className={`text-3xl lg:text-6xl font-bold font-mono`}>VS</h2>
                <Profile id={player2.id} name={player2.name} score={player2.score} imageURL={player2.imageURL} mark={player2.mark} />
            </div>
            {
                bestOf &&
                <span className='text-sm text-accent text-center block'>
                    First to {bestOf} Wins
                </span>
            }

        </section>
    )
}

export default ScoreBoard

export const Profile = ({ name, imageURL, score, id, mark }: playerProps) => {
    return (
        <div className='flex flex-col items-center space-y-8'>
            <div className='flex flex-col items-center'>
                <UserAvatar name={name} id={id} imageUrl={imageURL} className='w-[66px] h-[66px] border-2 border-neutral-300' />
                <span className='text-gray-400 text-lg'>{mark}</span>
                <h4 className='font-normal lg:font-medium'>{name}</h4>
            </div>

            <h1 className='text-5xl lg:text-[79px] font-medium'>
                {score}
            </h1>

            <span className='text-sm text-neutral-500'>
                Win{isPlural(score) ? "s" : ""}
            </span>
        </div>
    )
}