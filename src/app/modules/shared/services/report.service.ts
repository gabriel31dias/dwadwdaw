import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';
import { Modules } from '../consts/list-modules.const';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly API = environment.baseURL;

  /** Construtor da classe `NotaFiscalService`.
   * @param httpClient Serviço responsável pelas requisições HTTP.
  */
  constructor(private httpClient: HttpClient) { }

  /** API `GET` de lista de relatórios por módulo.
   * @param companyId Id da empresa.
   * @param module Módulo do relatório que deve ser retornado.
   * @returns Retorna uma lista de relatórios de acordo com o módulo informado.
  */
  getReports(module: Modules) {
    return this.httpClient.get<any>(
      `${this.API}Relatorio/Lista?modulo=${module}`
    );
  }
}
