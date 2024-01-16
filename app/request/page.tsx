"use client";
import GameConfig from "@/components/Request/GameConfig";
import MobilePlayersCard from "@/components/Request/MobilePlayersCard";
import PlayerCard from "@/components/Request/PlayerCard";
import { gameConfigReducer } from "@/components/Request/reducer";
import Container from "@/components/common/Container";
import Navbar from "@/components/common/Navbar";
import { useReducer } from "react";


const DEFAULT_GAME_CONFIG = {
    boardType: [{
        dimension: "3",
        value: "3x3 Board",
        id: "3x3"
    }, {
        dimension: "4",
        value: "4x4 Board",
        id: "4x4"
    }, {
        dimension: "5x5",
        value: "5x5 Board",
        id: "5x5"
    }],
    currentBoardType: {
        dimension: "3",
        value: "3x3 Board",
        id: "3x3"
    },
    timer: 30,
    totalRounds: 3,
    roundsToWin: 2,
    distortedMode: true,
    revealMode: false
};


export default function GameRequest() {
    const [gameConfig, dispatch] = useReducer(gameConfigReducer, DEFAULT_GAME_CONFIG);

    function startGame() {

    }

    return (
        <Container as="main" className="pt-4">
            <Navbar />

            <div className="flex flex-col lg:flex-row items-center lg:justify-between space-y-8 lg:space-y-0">
                <MobilePlayersCard
                    players={[
                        { name: "Cypher Moon", id: "cypher-273", mark: "x" },
                        { name: "Jack Smith", id: "jack-273", mark: "o" }
                    ]}
                    startGame={startGame}
                />

                <PlayerCard
                    name="Cypher Moon"
                    id="cypher-273"
                    mark="x"
                    wins={10}
                    loss={0} />

                <GameConfig game={gameConfig} dispatch={dispatch} mode="view" />
                {/* <GameInfo /> */}

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