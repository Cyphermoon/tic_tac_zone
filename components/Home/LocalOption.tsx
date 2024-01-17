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
}


const LocalOption = ({ handleLocalPlayerStart }: Props) => {
    const [player2, setPlayer2] = useState<Player>({ name: '' });

    const handlePlayer2NameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPlayer2({ ...player2, name: event.target.value });
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        const localPlayers = {
            player2: {
                name: player2.name,
            },
        }

        handleLocalPlayerStart(localPlayers);

    };

    return (
        <form onSubmit={handleSubmit} className='space-y-9'>
            <PlayerInput
                id='player2'
                label='Player 2'
                player={player2}
                handleNameChange={handlePlayer2NameChange}
            />
            <Button fullWidth type="submit">Start Game</Button>
        </form>
    );
}

export default LocalOption;


const PlayerInput: React.FC<PlayerInputProps> = ({ player, handleNameChange, id, label }) => (
    <div className='flex flex-col'>
        <label htmlFor={id} className='mb-2'>
            {label}
        </label>
        <input type="text" required value={player.name} onChange={handleNameChange} id={id} className='mb-5 p-3 rounded-xl bg-card' />
    </div>
);