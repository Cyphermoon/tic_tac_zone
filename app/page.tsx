"use client"
import GameHistory from "@/components/Home/GameHistory";
import GamePlayOptions from "@/components/Home/GamePlayOptions";
import ProfileStats from "@/components/Home/ProfileStatsCard";
import { useCurrentPlayer } from "@/components/Home/store";
import { OnlinePlayerProps } from "@/components/Home/type";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import MonitorOnlineStatus from "@/components/common/MonitorOnlineStatus";
import Navbar from "@/components/common/Navbar";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { firebaseAuth, firestoreDB } from "@/firebase";
import { signOut } from "firebase/auth";
import { DocumentData, DocumentReference, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useDocumentData } from "react-firebase-hooks/firestore";


export default function Home() {
    const currentPlayerId = useCurrentPlayer(state => state.id)
    const currentPlayerRef = doc(firestoreDB, 'users', currentPlayerId || "26")
    const [realTimeCurrentPlayer] = useDocumentData<OnlinePlayerProps>(currentPlayerRef as DocumentReference<OnlinePlayerProps, DocumentData>);
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await signOut(firebaseAuth);
            router.push('/login')
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    return (
        <ProtectedRoute>
            <MonitorOnlineStatus>
                <Container as="main" className="py-5">
                    <Navbar>
                        <Button className="!bg-red-500" onClick={handleLogout}>Log out</Button>
                    </Navbar>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0 lg:space-x-6 mb-10">
                        {
                            currentPlayerId && realTimeCurrentPlayer ?
                                <ProfileStats
                                    id={currentPlayerId}
                                    matches={realTimeCurrentPlayer?.matches || 0}
                                    win={realTimeCurrentPlayer?.win || 0}
                                    loss={realTimeCurrentPlayer?.loss || 0}
                                    name={realTimeCurrentPlayer?.name}
                                    online={realTimeCurrentPlayer?.online}
                                    imageUrl={null}
                                /> :
                                <h3>Loading.....</h3>
                        }
                        {currentPlayerId &&
                            <GameHistory currentPlayerId={currentPlayerId} />
                        }
                    </div>
                    <GamePlayOptions />
                </Container>
            </MonitorOnlineStatus>
        </ProtectedRoute>

    )
}