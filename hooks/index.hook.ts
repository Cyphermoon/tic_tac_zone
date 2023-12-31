import { useState } from "react";

export function useModal (initialState: boolean | undefined) {
    const [isOpen, setIsOpen] = useState(initialState);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return { isOpen, openModal, closeModal };
};

export function isPlural (n: number) {
    return n > 1
}
