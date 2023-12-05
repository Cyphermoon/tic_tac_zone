import Logo from "./Logo"

interface Props{
    children: React.ReactNode
}

const Navbar = ({children}: Props) => {
    return(
        <nav className="flex justify-between">
            <Logo/>

            <ul className="flex items-center space-x-6">
                {children}
            </ul>
        </nav>
    )
}

export default Navbar