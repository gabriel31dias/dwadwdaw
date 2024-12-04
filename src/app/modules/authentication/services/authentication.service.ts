import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Login } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly API = environment.baseURL;

  constructor(private http: HttpClient) { }

  doLogin(login: Login) {
    return this.http.post<any>(
      `${this.API}Autenticacao/login`,
      login
    );
  }

  sendEmail(email: string) {
    return this.http.get<any>(
      `${this.API}Autenticacao/esqueci-a-senha/${email}`,
    );
  }

  changePassword(login: Login) {
    return this.http.post<any>(
      `${this.API}Autenticacao/resetar-senha`,
      login
    );
  }

  getCompaniesOfUser() {
    return this.http.get<any>(
      `${this.API}Usuario/listar-empresas`,
    );
  }

  doLogout() {
    return this.http.get<any>(
      `${this.API}Autenticacao/logout`,
    );
  }

  /** API `GET` de login em empresa matriz.
   * @param companyId Id da empresa em que deseja realizar o login.
   * @returns Retorna `Sucesso` se o login na empresa foi realizado com sucesso, ou `Erro` se houve algum erro ao efeturar o login.
  */
  loginCompany(companyId: string) {
    return this.http.get<any>(
      `${this.API}Autenticacao/Empresa?empresa_id=${companyId}`,
    );
  }
}
