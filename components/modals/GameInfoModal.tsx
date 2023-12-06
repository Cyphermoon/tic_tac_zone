import * as Dialog from '@radix-ui/react-dialog';
import BaseModal from './BaseModal';
import { FaTimes } from 'react-icons/fa';


interface GameInfoModalProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    closeModal: () => void;
}

const GameInfoDialog = ({ title, children, isOpen, closeModal }: GameInfoModalProps) => {

    function handleClose() {
        closeModal()
    }

    return (
        <BaseModal state={isOpen} closeModal={handleClose}>
            <Dialog.Content
                className='bg-white text-primary-800 w-10/12 max-w-lg rounded-xl text-left space-y-3.5 p-4  animate-in fade-in zoom-in-75 outline-none'>
                <div className='flex justify-between items-center'>
                    <Dialog.Title className={`text-2xl font-semibold`}>{title}</Dialog.Title>
                    <FaTimes className='cursor-pointer text-red-500 text-xl' onClick={handleClose} />
                </div>
                <div className='text-sm font-normal h-96 overflow-y-scroll hide-scrollbar'>{children}</div>
            </Dialog.Content>
        </BaseModal>
    )
}

export default GameInfoDialog
