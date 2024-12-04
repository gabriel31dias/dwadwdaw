import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';
import { Modules } from '../consts/list-modules.const';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  private readonly API = environment.baseURL;

  constructor(private http: HttpClient) { }

  getHeaders(companyId: string, module: Modules) {
    return this.http.get<any>(
      `${this.API}Grid/Header?empresaId=${companyId}&modulo=${module}`
    );
  }

}
