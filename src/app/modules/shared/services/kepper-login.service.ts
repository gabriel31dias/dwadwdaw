import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';

import { StorageService } from '../../authentication/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class KepperLoginService {

  constructor(public router: Router,
    private storageService: StorageService
  ) { }

  canActivate(state: RouterStateSnapshot): boolean {
    const url = state.url.toString();

    if (url == 'login') {
      if (this.storageService.getToken()) {
        this.router.navigate(['/authentication/select-company']);
        return false;
      }
    } else if (url == 'select-company') {
      if (this.storageService.getCompanyId()) {
        this.router.navigate(['/home']);
        return false;
      }
    } else if (url == 'recover-password' || url == 'change-password') {
      if (this.storageService.getToken() && this.storageService.getCompanyId()) {
        this.router.navigate(['/home']);
        return false;
      } else if (this.storageService.getToken() && !this.storageService.getCompanyId()) {
        this.router.navigate(['/authentication/select-company']);
        return false;
      }
    }

    return true;
  }
}
