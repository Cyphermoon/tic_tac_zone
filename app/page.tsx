"use client"
import GameHistory from "@/components/Home/GameHistory";
import GamePlayOptions from "@/components/Home/GamePlayOptions";
import ProfileStats from "@/components/Home/ProfileStatsCard";
import { useCurrentPlayer } from "@/components/Home/store";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import MonitorOnlineStatus from "@/components/common/MonitorOnlineStatus";
import Navbar from "@/components/common/Navbar";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { firebaseAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";


export default function Home() {
    const currentPlayer = useCurrentPlayer(state => state)
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
                            currentPlayer &&
                            <ProfileStats
                                id={currentPlayer.id}
                                matches={currentPlayer.matches || 0}
                                win={currentPlayer.win || 0}
                                loss={currentPlayer.loss || 0}
                                name={currentPlayer.name}
                                online={currentPlayer.online}
                                imageUrl={null}
                            />
                        }
                        {currentPlayer.id &&
                            <GameHistory currentPlayerId={currentPlayer.id} />
                        }
                    </div>
                    <GamePlayOptions />
                </Container>
            </MonitorOnlineStatus>
        </ProtectedRoute>

    )
}