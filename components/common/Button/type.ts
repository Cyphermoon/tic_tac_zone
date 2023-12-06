export interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    tabIndex?: number;
    variant?: "inverse" | "normal" | "muted";
    className?: string;
    disableZoomOutEffect?: boolean
    fullWidth?: boolean
    icon_rounded?: boolean
    handleClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
