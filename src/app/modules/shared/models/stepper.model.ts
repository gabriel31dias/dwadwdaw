export interface StepperModel {
  src: string;
  class?: 'selected' | 'filled' | 'unselected';
  text: string;
  disabled?: boolean;
  width?: string;
}
