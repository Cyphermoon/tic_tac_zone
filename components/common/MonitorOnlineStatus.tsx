"use client"
import React from 'react';
import { useCurrentPlayer } from '../Home/store';

interface Props {
    children: React.ReactNode
}

const MonitorOnlineStatus = ({ children }: Props) => {
    const currentId = useCurrentPlayer(state => state.id)
    const updatePlayerOnlineStatus = useCurrentPlayer(state => state.updateOnline)

    // useEffect(() => {
    //     console.log(window.navigator)
    //     const updateOnlineStatus = () => {
    //         console.log("status changed")
    //         const userRef = doc(firestoreDB, 'users', currentId);
    //         setDoc(userRef, { online: navigator.onLine }, { merge: true })
    //             .then(() => updatePlayerOnlineStatus(navigator.onLine))

    //     };

    //     window.addEventListener('online', updateOnlineStatus);
    //     window.addEventListener('offline', updateOnlineStatus);

    //     return () => {
    //         window.removeEventListener('online', updateOnlineStatus);
    //         window.removeEventListener('offline', updateOnlineStatus);
    //     };
    // }, [currentId, updatePlayerOnlineStatus]);
    return (
        <>
            {children}
        </>
    )
}

export default MonitorOnlineStatus