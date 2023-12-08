import { sanitizePercentage } from '@/hooks/index.hook'
import clsx from 'clsx'
import React from 'react'

interface CircleProps {
    radius: number
    strokeWidth: string
    strokeDashArray: number
    strokeDashOffset: number
    className: string
}

interface Props {
    percentage: number
    radius: number,
    viewBoxDimension: number
    strokeWidth?: string
    text?: string
}

const CircularBar = ({ percentage, radius, viewBoxDimension, strokeWidth, text }: Props) => {
    percentage = sanitizePercentage(percentage)
    const circumference = 2 * Math.PI * radius
    const offset = ((100 - percentage) * circumference) / 100

    const strokeColors = clsx({
        'stroke-red-500 fill-red-500': percentage < 20,
        'stroke-red-400 fill-red-400': percentage >= 20 && percentage < 40,
        'stroke-neutral-400 fill-neutral-400': percentage >= 40 && percentage < 60,
        'stroke-neutral-500 fill-neutral-500': percentage >= 60 && percentage < 80,
        'stroke-secondary fill-secondary': percentage >= 80,
    })

    return (
        <div>
            <svg width={`${viewBoxDimension}`} height={`${viewBoxDimension}`}>
                <g transform={`rotate(-90 ${viewBoxDimension / 2} ${viewBoxDimension / 2})`}>
                    <Circle
                        radius={radius}
                        className="stroke-neutral-200"
                        strokeWidth={strokeWidth || "10.34px"}
                        strokeDashArray={circumference}
                        strokeDashOffset={0} />

                    <Circle
                        radius={radius}
                        strokeWidth={strokeWidth || "10.34px"}
                        className={`${strokeColors} transition-all ease-linear duration-1000`}
                        strokeDashArray={circumference}
                        strokeDashOffset={offset} />
                </g>

                <text x="50%" y="50%" dominantBaseline="central" className={`text-2xl transition-all duration-1000 font-bold ${strokeColors}`} textAnchor="middle">
                    {text || percentage}
                </text>
            </svg>
        </div>
    )
}

export default CircularBar


const Circle = ({ radius, className, strokeWidth, strokeDashArray, strokeDashOffset }: CircleProps) => {
    return (
        <circle
            r={`${radius}`}
            cx={"50%"} cy={"50%"}
            style={{ "fill": "transparent" }}
            className={`${className}`}
            strokeWidth={strokeWidth}
            strokeDasharray={`${strokeDashArray}`}
            strokeDashoffset={`${strokeDashOffset}`}
            strokeLinecap='round' />
    )
}