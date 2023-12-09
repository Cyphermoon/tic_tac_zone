"use client";
import GameConfig from "@/components/Request/GameConfig";
import MobilePlayersCard from "@/components/Request/MobilePlayersCard";
import PlayerCard from "@/components/Request/PlayerCard";
import Container from "@/components/common/Container";
import Navbar from "@/components/common/Navbar";

export default function GameRequest() {

    function startGame() {

        console.log("i don't know what the fuck to do yet")
    }

    return (
        <Container as="main" className="pt-4">
            <Navbar />

            <div className="flex items-center justify-between">
                <MobilePlayersCard
                    players={[{ name: "Cypher Moon", id: "cypher-273", mark: "x" }, { name: "Jack Smith", id: "jack-273", mark: "o" }]}
                    startGame={startGame}
                />

                <PlayerCard
                    name="Cypher Moon"
                    id="cypher-273"
                    mark="x"
                    wins={10}
                    loss={0} />

                <GameConfig />

                <PlayerCard
                    name="Jack Smith"
                    id="jack-273"
                    mark="o"
                    wins={0}
                    loss={10} />
            </div>

        </Container>
    )
}