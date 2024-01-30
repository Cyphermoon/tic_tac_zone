import * as Dialog from '@radix-ui/react-dialog';
import BaseModal from './BaseModal';
import { FaTimes } from 'react-icons/fa';


interface GameInfoModalProps {
    title?: string;
    children: React.ReactNode;
    isOpen: boolean;
    closeModal: () => void;
    showCloseButton?: boolean;
}

const GameInfoDialog = ({ title, children, isOpen, closeModal, showCloseButton = true }: GameInfoModalProps) => {

    function handleClose() {
        closeModal()
    }

    return (
        <BaseModal state={isOpen} closeModal={handleClose} closeOnBackgroundClicked={false}>
            <Dialog.Content
                className='bg-white text-primary-800 w-11/12 max-w-lg rounded-xl text-left space-y-3.5 p-4  animate-in fade-in zoom-in-75 outline-none'>
                <div className={`flex w-full ${title ? "items-center justify-between" : "items-end justify-end"}`}>
                    {
                        title &&
                        <Dialog.Title className={`text-2xl font-semibold`}>{title}
                        </Dialog.Title>
                    }
                    {
                        showCloseButton &&
                        <FaTimes className={`cursor-pointer text-red-500 text-xl`} onClick={handleClose} />
                    }
                </div>
                {children}
            </Dialog.Content>
        </BaseModal>
    )
}

export default GameInfoDialog
