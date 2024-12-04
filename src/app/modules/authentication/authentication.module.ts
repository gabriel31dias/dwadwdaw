import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './components/auth/auth.component';
import { SelectCompanyComponent } from './components/select-company/select-company.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { KepperLoginService } from '../shared/services/kepper-login.service';


@NgModule({
  declarations: [
    LoginComponent,
    AuthComponent,
    SelectCompanyComponent,
    RecoverPasswordComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'authentication',
        component: AuthComponent,
        children: [
          {
            path: 'login',
            component: LoginComponent,
            data: { animation: 'login' },
            canActivate: [KepperLoginService]
          },
          {
            path: 'select-company',
            component: SelectCompanyComponent,
            data: { animation: 'select' },
            canActivate: [KepperLoginService]
          },
          {
            path: 'recover-password',
            component: RecoverPasswordComponent,
            data: { animation: 'recover' },
            canActivate: [KepperLoginService]
          },
          {
            path: 'change-password',
            component: ChangePasswordComponent,
            canActivate: [KepperLoginService]
          }
        ],
      },
    ]),
    TranslateModule.forChild(),
    FormsModule
  ]
})
export class AuthenticationModule { }
