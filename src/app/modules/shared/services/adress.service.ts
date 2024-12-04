import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdressService {

  private readonly API = environment.baseURL;

  constructor(private http: HttpClient) { }

  getAdress(cep: string) {
    return this.http.get<any>(
      `${this.API}Coleta/Endereco?cep=${cep}`,
    );
  }


  getCities(companyId: string, search: string, uf?: string | null) {
    if (!search) search = '';
    if (!uf) uf = '';
    return this.http.get<any>(
      `${this.API}Cidade/Lista?empresaId=${companyId}&search=${search}&uf=${uf}`,
    );
  }
}
