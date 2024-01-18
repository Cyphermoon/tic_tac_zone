import { useState } from "react";

// Todo: separate hook from util

export function useModal (initialState: boolean | undefined) {
    const [isOpen, setIsOpen] = useState(initialState);

    const openModal = () => {
        setIsOpen(true);
        return true
    };

    const closeModal = () => {
        setIsOpen(false);
        return false
    };

    return { isOpen, openModal, closeModal };
};

export function isPlural (n: number) {
    return n > 1
}

export function sanitizePercentage(percentage: number) {
    const isNegativeOrNan = !Number.isFinite(+percentage) || percentage < 0
    const isHigh = percentage > 100

    if (isNegativeOrNan) {
        return 0
    } else if (isHigh) {
        return 100
    } else {
        return percentage
    }

}
