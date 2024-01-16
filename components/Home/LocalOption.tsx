import React, { ChangeEvent, FormEvent, useState } from 'react';
import Button from '../common/Button';
import { LocalPlayersProps, Player } from './type';

interface Props {
    handleLocalPlayerStart: (players: LocalPlayersProps) => void;
}

interface PlayerInputProps {
    player: Player;
    id: string
    label: string
    handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleFirstPlayerChange: (event: ChangeEvent<HTMLInputElement>) => void;
}


const LocalOption = ({ handleLocalPlayerStart }: Props) => {
    const [player1, setPlayer1] = useState<Player>({ name: '', isFirstPlayer: false });
    const [player2, setPlayer2] = useState<Player>({ name: '', isFirstPlayer: false });

    const handlePlayer1NameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPlayer1({ ...player1, name: event.target.value });
    };

    const handlePlayer2NameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPlayer2({ ...player2, name: event.target.value });
    };

    const handlePlayer1FirstPlayerChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setPlayer2({ ...player2, isFirstPlayer: false });
        }
        setPlayer1({ ...player1, isFirstPlayer: event.target.checked });
    };

    const handlePlayer2FirstPlayerChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setPlayer1({ ...player1, isFirstPlayer: false });
        }
        setPlayer2({ ...player2, isFirstPlayer: event.target.checked });
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (!player1.isFirstPlayer && !player2.isFirstPlayer) {
            alert("You need to select a first player")
            return
        }

        const localPlayers = {
            player1: {
                name: player1.name,
                isFirstPlayer: player1.isFirstPlayer,

            },
            player2: {
                name: player2.name,
                isFirstPlayer: player2.isFirstPlayer,
            },
        }

        handleLocalPlayerStart(localPlayers);

    };

    return (
        <form onSubmit={handleSubmit} className='space-y-9'>
            <PlayerInput
                id='player1'
                label='Player 1'
                player={player1}
                handleNameChange={handlePlayer1NameChange}
                handleFirstPlayerChange={handlePlayer1FirstPlayerChange}
            />
            <PlayerInput
                id='player2'
                label='Player 2'
                player={player2}
                handleNameChange={handlePlayer2NameChange}
                handleFirstPlayerChange={handlePlayer2FirstPlayerChange}
            />
            <Button fullWidth type="submit">Start Game</Button>
        </form>
    );
}

export default LocalOption;


const PlayerInput: React.FC<PlayerInputProps> = ({ player, handleNameChange, handleFirstPlayerChange, id, label }) => (
    <div className='flex flex-col'>
        <label htmlFor={id} className='mb-2'>
            {label}
        </label>
        <input type="text" required value={player.name} onChange={handleNameChange} id={id} className='mb-5 p-3 rounded-xl bg-card' />

        <label>
            First Player

            <input
                type="radio"
                required
                className='ml-2'
                checked={player.isFirstPlayer}
                onChange={handleFirstPlayerChange}
            />
        </label>
    </div>
);