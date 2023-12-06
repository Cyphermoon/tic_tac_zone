import Logo from "./Logo"


interface Props {
    children: React.ReactNode
}

const Navbar = ({ children }: Props) => {

    return (
        <nav className="flex justify-between items-center">
            <Logo />

            <ul className="flex items-center space-x-4 lg:space-x-8 flex-row">
                {children}
            </ul>
        </nav>
    )
}

export default Navbar