"use client";
import AiTicTacToe from "@/components/Game/AiTicTacToe";
import LocalTicTacToe from "@/components/Game/LocalTicTacToe";
import OnlinePlayerScore from "@/components/Game/OnlinePlayerScore";
import OnlineTicTacToe from "@/components/Game/OnlineTicTacToe";
import PlayerScore from "@/components/Game/PlayerScore";
import ScoreBoard from "@/components/Game/ScoreBoard";
import { useGameMode, useGameRepresentation, useOnlineGameId } from "@/components/Home/store";
import { OnlineGameDataProps } from "@/components/Home/type";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import MonitorOnlineStatus from "@/components/common/MonitorOnlineStatus";
import NavItem from "@/components/common/NavItem";
import Navbar from "@/components/common/Navbar";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import GameInfoDialog from "@/components/modals/GameInfoModal";
import { firestoreDB } from "@/firebase";
import { useModal } from "@/hooks/index.hook";
import { DocumentData, DocumentReference, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { FaTimes } from "react-icons/fa";
import { MdQuestionMark } from "react-icons/md";


export default function Game() {
  const router = useRouter()
  const { isOpen, openModal, closeModal } = useModal(false)

  const gameMode = useGameMode(state => state.gameMode)
  const localGameRep = useGameRepresentation(state => state)
  const [currentPlayer, setCurrentPlayer] = useState(localGameRep.player1)

  // online game state
  const onlineGameId = useOnlineGameId(state => state.id)
  const onlineGameRef = doc(firestoreDB, "games", onlineGameId || "26")
  const [onlineGameData, loading, _] = useDocumentData<OnlineGameDataProps>(onlineGameRef as DocumentReference<OnlineGameDataProps, DocumentData>);
  const isOnlineGame = gameMode === "online"

  const gameRep = isOnlineGame ? onlineGameData : localGameRep

  const [distortedGhost, setDistortedGhost] = useState<boolean | null>(null);


  const toggleDistorted = () => {
    setDistortedGhost(true);

    // Automatically turn off distortedMode after 2 seconds
    setTimeout(() => {
      setDistortedGhost(false);
    }, 2000);
  };

  useEffect(() => {
    if (!loading) return

    setDistortedGhost(onlineGameData?.config.distortedMode ?? null);
  }, [loading, onlineGameData?.config.distortedMode])


  return (
    <ProtectedRoute>
      <MonitorOnlineStatus>
        <Container as="main" className="pt-4">

          <Navbar>
            <ul className="flex items-center space-x-4 lg:space-x-8 flex-row">
              <NavItem>
                <Button
                  variant="muted"
                  icon_rounded={true}
                  onClick={openModal}
                >
                  <MdQuestionMark className="text-lg" />
                  <span className="hidden lg:block">
                    Game Info
                  </span>
                </Button>
              </NavItem>

              <NavItem>
                <Button
                  icon_rounded={true}
                  onClick={() => router.push("/")}
                >
                  <FaTimes />
                  <span className="hidden lg:block">
                    Quit game
                  </span>
                </Button>
              </NavItem>
            </ul>
          </Navbar>

          {!gameMode &&
            <h1 className="text-2xl font-semibold text-center text-secondary mt-10">
              No game mode selected
            </h1>
          }
          {gameRep && gameRep.player1 && gameRep.player2 && gameRep.config &&
            <>
              {
                gameMode !== "online" &&
                <PlayerScore
                  player1={gameRep.player1}
                  player2={gameRep.player2}
                  currentPlayer={currentPlayer ?? undefined}
                  setCurrentPlayer={setCurrentPlayer}
                  countdown={gameRep.config.timer} />
              }

              {
                gameMode === "online" &&
                <OnlinePlayerScore
                  toggleDistortedMode={toggleDistorted}
                  game={gameRep as OnlineGameDataProps} />
              }

              <div className="mt-10 flex flex-col items-center lg:flex-row-reverse justify-between lg:items-start space-y-10 lg:space-y-0">
                {gameMode === "local" && currentPlayer &&
                  <LocalTicTacToe
                    player1={gameRep.player1}
                    player2={gameRep.player2}
                    currentPlayer={currentPlayer}
                    setCurrentPlayer={setCurrentPlayer}
                    label={gameRep.config.currentBoardType.value}
                    countdown={gameRep.config.timer} />
                }

                {
                  gameMode === "ai" && currentPlayer &&
                  <AiTicTacToe
                    player1={gameRep.player1}
                    player2={gameRep.player2}
                    currentPlayer={currentPlayer}
                    setCurrentPlayer={setCurrentPlayer}
                    label={gameRep.config.currentBoardType.value}
                    countdown={gameRep.config.timer} />

                }

                {
                  gameMode === "online" &&
                  <OnlineTicTacToe
                    distortedMode={distortedGhost ?? false}
                    gameRep={gameRep as OnlineGameDataProps}
                  />
                }


                <ScoreBoard
                  rounds={gameRep.totalRounds || 0}
                  draws={gameRep.draws || 0}
                  player1={{ ...gameRep.player1 }}
                  player2={{ ...gameRep.player2 }}
                  bestOf={gameRep.config.roundsToWin}
                />
              </div>
            </>
          }

          {isOpen &&
            <GameInfoDialog
              isOpen={isOpen}
              title="Game Info"
              closeModal={closeModal}>
              <div className='text-sm font-normal h-96 overflow-y-scroll hide-scrollbar'>
                <p>Tic-tac-toe, also known as noughts and crosses, or Xs and Os, is a game for two players who take turns marking the spaces in a three-by-three grid with X or O. The player who first gets three of their marks in a row (up, down, across, or diagonally) is the winner.</p>
                <br />
                <p>When one player has placed three marks in a horizontal, vertical, or diagonal pattern, they win the game. If all squares are filled and no player has made a complete series, the game is a draw.</p>
                <br />
                <p>{"Here's"} how to play:</p>
                <ol>
                  <li>The game is played on a grid {"that's"} 3 squares by 3 squares.</li>
                  <li>You are X and your friend is O. Players take turns putting their marks in empty squares.</li>
                  <li>The first player to get 3 of their marks in a row (up, down, across, or diagonally) is the winner.</li>
                  <li>When all 9 squares are full, the game is over. If no player has 3 marks in a row, the game ends in a draw.</li>
                </ol>
                <br />
                <p>Remember, the game is fun and strategic. {"It's"} about outsmarting your opponent and predicting their next move. {"That's"} what makes it fun and exciting, no matter how many times you play.</p>
                <br />
                <p>Enjoy the game!</p>
              </div>
            </GameInfoDialog>
          }
        </Container>
      </MonitorOnlineStatus>
    </ProtectedRoute>
  )
}
