import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private readonly API = environment.baseURL;

  constructor(private http: HttpClient) { }

  getSubsidiaries(companyId: string) {
    return this.http.get<any>(
      `${this.API}Empresa/Filiais?empresaId=${companyId}`,
    );
  }

  changeSubsidiary(companyId: string, cdSubsidiary: string) {
    return this.http.post<any>(
      `${this.API}Empresa/DefinirFilial?empresaId=${companyId}`, { codigoFilial: cdSubsidiary }
    );
  }

}
