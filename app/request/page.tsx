"use client";
import { useAIDifficulty, useCurrentPlayer, useGameMode, useGameRepresentation, useLocalPlayer } from "@/components/Home/store";
import GameChat from "@/components/Request/GameChat";
import GameConfig from "@/components/Request/GameConfig";
import MobilePlayersCard from "@/components/Request/MobilePlayersCard";
import PlayerCard from "@/components/Request/PlayerCard";
import { gameConfigReducer } from "@/components/Request/reducer";
import { ViewModeType } from "@/components/Request/type";
import Container from "@/components/common/Container";
import Navbar from "@/components/common/Navbar";
import { AiCharacters, DEFAULT_GAME_CONFIG } from "@/game_settings";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useReducer, useState } from "react";


export default function GameRequest() {
    const router = useRouter()
    const [gameConfig, dispatch] = useReducer(gameConfigReducer, DEFAULT_GAME_CONFIG);
    const [viewMode, setViewMode] = useState<ViewModeType>("view")

    const gameMode = useGameMode(state => state.gameMode)
    const localPlayer = useLocalPlayer(state => state)

    const aiDifficulty = useAIDifficulty(state => state.aiDifficulty)
    const currentPlayer = useCurrentPlayer(state => state)

    const updateGameConfig = useGameRepresentation(state => state.updateGameConfig)
    const updatePlayer1 = useGameRepresentation(state => state.updatePlayer1)
    const updatePlayer2 = useGameRepresentation(state => state.updatePlayer2)
    const updateDraws = useGameRepresentation(state => state.updateDraws)
    const updateTimeLeft = useGameRepresentation(state => state.updateTimer)
    const updatePauseGame = useGameRepresentation(state => state.updatePause)

    const [player1, setPlayer1] = useState<any>(null)
    const [player2, setPlayer2] = useState<any>(null)

    const populateAIGame = useCallback(() => {
        const aiCharacter = AiCharacters.find(character => character.difficulty === aiDifficulty)

        if (!aiCharacter) return;

        setPlayer1({
            name: currentPlayer.name,
            id: currentPlayer.id,
            mark: "x",
        })

        setPlayer2({
            name: aiCharacter.name,
            id: aiCharacter.id,
            mark: "o",
        })

        setViewMode("edit")
    }, [aiDifficulty, currentPlayer, setPlayer1, setPlayer2, setViewMode])


    const populateLocalGame = useCallback(() => {
        setPlayer1({
            name: currentPlayer.name,
            id: currentPlayer.id,
            mark: "x",
        })

        setPlayer2({
            name: localPlayer.name,
            id: localPlayer.id,
            mark: "o",
        })

        setViewMode("edit")
    }, [currentPlayer.id, currentPlayer.name, localPlayer.id, localPlayer.name])


    const handleGameStart = () => {
        updateGameConfig(gameConfig)
        updatePlayer1({
            ...player1,
            score: 0,
        })
        updatePlayer2({
            ...player2,
            score: 0,
        })
        updateDraws(0)
        updatePauseGame(false)
        updateTimeLeft(gameConfig.timer)

        router.push("/game")
    }


    useEffect(() => {
        if (gameMode === "ai")
            populateAIGame()

        if (gameMode === "local")
            populateLocalGame()
    }, [gameMode, populateAIGame, populateLocalGame])


    return (
        <Container as="main" className="pt-4">
            <Navbar />
            {
                gameMode && player1 && player2 ?
                    <>
                        <div className="flex flex-col lg:flex-row items-center lg:justify-between space-y-8 lg:space-y-0 mb-7">
                            <MobilePlayersCard
                                players={[
                                    { ...player1, mark: "x" },
                                    { ...player2, mark: "o" }
                                ]}
                                startGame={handleGameStart}
                            />

                            {gameMode === "online" &&
                                <PlayerCard
                                    name="Cypher Moon"
                                    id="cypher-273"
                                    mark="x"
                                    wins={10}
                                    loss={0} />
                            }

                            {gameMode !== "online" &&
                                <PlayerCard
                                    name={player1.name}
                                    id={player1.id}
                                    mark={player1.mark} />
                            }

                            <GameConfig game={gameConfig} dispatch={dispatch} mode={viewMode} handleGameStart={handleGameStart} />

                            {gameMode !== "online" &&
                                <PlayerCard
                                    name={player2.name}
                                    id={player2.id}
                                    mark={player2.mark} />
                            }

                            {gameMode === "online" &&
                                <PlayerCard
                                    name="Jack Smith"
                                    id="jack-273"
                                    mark="o"
                                    wins={0}
                                    loss={10} />
                            }
                        </div>
                        {gameMode === "online" && <GameChat />}

                    </> :
                    <div>
                        <h1>Game mode not selected</h1>
                    </div>
            }

        </Container>
    )
}