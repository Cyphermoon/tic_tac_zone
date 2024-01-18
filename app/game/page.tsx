"use client";
import LocalTicTacToe from "@/components/Game/LocalTicTacToe";
import PlayerScore from "@/components/Game/PlayerScore";
import ScoreBoard from "@/components/Game/ScoreBoard";
import { useGameMode, useGameRepresentation } from "@/components/Home/store";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import NavItem from "@/components/common/NavItem";
import Navbar from "@/components/common/Navbar";
import GameInfoDialog from "@/components/modals/GameInfoModal";
import { useModal } from "@/hooks/index.hook";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { MdQuestionMark } from "react-icons/md";


export default function Game() {
  const router = useRouter()
  const gameMode = useGameMode(state => state.gameMode)
  const gameRepresentation = useGameRepresentation(state => state)

  const { isOpen, openModal, closeModal } = useModal(false)
  const [currentPlayer, setCurrentPlayer] = useState(gameRepresentation.player1)


  return (
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
      {gameRepresentation.gameConfig && gameRepresentation.player1 && gameRepresentation.player2 && currentPlayer &&
        <>
          <PlayerScore
            player1={gameRepresentation.player1}
            player2={gameRepresentation.player2}
            currentPlayer={currentPlayer}
            setCurrentPlayer={setCurrentPlayer}
            name={currentPlayer.name}
            id={currentPlayer.id}
            countdown={gameRepresentation.gameConfig.timer} />

          <div className="mt-10 flex flex-col lg:flex-row-reverse justify-between items-start space-y-10 lg:space-y-0">

            <LocalTicTacToe
              player1={gameRepresentation.player1}
              player2={gameRepresentation.player2}
              currentPlayer={currentPlayer}
              setCurrentPlayer={setCurrentPlayer}
              label={gameRepresentation.gameConfig.currentBoardType.value}
              countdown={gameRepresentation.gameConfig.timer} />

            <ScoreBoard
              rounds={gameRepresentation.gameConfig.totalRounds}
              draws={gameRepresentation.draws || 0}
              player1={{ ...gameRepresentation.player1 }}
              player2={{ ...gameRepresentation.player2 }}
              bestOf={gameRepresentation.gameConfig.roundsToWin}
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
  )
}
