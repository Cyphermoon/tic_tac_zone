
import React from 'react'
import { UserAvatarProps } from '../common/type'
import UserAvatar from '../common/UserAvatar'
import CircularBar from '../common/CircularBar'
import Button from '../common/Button'

interface Props {
    id: string
    avatar: UserAvatarProps
    matches: number
    wins: number
    loss: number
    handleChallenge?: () => void
    online?: boolean
}

interface StatsInfoProps {
    title: string
    value: string | number

}

const ProfileStatsCard = ({ avatar, matches, wins, loss, handleChallenge, online }: Props) => {

    const percentage = Math.round((wins / matches) * 100)

    return (
        <section className="bg-card p-5 w-full max-w-sm rounded-3xl flex flex-col items-start space-y-6">
            {handleChallenge &&
                <span className={`text-sm mx-auto ${online ? 'text-green-500' : 'text-secondary'}`}>
                    {online ? 'Online' : 'Offline'}
                </span>
            }

            <div className='flex items-center justify-between w-full space-x-6 mb-5'>
                <div className='text-center space-y-3'>
                    <UserAvatar {...avatar} className='w-[120px] h-[120px]' />
                    <h2 className='font-bold text-xl'>{avatar.name}</h2>
                </div>
                <div className='flex flex-col space-y-1.5 w-fit text-center'>
                    <span className='whitespace-nowrap text-sm'>Player Rating</span>
                    <CircularBar percentage={percentage || 0} radius={60} viewBoxDimension={150} text={`${percentage}%`} />
                </div>
            </div>
            <div className='flex items-center space-x-6'>
                <StatsInfo title='Matches' value={matches} />
                <StatsInfo title='Wins' value={wins} />
                <StatsInfo title='Loss' value={loss} />
            </div>

            {handleChallenge &&
                <Button disabled={!online} fullWidth onClick={handleChallenge}>Challenge</Button>
            }

        </section>
    )
}

export default ProfileStatsCard


export const StatsInfo = ({ title, value }: StatsInfoProps) => {
    return (
        <div className='flex flex-col space-y-3 text-secondary'>
            <h4 className='font-medium text-lg'>{title}</h4>
            <span className='text-sm'>{value}</span>
        </div>
    )
}