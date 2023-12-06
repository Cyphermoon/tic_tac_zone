export type ModalId = number;

export interface SharedBaseModalProps {
  state: boolean;
  closeModal: () => void;
}

export type NotificationModalProps = SharedBaseModalProps & {
  title: string
  description?: string
  illustration?: string
}


export type BaseModalProps = SharedBaseModalProps & {
  children: React.ReactNode;
  closeOnBackgroundClicked?: boolean;
};
