import { firestoreDB } from '@/firebase'
import { useModal } from '@/hooks/index.hook'
import { collection, query, where } from 'firebase/firestore'
import { useState } from 'react'
import { useCollectionData } from "react-firebase-hooks/firestore"
import UserAvatar from '../common/UserAvatar'
import PlayerChallengeModal from '../modals/PlayerChallengeModal'
import ProfileStatsCard from './ProfileStatsCard'
import { useCurrentPlayer } from './store'
import { PlayerCardProps, PlayerProps } from './type'
import { getUser } from './util'


type _CompactPlayerCard = Omit<PlayerCardProps, 'matches' | 'wins' | 'loss' | 'handleChallenge'>
type CompactPlayerCard = _CompactPlayerCard & { handleClick?: (id: string) => void }

interface Props {
    handleChallenge: (player: PlayerProps) => void
}


const OnlinePlayerOptions = ({ handleChallenge }: Props) => {
    const { isOpen, openModal, closeModal } = useModal(false)
    const currentId = useCurrentPlayer(state => state.id)
    const usersRef = query(collection(firestoreDB, "users"), where("id", "!=", currentId))

    const [players, loading, error] = useCollectionData(usersRef);
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerProps | null>(null)

    function handlePlayerSelected(id: string) {
        getUser({ id })
            .then(player => setSelectedPlayer(player as PlayerProps))
    }

    return (
        <>
            <section className='grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-4 lg:gap-8'>
                {loading && <h1>Loading Players ......</h1>}
                {!loading && players &&

                    players.map((player, i) => (
                        <div key={i} onClick={openModal} className='cursor-pointer'>
                            <PlayerCard
                                avatar={{ name: player.name, id: player.id }}
                                id={player.id}
                                online={player.online}
                                handleClick={handlePlayerSelected} />
                        </div>
                    ))
                }
            </section>

            {isOpen && selectedPlayer &&
                <PlayerChallengeModal closeModal={closeModal} isOpen={isOpen}>
                    <ProfileStatsCard
                        id={selectedPlayer.id}
                        name={selectedPlayer.name}
                        imageUrl={selectedPlayer.imageUrl}
                        matches={selectedPlayer.matches || 0}
                        win={selectedPlayer.win || 0}
                        loss={selectedPlayer.loss || 0}
                        online={true}
                        handleChallenge={() => handleChallenge(selectedPlayer)} />
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
                {/* <span>{online ? 'Online' : 'Offline'}</span> */}
                <div className='relative'>
                    {/* <div className={`${online ? "bg-green-400" : "bg-gray-400"} w-5 h-5 absolute rounded-full -right-4 top-1`} /> */}
                    <UserAvatar {...avatar} className='w-[120px] h-[120px]' />
                </div>
                <h2 className='font-bold text-xl'>{avatar.name}</h2>
            </div>

        </>
    )
}