import * as Dialog from '@radix-ui/react-dialog';
import { BaseModalProps } from './type';

const BaseModal = ({ state, closeModal, children, closeOnBackgroundClicked = true }: BaseModalProps) => {

    function handleCloseBackgroundClose(e: React.MouseEvent) {
        if (e.target === e.currentTarget && closeOnBackgroundClicked) {
            closeModal()
        }
    }
    return (
        <Dialog.Root open={state}>
            <Dialog.Overlay
                onClick={handleCloseBackgroundClose}
                className='bg-black/80 backdrop-blur-[1px] animate-in fade-in-0 duration-500 fixed top-0 left-0 w-screen h-screen !m-0 flex items-center justify-center' >
                {children}
            </Dialog.Overlay>
        </Dialog.Root>
    )
}

export default BaseModal

