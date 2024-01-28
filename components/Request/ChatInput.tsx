import { ChangeEvent, FormEvent } from "react";
import { IoSendSharp } from "react-icons/io5";

interface Props {
    message: string;
    setMessage: (message: string) => void;
    sendMessage: (event: FormEvent) => Promise<void>;
}

const ChatInput = ({ message, setMessage, sendMessage }: Props) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    return (
        <form className="flex items-center space-x-4 w-full max-w-md mx-auto" onSubmit={sendMessage}>
            <input
                type="search"
                placeholder="Send Message....."
                className="grow bg-[#E1E1E1] rounded-full px-4 py-3 focus:outline-none"
                value={message}
                onChange={handleChange}
            />

            <button type="submit">
                <IoSendSharp className="text-2xl text-secondary" />
            </button>
        </form>
    )
}

export default ChatInput