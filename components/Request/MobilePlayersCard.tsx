import React from 'react'
import UserAvatar from '../common/UserAvatar'
import Button from '../common/Button'
import { ViewModeType } from './type'

interface Player {
    name: string
    id: string
    mark: string
}

interface Props {
    players: Player[]
    startGame: () => void
    mode: ViewModeType
}

const MobilePlayersCard = ({ players, startGame, mode }: Props) => {
    return (
        <section className='bg-card rounded-2xl w-full max-w-sm p-4 lg:hidden'>
            <div className="flex items-center justify-between space-x-4">
                <PlayerCard player={players[0]} />
                <h3 className='text-xl font-bold font-mono' key={`visual`}>VS</h3>
                <PlayerCard player={players[1]} />

            </div>

            {/* {
                mode === "edit" &&
                <Button className='mx-auto !mt-6 !block' onClick={startGame} >
                    Start Game
                </Button>
            } */}

        </section>
    )
}

const PlayerCard = ({ player }: { player: Player }) => {
    return (
        <div className='flex flex-col items-center space-y-4'>
            <UserAvatar
                name={player.name}
                className='w-[80px] h-[80px] border-2 border-gray-300 p-2'
                id={player.id} />

            <h2 className='text-2xl capitalize font-bold text-accent'>{player.mark}</h2>

            <h4 className='text-lg font-normal text-center'>{player.name}</h4>
        </div>
    )
}


export default MobilePlayersCard