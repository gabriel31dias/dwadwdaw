import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from './modules/shared/components/template/template.component';
import { GuardService } from './modules/shared/services/guard.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'authentication/login' },
  { path: 'authentication', pathMatch: 'full', redirectTo: 'authentication/login' },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./modules/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: 'home',
    component: TemplateComponent,
    loadChildren: () =>
      import('./modules/home/home.module').then(
        (m) => m.HomeModule
      ),
  },
  {
    path: 'collection',
    component: TemplateComponent,
    loadChildren: () =>
      import('./modules/collection/collection.module').then(
        (m) => m.CollectionModule
      ),
  },
  {
    path: 'conference',
    component: TemplateComponent,
    loadChildren: () =>
      import('./modules/conference/conference.module').then(
        (m) => m.ConferenceModule
      ),
  },
  {
    path: 'accounts-receivable',
    component: TemplateComponent,
    loadChildren: () =>
      import('./modules/accounts-receivable/accounts-receivable.module').then(
        (m) => m.AccountsReceivableModule
      ),
  },
  {
    path: 'accounts-payable',
    component: TemplateComponent,
    loadChildren: () =>
      import('./modules/accounts-payable/accounts-payable.module').then(
        (m) => m.AccountsPayableModule
      ),
  },
  {
    path: 'settings',
    component: TemplateComponent,
    canActivate: [GuardService],
    loadChildren: () =>
      import('./modules/settings/settings.module').then(
        (m) => m.SettingsModule
      ),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
