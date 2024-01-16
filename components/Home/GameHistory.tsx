import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './TableUI'

const GameHistory = () => {
    return (
        <section className='bg-card rounded-2xl p-5 grow h-[320px] hide-scrollbar overflow-scroll'>
            <h2 className='font-semibold text-2xl text-secondary mb-10 grow'> Game History </h2>
            <Table className="w-[550px] lg:w-full">
                <TableHeader>
                    <TableRow className='mb-5'>
                        <TableHead className="font-medium">Name</TableHead>
                        <TableHead className="font-medium">Game Type</TableHead>
                        <TableHead className="font-medium">Duration</TableHead>
                        <TableHead className="font-medium">Result</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Edgar Stan</TableCell>
                        <TableCell>3x3 Board</TableCell>
                        <TableCell>2:45</TableCell>
                        <TableCell>Win</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Maeve Willy</TableCell>
                        <TableCell>Pyramid Board</TableCell>
                        <TableCell>9:11</TableCell>
                        <TableCell>Loss</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Maeve Willy</TableCell>
                        <TableCell>4x4 Board</TableCell>
                        <TableCell>0:69</TableCell>
                        <TableCell>Loss</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </section>
    )
}

export default GameHistory






