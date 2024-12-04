import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';
import { NovoCliente } from '../models/new-client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private readonly API = environment.baseURL;

  constructor(private http: HttpClient) { }

  getClients(companyId: string, search: string, columns: string[]) {
    return this.http.post<any>(
      `${this.API}Cliente/Lista?empresaId=${companyId}&search=${search}`, columns
    );
  }

  createClient(companyId: string, newClient: NovoCliente) {
    return this.http.post<any>(
      `${this.API}Cliente/Criar?empresaId=${companyId}`, newClient
    );
  }

  getDetailsClient(companyId: string, search: string) {
    return this.http.get<any>(
      `${this.API}Cliente/Detalhes?empresaId=${companyId}&cdCliente=${search}`
    );
  }

  updateClient(companyId: string, newClient: NovoCliente) {
    return this.http.put<any>(
      `${this.API}Cliente/Atualizar?empresaId=${companyId}`, newClient
    );
  }

  getDataByCNPJ(cnpj: string) {
    return this.http.get<any>(
      `${this.API}Cliente/CNPJ?cnpj=${cnpj}`
    );
  }
}
