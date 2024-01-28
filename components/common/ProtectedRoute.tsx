import { firebaseAuth } from '@/firebase'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCurrentPlayer } from '../Home/store'
import { getUser } from '../Home/util'
import { PlayerProps } from '../Home/type'

interface Props {
    children: React.ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
    const [user, loading, error] = useAuthState(firebaseAuth)
    const updateCurrentPlayer = useCurrentPlayer(state => state.updateCurrentPlayer)
    const currentPlayerId = useCurrentPlayer(state => state.id)
    const route = useRouter()


    useEffect(() => {
        if (currentPlayerId !== "") return;

        if (!user && !loading) {
            route.push('/login')
        }

        else if (user && !loading) {
            getUser({ id: user?.uid || "" })
                .then(player => updateCurrentPlayer(player as PlayerProps))
        }

    }, [currentPlayerId, loading, route, updateCurrentPlayer, user])


    if (loading) return <h1>Loading...</h1>

    if (error) return <h1>{error.message}</h1>

    if (user) return <>{children}</>

}

export default ProtectedRoute