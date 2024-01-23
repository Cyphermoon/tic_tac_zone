"use client"
import GameHistory from "@/components/Home/GameHistory";
import GamePlayOptions from "@/components/Home/GamePlayOptions";
import ProfileStats from "@/components/Home/ProfileStatsCard";
import { useCurrentPlayer } from "@/components/Home/store";
import Container from "@/components/common/Container";
import MonitorOnlineStatus from "@/components/common/MonitorOnlineStatus";
import Navbar from "@/components/common/Navbar";
import ProtectedRoute from "@/components/common/ProtectedRoute";


export default function Home() {
    const currentPlayer = useCurrentPlayer(state => state)

    // TODO: add a loading state
    // TODO: show list of player and online state as well
    // TODO: Display image instead of avatar
    // TODO: Add a search bar to search for players

    return (
        <ProtectedRoute>
            <MonitorOnlineStatus>
                <Container as="main" className="py-5">
                    <Navbar />
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

                        <GameHistory />
                    </div>
                    <GamePlayOptions />
                </Container>
            </MonitorOnlineStatus>
        </ProtectedRoute>

    )
}