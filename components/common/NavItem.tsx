import React from 'react'

interface Props {
    children: React.ReactNode
}

const NavItem = ({ children }: Props) => {
    return (
        <li>{children}</li>
    )
}

export default NavItem