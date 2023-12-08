import React, { useState } from 'react'

interface CellProps {
    boxType: string
    handleCellClicked: (position: string) => void
    position: string
}

type BoardType = {
    [key: string]: string;
}

const _board: BoardType = {
    1: 'x',
    2: 'o',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: '',
    9: '',
}


const TicTacToeBoard = () => {
    const [board, setBoard] = useState(_board);

    function handleCellClicked(position: string) {
        if (board[position] === '') {
            setBoard({ ...board, [position]: 'o' })
        }
    }

    return (
        <section className='bg-card py-4 px-8 rounded-2xl w-full max-w-md space-y-10 min-h-[421px] flex flex-col items-center'>
            <div className='bg-neutral-200 rounded-lg px-5 py-1.5 w-fit flex items-center space-x-2'>
                <span> 3x3 board</span>
            </div>

            {/* Displaying Cells */}
            <div className="cells grid grid-cols-3 w-fit" data-currentmarker='o'>
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