import { SnackbarType } from "../consts/snackbar-type.const";

export class Snackbar {
  open: boolean = false;
  message: string = '';
  errorHandling: string = '';
  type: SnackbarType = SnackbarType.Default;
  timeHide: number = 3000;
}
