import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

import { environment } from 'src/environments/environment.development';
import { EmpresaUsuario } from '../../shared/models/companies-user.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private router: Router) { }

  setEmail(email: string) {
    localStorage.setItem(
      'email',
      CryptoJS.AES.encrypt(email, environment.key).toString()
    );
  }

  getEmail(): string | null {
    if (localStorage.getItem('email') != null) {
      return CryptoJS.AES.decrypt(
        localStorage.getItem('email') as string,
        environment.key
      ).toString(CryptoJS.enc.Utf8);
    } else if (sessionStorage.getItem('email')) {
      return CryptoJS.AES.decrypt(
        sessionStorage.getItem('email') as string,
        environment.key
      ).toString(CryptoJS.enc.Utf8);
    } else {
      return null;
    }
  }

  setCompany(company: EmpresaUsuario) {
    localStorage.setItem(
      'companyId',
      CryptoJS.AES.encrypt(company.empresaId, environment.key).toString()
    );

    localStorage.setItem(
      'companyName',
      CryptoJS.AES.encrypt(company.nomeFantasia, environment.key).toString()
    );

    if (company.cdFilial) {
      localStorage.setItem(
        'cdSubsidiary',
        CryptoJS.AES.encrypt(company.cdFilial, environment.key).toString()
      );
    }
  }

  getCompanyId(): string | null {
    if (localStorage.getItem('companyId') != null) {
      return CryptoJS.AES.decrypt(
        localStorage.getItem('companyId') as string,
        environment.key
      ).toString(CryptoJS.enc.Utf8);
    } else if (sessionStorage.getItem('companyId')) {
      return CryptoJS.AES.decrypt(
        sessionStorage.getItem('companyId') as string,
        environment.key
      ).toString(CryptoJS.enc.Utf8);
    } else {
      return null;
    }
  }

  getSubsidiaryId(): string | null {
    if (localStorage.getItem('cdSubsidiary') != null) {
      return CryptoJS.AES.decrypt(
        localStorage.getItem('cdSubsidiary') as string,
        environment.key
      ).toString(CryptoJS.enc.Utf8);
    } else if (sessionStorage.getItem('cdSubsidiary')) {
      return CryptoJS.AES.decrypt(
        sessionStorage.getItem('cdSubsidiary') as string,
        environment.key
      ).toString(CryptoJS.enc.Utf8);
    } else {
      return null;
    }
  }

  getCompanyName(): string | null {
    if (localStorage.getItem('companyName') != null) {
      return CryptoJS.AES.decrypt(
        localStorage.getItem('companyName') as string,
        environment.key
      ).toString(CryptoJS.enc.Utf8);
    } else if (sessionStorage.getItem('companyName')) {
      return CryptoJS.AES.decrypt(
        sessionStorage.getItem('companyName') as string,
        environment.key
      ).toString(CryptoJS.enc.Utf8);
    } else {
      return null;
    }
  }

  setToken(token: string) {
    localStorage.setItem(
      'tokenId',
      CryptoJS.AES.encrypt(token, environment.key).toString()
    );
  }

  getToken(): string | null {
    if (localStorage.getItem('tokenId') != null) {
      return CryptoJS.AES.decrypt(
        localStorage.getItem('tokenId') as string,
        environment.key
      ).toString(CryptoJS.enc.Utf8);
    } else if (sessionStorage.getItem('tokenId')) {
      return CryptoJS.AES.decrypt(
        sessionStorage.getItem('tokenId') as string,
        environment.key
      ).toString(CryptoJS.enc.Utf8);
    } else {
      return null;
    }
  }

  doLogout() {
    sessionStorage.clear();
    localStorage.removeItem('email');
    localStorage.removeItem('companyId');
    localStorage.removeItem('companyName');
    localStorage.removeItem('cdSubsidiary');
    localStorage.removeItem('tokenId');
    localStorage.removeItem('nameUser');
    this.router.navigate(['/authentication/login'])
  }

  setNameUser(name: string) {
    localStorage.setItem(
      'nameUser',
      CryptoJS.AES.encrypt(name, environment.key).toString()
    );
  }

  getNameUser(): string | null {
    if (localStorage.getItem('nameUser') != null) {
      return CryptoJS.AES.decrypt(
        localStorage.getItem('nameUser') as string,
        environment.key
      ).toString(CryptoJS.enc.Utf8);
    } else if (sessionStorage.getItem('nameUser')) {
      return CryptoJS.AES.decrypt(
        sessionStorage.getItem('nameUser') as string,
        environment.key
      ).toString(CryptoJS.enc.Utf8);
    } else {
      return null;
    }
  }

  setConfigGrid(grid: any[], key: string) {
    localStorage.setItem(
      key,
      CryptoJS.AES.encrypt(JSON.stringify(grid), environment.key).toString()
    );
  }

  setHideGridColumns(columnsHide: any[], key: string) {
    localStorage.setItem(
      key,
      CryptoJS.AES.encrypt(JSON.stringify(columnsHide), environment.key).toString()
    );
  }

  getConfigGrid(key: string): any[] | [] {
    const encryptedData = localStorage.getItem(key);

    if (encryptedData) {
      const decryptedData = CryptoJS.AES.decrypt(encryptedData, environment.key).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } else {
      return [];
    }
  }

  getHideGridColumns(key: string): any[] {
    const encryptedData = localStorage.getItem(key);

    if (encryptedData) {
      const decryptedData = CryptoJS.AES.decrypt(encryptedData, environment.key).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } else {
      return [];
    }
  }

  setFiltersGrid(filters: any, key: string) {
    localStorage.setItem(
      key,
      CryptoJS.AES.encrypt(JSON.stringify(filters), environment.key).toString()
    );
  }

  getFiltersGrid(key: string): any | null {
    const encryptedData = localStorage.getItem(key);

    if (encryptedData) {
      const decryptedData = CryptoJS.AES.decrypt(encryptedData, environment.key).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } else {
      return null;
    }
  }

  setPermissionsUser(permissions: string[]) {
    localStorage.setItem(
      'permissionsUser',
      CryptoJS.AES.encrypt(JSON.stringify(permissions), environment.key).toString()
    );
  }

  getPermissionsUser(): string[] {
    const encryptedData = localStorage.getItem('permissionsUser');

    if (encryptedData) {
      const decryptedData = CryptoJS.AES.decrypt(encryptedData, environment.key).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } else {
      return [];
    }
  }
}
