export interface CustomFormControlProps<T = string> {
  value?: T;
  onChange?: (value: T) => void;
}
