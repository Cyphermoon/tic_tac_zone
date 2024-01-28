import { _board } from '@/game_settings'
import { useModal } from '@/hooks/index.hook'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { useGameRepresentation } from '../Home/store'
import { GamePlayerProps } from '../Home/type'
import Button from '../common/Button'
import GameInfoDialog from '../modals/GameInfoModal'
import TicTacToeBoard from './TicTacToeBoard'
import { BoardType } from './type'
import { checkWinner, isDraw, switchPlayer, handleCellClicked as _handleCellClicked } from './util'

interface Props {
    label: string

}

// Function to reset the game board
export const resetBoard = (setBoard: (board: BoardType) => void) => {
    setBoard(_board)
}

const OnlineTicTacToe = ({ label }: Props) => {

    const handleCellClicked = () => {
        console.log("online la wa")
    }

    return (
        <>
            <TicTacToeBoard label={label} handleCellClicked={handleCellClicked} board={_board} currentMarker={"o"} />
        </>
    )
}

export default OnlineTicTacToe

// Function to switch the current player
