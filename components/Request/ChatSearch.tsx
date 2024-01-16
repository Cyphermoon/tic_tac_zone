import { IoSendSharp } from "react-icons/io5";

const ChatSearch = () => {
    return (
        <form className="flex items-center space-x-4 w-full max-w-md mx-auto">
            <input type="search" placeholder="Send Message....." className="grow bg-[#E1E1E1] rounded-full px-4 py-3 focus:outline-none" />

            <button>
                <IoSendSharp className="text-2xl text-secondary" />
            </button>
        </form>
    )
}

export default ChatSearch