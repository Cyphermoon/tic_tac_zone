import clsx from "clsx";
import { CustomButtonProps } from "./type";


const Button = ({
    children,
    variant = "normal",
    fullWidth,
    className,
    tabIndex = 0,
    disableZoomOutEffect,
    disabled,
    icon_rounded,
    handleClick,
    ...rest
}: CustomButtonProps) => {
    // Generate dynamic class names based on variant and fullWidth
    const buttonClass = clsx(
        `transition  capitalize text-base cursor-pointer`,
        {
            "px-3 py-3 lg:px-5 lg:py-2 rounded-full lg:rounded-lg flex justify-center items-center space-x-0 lg:space-x-2": icon_rounded,
            "px-5 py-2 inline-block  rounded-lg": !icon_rounded,
        },

        {
            "bg-accent text-white": variant === "normal",
            "bg-primary text-accent": variant === "inverse",
            "text-accent-900, bg-gray-200": variant === "muted",
            "w-full": fullWidth,
            "hover:opacity-80 hover:scale-95": !disableZoomOutEffect,
            "opacity-70 pointer-events-none select-none": disabled,
        }
    );

    return (
        <button
            tabIndex={tabIndex}
            onClick={handleClick}
            className={`${buttonClass} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
