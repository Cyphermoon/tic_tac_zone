import React, { useEffect, useState } from 'react'
import UserAvatar from '../common/UserAvatar'
import CircularBar from '../common/CircularBar'

interface Props {
    name: string
    imageURL?: string
    id: string
    countdown?: number
}

const PlayerScore = ({ name, id, imageURL, countdown }: Props) => {
    const [timeLeft, setTimeLeft] = useState(countdown)
    const percentage = countdown && ((timeLeft || 0) / countdown) * 100

    useEffect(() => {
        if (timeLeft === undefined) return
        // Starts countdown immediately
        const interval = setInterval(() => {
            setTimeLeft(timeLeft - 1)
        }, 1000)

        if (timeLeft === 0) {
            clearInterval(interval)
        }

        return () => {
            clearInterval(interval)
        }
    }, [timeLeft])

    return (
        <section className={`bg-card p-5 rounded-2xl  max-w-xl ${countdown ? "w-full" : "w-fit"} lg:mx-auto flex items-center justify-between`}>

            <div className={`flex ${countdown ? "space-y-4  flex-col" : "space-x-4"} lg:flex-row items-center lg:space-y-0 lg:space-x-6`}>
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