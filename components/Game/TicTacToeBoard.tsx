import React, { useState } from 'react'
import { BoardType } from './type'

interface Props {
    label: string
    board: BoardType
    handleCellClicked: (position: string) => void
    currentMarker: string
}

interface CellProps {
    boxType: string
    handleCellClicked: (position: string) => void
    position: string
}



const TicTacToeBoard = ({ label, board, handleCellClicked, currentMarker }: Props) => {

    return (
        <section className='bg-card py-4 px-8 rounded-2xl w-full max-w-md space-y-10 min-h-[421px] flex flex-col items-center'>
            <div className='bg-neutral-200 rounded-lg px-5 py-1.5 w-fit flex items-center space-x-2'>
                <span> {label}</span>
            </div>

            {/* Displaying Cells */}
            <div className="cells grid grid-cols-3 w-fit" data-currentmarker={currentMarker}>
                {Object.keys(board).map((position, idx) => {
                    return (
                        <Cell
                            key={idx}
                            position={position}
                            boxType={board[position]}
                            handleCellClicked={handleCellClicked}
                        />
                    )
                })}
            </div>

        </section>
    )
}

export default TicTacToeBoard


const Cell = ({ boxType, handleCellClicked, position }: CellProps) => {
    return (
        <div
            data-boxtype={`${boxType}`}
            onClick={() => handleCellClicked(position)}
            className='cell relative aspect-square w-[clamp(60px,_calc(100vw/4.5),_80px)] lg:w-[100px] border border-gray-800 cursor-pointer' />
    )
}