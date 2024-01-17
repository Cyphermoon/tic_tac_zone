import Link from "next/link"

const Logo = () => {
    return (
        <div>
            <Link href="/" >
                <p className="text-xl font-bold">TicTac <span className="text-accent">Zone</span></p>
            </Link>
        </div>
    )
}

export default Logo