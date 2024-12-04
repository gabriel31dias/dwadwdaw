import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';

import { StorageService } from '../../authentication/services/storage.service';
import { ConfiguracoesPermissoes } from '../consts/permissions.const';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  permissions: string [];
  authSettings = ConfiguracoesPermissoes;

  constructor(public router: Router,
    private storageService: StorageService
  ) {
    this.permissions = storageService.getPermissionsUser();
  }

  canActivate(state: RouterStateSnapshot): boolean {
    const url = state.url.toString();

    if (url.indexOf('settings') !== -1) {
      if (!this.permissions.includes(this.authSettings.Visualizar)) {
        this.router.navigate(['/home']);
        return false;
      }
    }

    return true;
  }
}
