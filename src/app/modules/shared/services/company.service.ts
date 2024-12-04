import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private readonly API = environment.baseURL;

  constructor(private http: HttpClient) { }

  getSubsidiaryByCity(companyId: string, cdCity: string) {
    return this.http.get<any>(
      `${this.API}Empresa/FilialByCidade?empresaId=${companyId}&cdCidade=${cdCity}`,
    );
  }

  getSubsidiaries(companyId: string) {
    return this.http.get<any>(
      `${this.API}Empresa/Filiais?empresaId=${companyId}`,
    );
  }

}
