import React, { useState } from 'react'
import { BoardType } from './type'
import { useGameMode, useGameRepresentation } from '../Home/store'
import { shuffleArray } from './util'

interface Props {
    label: string
    board: BoardType
    handleCellClicked: (position: string) => void
    currentMarker: string
    distortedMode: boolean
    distortedGhost: boolean
    player1Id?: string
    player2Id?: string
}

interface CellProps {
    boxType: string
    handleCellClicked: (position: string) => void
    position: string
    ghost: boolean
}



const TicTacToeBoard = ({ label, board, handleCellClicked, currentMarker, distortedGhost, player1Id, player2Id, distortedMode = false }: Props) => {
    const gameMode = useGameMode(state => state.gameMode)

    let positions = Object.keys(board)

    if (distortedMode && gameMode !== "ai") {
        positions = shuffleArray(positions, `${player1Id || "hello"}_${player2Id || "kelvin"}`)
    }

    return (
        <section className='bg-card py-4 px-8 rounded-2xl w-full max-w-md space-y-10 min-h-[421px] flex flex-col items-center'>
            <div className='bg-neutral-200 rounded-lg px-5 py-1.5 w-fit flex items-center space-x-2'>
                <span> {label}</span>
            </div>

            {/* Displaying Cells */}
            <div className="cells grid grid-cols-3 w-fit" data-currentmarker={currentMarker}>
                {
                    positions
                        .map((position, idx) => {
                            return (
                                <Cell
                                    key={idx}
                                    position={position}
                                    boxType={board[position]}
                                    ghost={distortedGhost}
                                    handleCellClicked={handleCellClicked}
                                />
                            )
                        })}
            </div>

        </section>
    )
}

export default TicTacToeBoard


const Cell = ({ boxType, handleCellClicked, position, ghost }: CellProps) => {
    return (
        <div
            data-boxtype={`${boxType}`}
            onClick={() => handleCellClicked(position)}
            className={`cell relative aspect-square w-[clamp(60px,_calc(100vw/4.5),_80px)] lg:w-[100px] border border-gray-800 cursor-pointer`} >
            {ghost &&
                <span className='text-xl text-secondary opacity-50'>{position}</span>
            }
        </div>
    )
}