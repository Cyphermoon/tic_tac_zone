import { Select, SelectContent, SelectIcon, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { IoIosArrowDown } from "react-icons/io";
import React from 'react'
import { GameAction, GameConfigType } from './type';
import { Switch, SwitchThumb } from '@radix-ui/react-switch';
import Button from '../common/Button';

interface Props {
    game: GameConfigType
    mode: "view" | "edit"
    dispatch: React.Dispatch<GameAction>
}

interface optionHeaderProps {
    text: string
}

interface numberInputProps {
    number: number
    onNumberChange: (number: number) => void
    disabled: boolean
}

type BoardSelectionType = Omit<Props, "mode">


const GameConfig = ({ game, mode, dispatch }: Props) => {
    const handleTimerChange = (number: number) => {
        if (mode === "edit") {
            dispatch({ type: "updateTimer", payload: number });
        }
    };

    const handleTotalRoundsChange = (number: number) => {
        if (mode === "edit") {
            dispatch({ type: "updateTotalRounds", payload: number });
        }
    };

    const handleRoundsToWinChange = (number: number) => {
        if (mode === "edit") {
            dispatch({ type: "updateRoundsToWin", payload: number });
        }
    };

    const handleDistortedModeChange = (value: boolean) => {
        dispatch({ type: "updateDistortedMode", payload: value });
    }

    return (
        <section className='bg-card rounded-2xl px-5 py-8 lg:w-[330px] text-center'>
            <div className='grid grid-cols-2 gap-x-12 gap-y-10 justify-item-start mb-8 text-left'>
                <div>
                    <OptionHeader text="Board Variation" />
                    {mode === "edit" ?
                        <BoardSelectOptions game={game} dispatch={dispatch} /> :
                        <DisabledTag value={game.currentBoardType.value} />
                    }
                </div>
                <div>
                    <OptionHeader text="Timer(s)" />
                    <NumberInput number={game.timer} onNumberChange={handleTimerChange} disabled={mode === "view"} />
                </div>
                <div>
                    <OptionHeader text="Total Rounds" />
                    <NumberInput number={game.totalRounds} onNumberChange={handleTotalRoundsChange} disabled={mode === "view"} />
                </div>
                <div>
                    <OptionHeader text="Rounds to Win" />
                    <NumberInput number={game.roundsToWin} onNumberChange={handleRoundsToWinChange} disabled={mode === "view"} />
                </div>

                <OptionHeader text="Distorted Mode" />
                <div className='flex items-center space-x-2'>
                    <Switch
                        className="w-[52px] h-[25px] relative bg-gray-600 rounded-xl rdx-state-checked:bg-accent focus:shadow-black outline-none"
                        checked={game.distortedMode}
                        onCheckedChange={(checked) => handleDistortedModeChange(checked)}
                        disabled={mode === "view"}
                    >
                        <SwitchThumb className="block w-[21px] h-[21px] bg-white rounded-3xl shadow-[0_2px_2px] transition-transform duration-100 translate-x-0.5 will-change-transform rdx-state-checked:translate-x-[27px]" />
                    </Switch>
                </div>
            </div>

            {mode === "edit" && (
                <Button fullWidth>
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

const BoardSelectOptions = ({ game, dispatch }: BoardSelectionType) => {
    const handleBoardTypeChange = (value: string) => {
        const boardType = game.boardType.find((type) => type.value === value)

        if (boardType)
            dispatch({ type: "updateCurrentType", payload: boardType });

    };

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
                {game.boardType.map(({ value, id }) => (
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

