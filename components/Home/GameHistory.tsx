import { firestoreDB } from '@/firebase';
import { CollectionReference, DocumentData, collection } from 'firebase/firestore';
import { useEffect } from 'react';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './TableUI';
import { GameHistoryProps } from './type';

// TODO: Add duration for game history


interface Props {
    currentPlayerId: string
}


const GameHistory = ({ currentPlayerId }: Props) => {
    const gameHistoryRef = collection(firestoreDB, 'users', currentPlayerId, 'history');
    const [gameHistory, loading, error] = useCollectionDataOnce<GameHistoryProps>(gameHistoryRef as CollectionReference<GameHistoryProps, DocumentData>);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;



    return (
        <section className='bg-card rounded-2xl p-5 grow h-[320px] hide-scrollbar overflow-scroll'>
            <h2 className='font-semibold text-2xl text-secondary mb-10 grow'> Game History </h2>
            {gameHistory && gameHistory.length > 0 ? (
                <Table className="w-[550px] lg:w-full">
                    <TableHeader>
                        <TableRow className='mb-5'>
                            <TableHead className="font-medium">Opponent</TableHead>
                            <TableHead className="font-medium">Game Type</TableHead>
                            <TableHead className="font-medium">Duration</TableHead>
                            <TableHead className="font-medium">Result</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {gameHistory.map((game, index) => (
                            <TableRow key={index}>
                                <TableCell>{game.opponent}</TableCell>
                                <TableCell>{game.gameType}</TableCell>
                                <TableCell>{game.firstToWin}</TableCell>
                                <TableCell>{game.result}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className='text-left text-neutral-500'>No games played yet</p>
            )}
        </section>
    );
}


export default GameHistory