import { useModal } from '@/hooks/index.hook'
import React from 'react'
import UserAvatar from '../common/UserAvatar'
import PlayerChallengeModal from '../modals/PlayerChallengeModal'
import ProfileStatsCard from './ProfileStatsCard'
import { PlayerCardProps, SelectedPlayerType } from './type'


type _CompactPlayerCard = Omit<PlayerCardProps, 'matches' | 'wins' | 'loss' | 'handleChallenge'>
type CompactPlayerCard = _CompactPlayerCard & { handleClick?: (id: string) => void }

interface Props {
    handleChallenge: (id: string) => void
}

const players: SelectedPlayerType[] = [
    { avatar: { name: 'Kelvin', id: 'k-1' }, matches: 10, wins: 5, loss: 5, online: true, id: 'k-1' },
    { avatar: { name: 'Seun', id: 'seun-271' }, matches: 10, wins: 5, loss: 5, online: false, id: 'seun-271' },
    { avatar: { name: 'Cypher Moon', id: 'moon19' }, matches: 10, wins: 5, loss: 5, online: true, id: 'moon19' },
]

const OnlinePlayerOptions = ({ handleChallenge }: Props) => {
    const { isOpen, openModal, closeModal } = useModal(false)
    const [selectedPlayer, setSelectedPlayer] = React.useState<SelectedPlayerType | undefined>(undefined)

    function handlePlayerSelected(id: string) {
        setSelectedPlayer(() => players.find(player => player.id === id))
    }

    return (
        <>
            <section className='grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-4 lg:gap-8'>
                {players.map((player, i) => (
                    <div key={i} onClick={openModal} className='cursor-pointer'>
                        <PlayerCard {...player} handleClick={handlePlayerSelected} />
                    </div>
                ))}
            </section>

            {isOpen && selectedPlayer &&
                <PlayerChallengeModal closeModal={closeModal} isOpen={isOpen}>
                    <ProfileStatsCard {...selectedPlayer} handleChallenge={() => handleChallenge(selectedPlayer.id)} />
                </PlayerChallengeModal>
            }
        </>

    )
}

export default OnlinePlayerOptions


const PlayerCard = ({ avatar, online, handleClick, id }: CompactPlayerCard) => {
    return (
        <>
            <div
                className={`bg-card shadow-sm rounded-2xl py-3 px-12 flex flex-col items-center cursor-pointer space-y-10`}
                onClick={() => handleClick && handleClick(id)}>
                <span>{online ? 'Online' : 'Offline'}</span>
                <div className='relative'>
                    <div className={`${online ? "bg-green-400" : "bg-gray-400"} w-5 h-5 absolute rounded-full -right-4 top-1`} />
                    <UserAvatar {...avatar} className='w-[120px] h-[120px]' />
                </div>
                <h2 className='font-bold text-xl'>{avatar.name}</h2>
            </div>

        </>
    )
}