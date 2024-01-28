"use client";
import { useAIDifficulty, useCurrentPlayer, useGameMode, useGameRepresentation, useLocalPlayer, useOnlineGameId } from "@/components/Home/store";
import { OnlineGameDataProps } from "@/components/Home/type";
import { updateOrGetGame } from "@/components/Home/util";
import GameChat from "@/components/Request/GameChat";
import GameConfig from "@/components/Request/GameConfig";
import MobilePlayersCard from "@/components/Request/MobilePlayersCard";
import PlayerCard from "@/components/Request/PlayerCard";
import { gameConfigReducer } from "@/components/Request/reducer";
import { ViewModeType } from "@/components/Request/type";
import Container from "@/components/common/Container";
import MonitorOnlineStatus from "@/components/common/MonitorOnlineStatus";
import Navbar from "@/components/common/Navbar";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { firestoreDB } from "@/firebase";
import { AiCharacters, DEFAULT_GAME_CONFIG } from "@/game_settings";
import { DocumentData, DocumentReference, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";


// TODO: remove distorted mode for AI


export default function GameRequest() {
    const router = useRouter()
    const [gameConfig, dispatch] = useReducer(gameConfigReducer, DEFAULT_GAME_CONFIG);
    const [viewMode, setViewMode] = useState<ViewModeType>("view")
    const gameMode = useGameMode(state => state.gameMode)
    const localPlayer = useLocalPlayer(state => state)

    const onlineGameId = useOnlineGameId(state => state.id)
    const onlineGameRef = doc(firestoreDB, "games", onlineGameId || "26")
    const [onlineGameData, loading, error] = useDocumentData<OnlineGameDataProps>(onlineGameRef as DocumentReference<OnlineGameDataProps, DocumentData>);
    const isOnlineGame = gameMode === "online"

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
            difficulty: aiCharacter.difficulty,
            mark: "o",
            className: aiCharacter.className,
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

    const populateOnlineGame = useCallback(async () => {
        // quit if no online game id
        if (!onlineGameId) return

        // get game data
        const gameData = await updateOrGetGame(onlineGameId)

        // quit if no game data
        if (!gameData) return

        setPlayer1({
            name: gameData.player1.name,
            id: gameData.player1.id,
            mark: gameData.player1.mark,
            view: gameData.player1.view,
        })

        setPlayer2({
            name: gameData.player2.name,
            id: gameData.player2.id,
            mark: gameData.player2.mark,
            view: gameData.player2.view,
        })

        if (gameData.player1.id === gameData.initiatingPlayerId) {
            setViewMode("edit")
        } else {
            setViewMode("view")
        }
    }, [onlineGameId])


    const handleGameStart = () => {
        if (gameConfig.roundsToWin > gameConfig.totalRounds) {
            alert("Rounds to win cannot be greater than total rounds")
            return;
        }

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
        if (gameMode === "online") {
            populateOnlineGame()
        }
    }, [gameMode, populateAIGame, populateLocalGame, populateOnlineGame])


    return (
        <ProtectedRoute>
            <MonitorOnlineStatus >
                <Container as="main" className="pt-4">
                    <Navbar />
                    {
                        gameMode && player1 && player2 ?
                            <>
                                <div className="flex flex-col lg:flex-row items-center lg:justify-between space-y-8 lg:space-y-0 mb-7">
                                    <MobilePlayersCard
                                        players={[
                                            { ...player1, mark: player1.mark },
                                            { ...player2, mark: player2.mark }
                                        ]}
                                        startGame={handleGameStart}
                                    />



                                    {gameMode &&
                                        <PlayerCard
                                            name={player1.name}
                                            id={player1.id}
                                            mark={player1.mark} />
                                    }

                                    <GameConfig
                                        game={!isOnlineGame ? gameConfig : onlineGameData?.config}
                                        dispatch={dispatch}
                                        mode={viewMode}
                                        handleGameStart={handleGameStart}
                                        online={{
                                            loading,
                                            player1View: player1.view,
                                            player1Id: player1.id,
                                        }} />

                                    {gameMode &&
                                        <PlayerCard
                                            name={player2.name}
                                            id={player2.id}
                                            mark={player2.mark}
                                            className={player2.className} />
                                    }

                                </div>
                                {gameMode === "online" && <GameChat />}

                            </> :
                            <div>
                                <h1>Game mode or players not selected</h1>
                            </div>
                    }

                </Container>
            </MonitorOnlineStatus>
        </ProtectedRoute>
    )
}