import React from 'react'

interface CellProps {
    boxType: string
}

type BoardType = {
    [key: string]: string;
}

const board: BoardType = {
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


const GameBoard = () => {
    return (
        <section className='bg-card py-4 px-8 rounded-2xl w-full max-w-md space-y-10 min-h-[421px] flex flex-col items-center'>
            <div className='bg-neutral-200 rounded-lg px-5 py-1.5 w-fit flex items-center space-x-2'>
                <span> 3x3 board</span>
            </div>

            <div className="cells grid grid-cols-3 w-fit">
                {Object.keys(board).map((position, idx) => <Cell key={idx} boxType={board[position]} />)}
            </div>

        </section>
    )
}

export default GameBoard


const Cell = ({ boxType }: CellProps) => {
    return (
        <div
            data-boxtype={`${boxType}`}
            className='cell relative aspect-square w-[clamp(60px,_calc(100vw/4.5),_80px)] lg:w-[100px] border border-gray-800 cursor-pointer' />
    )
}