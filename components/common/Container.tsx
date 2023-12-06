interface Props {
    children: React.ReactNode,
    className?: string
    as?: string
}


const Container = ({ className = "", children, as }: Props) => {
    const Elem = (as || "div") as any
    return (
        <Elem className={`container max-w-7xl mx-auto ${className} px-4`}>
            {children}
        </Elem>
    )
}


export default Container