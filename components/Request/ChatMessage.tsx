import React from 'react'
import UserAvatar from '../common/UserAvatar'
import { UserAvatarProps } from '../common/type'
import clsx from 'clsx'

interface Props {
    text: string
    avatar: UserAvatarProps
    right?: boolean
}

const ChatMessage = ({ text, avatar, right }: Props) => {
    const messageClass = clsx("max-w-xs rounded-xl py-3 lg:py-5 px-3",
        { "bg-accent text-white": right },
        { "bg-[#E1E1E1]": !right }
    )

    return (
        <div className={`flex items-end space-x-2 ${right ? "self-end" : "self-start"}`}>
            {!right && <UserAvatar {...avatar} className='w-[25px] h-[25px]' />}

            <div className={messageClass}>
                <p className="text-sm">{text}</p>
            </div>
        </div>
    )
}

export default ChatMessage