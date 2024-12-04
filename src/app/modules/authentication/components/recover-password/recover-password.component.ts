import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../../services/authentication.service';
import { StorageService } from '../../services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent {

  email: string = '';
  snackbar: Snackbar = new Snackbar();

  constructor(private translate: TranslateService,
    private router: Router,
    private authService: AuthenticationService,
    private storageService: StorageService) {
    this.translate.use('pt-br');
  }

  sendEmail(event: boolean) {
    this.authService.sendEmail(this.email.trim().toLocaleLowerCase()).subscribe({
      next: (response) => {
        localStorage.removeItem('email');
        this.storageService.setEmail(this.email);
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  return(event: boolean) {
    this.router.navigate(['/authentication/login'])
  }

}
