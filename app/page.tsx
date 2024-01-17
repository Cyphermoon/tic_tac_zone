"use client"
import GameHistory from "@/components/Home/GameHistory";
import GamePlayOptions from "@/components/Home/GamePlayOptions";
import ProfileStats from "@/components/Home/ProfileStatsCard";
import { useCurrentPlayer } from "@/components/Home/store";
import Container from "@/components/common/Container";
import Navbar from "@/components/common/Navbar";
import { useEffect } from "react";

export default function Home() {
    const updateCurrentPlayer = useCurrentPlayer(state => state.updateCurrentPlayer)
    const currentPlayerId = useCurrentPlayer(state => state.id)

    useEffect(() => {
        if (currentPlayerId) return;

        updateCurrentPlayer({
            isAnonymous: true,
            name: "Kelvin Mai",
            id: "cypher-172",

        })
    }, [currentPlayerId, updateCurrentPlayer])
    return (
        <Container as="main" className="py-5">
            <Navbar />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0 lg:space-x-6 mb-10">
                <ProfileStats
                    id="cypher-172"
                    matches={10}
                    wins={4}
                    loss={6}
                    avatar={{
                        name: "Kelvin Mai",
                        id: "cypher-172",
                    }} />

                <GameHistory />
            </div>
            <GamePlayOptions />
        </Container>
    )
}