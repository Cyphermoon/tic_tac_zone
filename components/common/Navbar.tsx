import Logo from "./Logo"


interface Props {
    children?: React.ReactNode
}

const Navbar = ({ children }: Props) => {

    return (
        <nav className="flex justify-between items-center mb-10">
            <Logo />
            {children}
        </nav>
    )
}

export default Navbar