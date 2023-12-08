import React from 'react'
import UserAvatar from '../common/UserAvatar'

interface Props {
    name: string
    imageURL?: string
    id: string
}

const PlayerScore = ({ name, id, imageURL }: Props) => {
    return (
        <section className='bg-card p-5 rounded-lg w-full max-w-md lg:mx-auto flex items-center justify-between'>

            <div className='flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6'>
                <UserAvatar
                    name={name}
                    id={id}
                    imageUrl={imageURL}
                    className='w-[100px] h-[100px] lg:w-[130px] lg:h-[130px] border-2 border-gray-300 p-2' />

                <div className='flex flex-col -mt-4 w-fit'>
                    <span className='text-sm text-center lg:text-left text-gray-500 font-light'>Current Player</span>
                    <h3 className='text-lg lg:text-2xl font-medium text-gray-700'>{name}</h3>
                </div>
            </div>

            <div>
                <h1>Timer</h1>
            </div>

        </section>
    )
}

export default PlayerScore