import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../../services/authentication.service';
import { Login } from '../../models/login.model';
import { StorageService } from '../../services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationComponent } from 'src/app/modules/shared/components/modais/modal-confirmation/modal-confirmation.component';
import { ModalSelectNfComponent } from 'src/app/modules/shared/components/modular-groups/nota-fiscal/modal-select-nf/modal-select-nf.component';
import { NotaFiscalGrid } from 'src/app/modules/shared/models/nota-fiscal.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  login: Login = <Login>{};
  dataEmpty: boolean = false;
  snackbar: Snackbar = new Snackbar();
  loading: boolean = false;
  cdCollectionsSelected: any[] = [];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private authService: AuthenticationService,
    private storageService: StorageService,
    private modalService: NgbModal
  ) {
    this.translate.use('pt-br');
  }

  ngOnInit(): void {}

  validationData(): boolean {
    if (!this.login.email || !this.login.senha) {
      return false;
    } else {
      return true;
    }
  }

 
  doLogin(force?: boolean) {
   
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-select-nf',
    };
    const modalRef = this.modalService.open(ModalSelectNfComponent, modalOptions);
    modalRef.componentInstance.search = '';

    modalRef.result.then((nfs: NotaFiscalGrid[]) => {
      if (nfs.length >= 1) {
        const newNFs: NotaFiscalGrid[] = nfs;
      }
    })
    .catch((res) => {

    })
  }

}
  
