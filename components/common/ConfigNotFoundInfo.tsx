import React from 'react'

interface Props {
    children: React.ReactNode
}

const ConfigNotFoundInfo = ({ children }: Props) => {
    return (
        <section className="bg-card rounded-xl w-full max-w-md p-4 flex flex-col items-center mx-auto space-y-6">
            {children}
        </section>
    )
}

export default ConfigNotFoundInfo