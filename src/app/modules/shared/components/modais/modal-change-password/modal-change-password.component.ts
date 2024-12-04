import { Component } from '@angular/core';
import { Snackbar } from '../../../models/snackbar.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { SharedService } from 'angular-slickgrid';
import { Login } from 'src/app/modules/authentication/models/login.model';

@Component({
  selector: 'app-modal-change-password',
  templateUrl: './modal-change-password.component.html',
  styleUrls: ['./modal-change-password.component.scss'],

})
export class ModalChangePasswordComponent {
  login: Login = <Login>{};
  dataEmpty: boolean = false;
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();

  constructor(private modal: NgbActiveModal,
  ) {

  }

  close() {
    this.modal.close();
  }
  confirm() {
    this.modal.close();
  }


}
