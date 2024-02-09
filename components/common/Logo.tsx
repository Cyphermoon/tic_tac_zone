import { FaArrowLeft } from "react-icons/fa"
import { useCurrentPlayer } from "../Home/store"
import { usePathname, useRouter } from "next/navigation"


const Logo = () => {
    const currentPlayerName = useCurrentPlayer(state => state.name)
    const router = useRouter()
    const pathname = usePathname()


    function handleLogoClicked() {
        if (pathname !== "/") {
            router.back()
            return
        }
        router.push('/')
    }

    return (
        <div>
            <button onClick={handleLogoClicked} className="flex items-centr space-x-4" >
                {pathname !== "/" && <FaArrowLeft className="text-accent text-xl font-bold" />}
                <p className="text-xl font-bold">TicTac <span className="text-accent">Zone</span></p>
            </button>
            <span className="text-gray-400 text-sm uppercase underline">{currentPlayerName}</span>
        </div>
    )
}

export default Logo