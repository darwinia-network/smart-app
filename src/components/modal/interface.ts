export interface IModalProps<T = unknown> {
  account?: string;
  isVisible: boolean;
  confirm?: (account?: T) => void;
  cancel: () => void;
}
