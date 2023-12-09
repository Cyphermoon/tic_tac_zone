import React from 'react'
import UserAvatar from '../common/UserAvatar'

interface Props {
    name: string
    id: string
    mark: string
    wins: number
    loss: number
}

const PlayerCard = ({ name, id, mark, wins, loss }: Props) => {
    return (
        <section className='hidden lg:flex flex-col items-center bg-card rounded-2xl min-w-[300px] px-6 py-4 space-y-4'>
            <UserAvatar
                name={name}
                className='w-[165px] h-[165px] border-2 border-gray-300 p-2'
                id={id} />

            <h2 className='text-5xl capitalize font-bold text-accent'>{mark}</h2>

            <h4 className='text-4xl font-semibold'>{name}</h4>

            <div className='flex items-center space-x-12 justify-between'>
                <div className="text-center">
                    <span className='text-sm text-neutral-500'>Win</span>
                    <h3 className='text-xl font-medium'>{wins}</h3>
                </div>

                <div className="text-center">
                    <span className='text-sm text-neutral-500'>Loss</span>
                    <h3 className='text-xl font-medium'>{loss}</h3>
                </div>
            </div>
        </section>
    )
}

export default PlayerCard