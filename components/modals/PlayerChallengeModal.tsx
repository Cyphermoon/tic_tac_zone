import * as Dialog from '@radix-ui/react-dialog';
import BaseModal from './BaseModal';
import { FaTimes } from 'react-icons/fa';


interface PlayerChallengeModal {
    children: React.ReactNode;
    isOpen: boolean;
    closeModal: () => void;
}

const PlayerChallengeModal = ({ children, isOpen, closeModal }: PlayerChallengeModal) => {

    function handleClose() {
        closeModal()
    }

    return (
        <BaseModal state={isOpen} closeModal={handleClose}>
            <Dialog.Content
                className='bg-card text-primary-800 w-11/12 max-w-md rounded-xl p-4 animate-in fade-in zoom-in-75 outline-none'>
                <div className='flex'>
                    <FaTimes className='cursor-pointer text-red-500 text-xl justify-self-end ml-auto' onClick={handleClose} />
                </div>
                <div className='flex flex-col items-center'>{children}</div>
            </Dialog.Content>
        </BaseModal>
    )
}

export default PlayerChallengeModal
