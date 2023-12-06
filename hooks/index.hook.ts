import { useState } from "react";

export const useModal = (initialState: boolean | undefined) => {
    const [isOpen, setIsOpen] = useState(initialState);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return { isOpen, openModal, closeModal };
};
