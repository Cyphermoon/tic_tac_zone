import { DEFAULT_GAME_CONFIG } from '@/game_settings';
import { Select, SelectContent, SelectIcon, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { Switch, SwitchThumb } from '@radix-ui/react-switch';
import React, { useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { useCurrentPlayer, useGameMode, useOnlineGameId } from '../Home/store';
import Button from '../common/Button';
import { GameAction, GameConfigType, ViewModeType } from './type';
import { firestoreDB } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';



interface Props {
    game: GameConfigType | undefined
    mode: ViewModeType
    dispatch?: React.Dispatch<GameAction>
    handleGameStart: () => void
    online?: {
        loading: boolean,
        player1View: ViewModeType,
        player1Id: string
    }
}

interface optionHeaderProps {
    text: string
}

interface numberInputProps {
    number: number
    onNumberChange: (number: number) => void
    disabled: boolean
}

type BoardSelectionType = {
    game: GameConfigType | undefined
    handleBoardTypeChange: (value: string) => void
}
const updateOnlineGame = async (id: string | null, field: string, value: any) => {
    if (id) {
        const gameRef = doc(firestoreDB, 'games', id);
        await updateDoc(gameRef, { [`config.${field}`]: value });
    }
};



const GameConfig = ({ game, mode, dispatch, handleGameStart, online }: Props) => {
    const gameMode = useGameMode(state => state.gameMode)
    const onlineGameId = useOnlineGameId(state => state.id)
    const currentPlayerId = useCurrentPlayer(state => state.id)

    const getViewMode = () => {
        if (gameMode !== "online") {
            return mode;
        }

        if (online?.player1View === "edit" && currentPlayerId === online?.player1Id) {
            return "edit";
        }

        return "view";
    }

    const currentGameMode = getViewMode()

    const handleTimerChange = (number: number) => {
        if (currentGameMode === "edit" && gameMode !== "online" && dispatch) {
            dispatch({ type: "updateTimer", payload: number });
        } else if (currentGameMode === "edit" && gameMode === "online") {
            updateOnlineGame(onlineGameId, 'timer', number);
        }
    };

    const handleTotalRoundsChange = (number: number) => {
        if (currentGameMode === "edit" && gameMode !== "online" && dispatch) {
            dispatch({ type: "updateTotalRounds", payload: number });
        } else if (currentGameMode === "edit" && gameMode === "online") {
            updateOnlineGame(onlineGameId, 'totalRounds', number);
        }
    };

    const handleRoundsToWinChange = (number: number) => {
        if (currentGameMode === "edit" && gameMode !== "online" && dispatch) {
            dispatch({ type: "updateRoundsToWin", payload: number });
        } else if (currentGameMode === "edit" && gameMode === "online") {
            updateOnlineGame(onlineGameId, 'roundsToWin', number);
        }
    };

    const handleDistortedModeChange = (value: boolean) => {
        if (currentGameMode === "edit" && gameMode !== "online" && dispatch) {
            dispatch({ type: "updateDistortedMode", payload: value });
        } else if (currentGameMode === "edit" && gameMode === "online") {
            updateOnlineGame(onlineGameId, 'distortedMode', value);
        }
    }

    const handleBoardTypeChange = (value: string) => {
        const boardType = DEFAULT_GAME_CONFIG.boardType.find((type) => type.value === value)

        if (boardType && currentGameMode === "edit" && gameMode === "local" && dispatch) {
            dispatch({ type: "updateCurrentType", payload: boardType });
        }
    };

    return (
        <section className='bg-card rounded-2xl px-5 py-8 lg:w-[330px] text-center'>
            <div className='grid grid-cols-2 gap-x-12 gap-y-10 justify-item-start mb-8 text-left'>
                <div>
                    <OptionHeader text="Board Variation" />
                    {currentGameMode === "edit" && game ?
                        <BoardSelectOptions game={game} handleBoardTypeChange={handleBoardTypeChange} /> :
                        game && <DisabledTag value={game.currentBoardType.value} />
                    }
                </div>
                <div>
                    <OptionHeader text="Timer(s)" />
                    {
                        game &&
                        <NumberInput number={game.timer} onNumberChange={handleTimerChange} disabled={currentGameMode === "view"} />
                    }
                </div>
                <div>
                    <OptionHeader text="Total Rounds" />
                    {
                        game &&
                        <NumberInput number={game.totalRounds} onNumberChange={handleTotalRoundsChange} disabled={currentGameMode === "view"} />
                    }
                </div>
                <div>
                    <OptionHeader text="Rounds to Win" />
                    {game &&
                        <NumberInput number={game.roundsToWin} onNumberChange={handleRoundsToWinChange} disabled={currentGameMode === "view"} />
                    }
                </div>
                {gameMode !== "ai" && game &&
                    <>
                        <OptionHeader text="Distorted Mode" />
                        <div className='flex items-center space-x-2'>
                            <Switch
                                className="w-[52px] h-[25px] relative bg-gray-600 rounded-xl rdx-state-checked:bg-accent focus:shadow-black outline-none"
                                checked={game.distortedMode}
                                onCheckedChange={(checked) => handleDistortedModeChange(checked)}
                                disabled={currentGameMode === "view"}
                            >
                                <SwitchThumb className="block w-[21px] h-[21px] bg-white rounded-3xl shadow-[0_2px_2px] transition-transform duration-100 translate-x-0.5 will-change-transform rdx-state-checked:translate-x-[27px]" />
                            </Switch>
                        </div>
                    </>}

            </div>

            {currentGameMode === "edit" && (
                <Button fullWidth onClick={handleGameStart}>
                    Start Game
                </Button>
            )}

        </section>
    )
}

export default GameConfig

const OptionHeader = ({ text }: optionHeaderProps) => (
    <h3 className='text-secondary text-base font-medium whitespace-nowrap inline-block'>{text}</h3>
)

const DisabledTag = ({ value }: { value: string | number }) => (
    <span className='text-gray-600 text-sm block'>{value}</span>

)

const NumberInput = ({ number, onNumberChange, disabled }: numberInputProps) => {
    if (disabled) {
        return (
            <DisabledTag value={number} />
        )
    }
    return (

        <div className='flex items-center space-x-2 border border-gray-500 rounded-lg w-fit '>
            <input type="number"
                className='bg-transparent rounded-md w-[80px] p-2 outline-none'
                value={number}
                onChange={(e) => onNumberChange(parseInt(e.target.value))}
                disabled={disabled}
            />
        </div>
    )
}

const BoardSelectOptions = ({ game, handleBoardTypeChange }: BoardSelectionType) => {

    if (!game) return <p>not available</p>

    return (
        <Select value={game.currentBoardType.dimension} onValueChange={(value) => handleBoardTypeChange(value)}>
            <SelectTrigger id="boardVariation" className='border outline-none border-secondary rounded-md p-2 flex items-center w-[150px] justify-between  rdx-placeholder:text-gray-700 space-x-2'>
                <SelectValue placeholder="Select Board Type" >
                    {game.currentBoardType.value}
                </SelectValue>
                <SelectIcon>
                    <IoIosArrowDown />
                </SelectIcon>
            </SelectTrigger>

            <SelectContent
                position='popper'
                side='bottom'
                sideOffset={5}
                className='
    w-[200px] bg-card border border-card-300 shadow-lg border-gray-400 rounded-md py-3 px-1 space-y-1.5
    '>
                {DEFAULT_GAME_CONFIG.boardType.map(({ value, id }) => (
                    <SelectItem
                        className='w-full px-3 py-2 rounded-lg outline-none hover:bg-accent hover:text-white transition-colors'
                        key={id}
                        value={value}
                    >
                        {value}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

