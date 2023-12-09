import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Tic Tac Zone - Game',
}

interface Props {
    children: React.ReactNode
}

const GameLayout = ({ children }: Props) => {
    return (
        <>{children}</>
    )
}

export default GameLayout