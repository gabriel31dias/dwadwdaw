import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';
import { StorageService } from '../../services/storage.service';
import { Login } from '../../models/login.model';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  login: Login = <Login>{};
  confirmNewPass: string = '';
  forceRequired: boolean = false;
  snackbar: Snackbar = new Snackbar();

  constructor(private translate: TranslateService,
    private authService: AuthenticationService,
    private storageService: StorageService,
    private router: Router
  ) {
    this.translate.use('pt-br');

    if (storageService.getEmail()) {
      this.login.email = storageService.getEmail()!;
    } else {
      router.navigate(['/authentication/recover-password'])
    }
  }

  changePassword(event: boolean) {
    if (!this.login.senha.trim() || !this.confirmNewPass.trim()) {
      this.forceRequired = true;
      return
    }

    if (this.login.senha.length < 8) {
      this.snackbar.open = true;
      this.snackbar.message = 'conter8Caracteres';
      return
    }

    if (this.login.senha.trim() === this.confirmNewPass.trim()) {
      this.authService.changePassword(this.login).subscribe({
        next: (response) => {
          this.router.navigate(['/authentication/login'])
        },
        error: (response) => {
          this.snackbar.open = true;
          this.snackbar.message = response.error.mensagem
          this.snackbar.errorHandling = response.error.tratamentoErro
        }
      })
    } else {
      this.snackbar.open = true;
      this.snackbar.message = 'senhasNaoCoincidem';
    }

  }

}
