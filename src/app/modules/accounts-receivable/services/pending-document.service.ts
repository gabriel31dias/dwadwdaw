import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';
import { ParamsListGrid } from '../../shared/models/params-list-grid.model';
import { CreateAccountReceivable } from '../models/create-account-receivable.model';

type RequestCreateBillingWithCTes = Pick<
  CreateAccountReceivable,
  'cdBanco'
  | 'cdConta'
  | 'cdCondicaoPagamento'
  | 'cdGrupoReceita'
  | 'cdContaReceita'
  | 'cdFilialCobranca'
  | 'cdCentroCustos'
  | 'observacoesInternas'
> & { data: string }

@Injectable({
  providedIn: 'root'
})
export class PendingDocumentService {

  private readonly API = environment.baseURL;

  constructor(private http: HttpClient) { }

  getPendingDocuments(body: ParamsListGrid, companyId: string) {
    return this.http.post<any>(`${this.API}Cte/Grid?empresaId=${companyId}`, body);
  }

  getColumnsFilter(companyId: string) {
    return this.http.get<any>(`${this.API}Cte/Filtros?empresaId=${companyId}`);
  }

  releaseCTes(companyId: string, numsCTe: number[]) {
    return this.http.post<any>(`${this.API}Cte/Liberar?empresaId=${companyId}`, {
      numsCtrc: numsCTe
    });
  }

  blockCTes(companyId: string, numsCTe: number[]) {
    return this.http.post<any>(`${this.API}Cte/Bloquear?empresaId=${companyId}`, {
      numsCtrc: numsCTe
    });
  }

  createBillingWithDocuments(companyId: string,
    numsCTes: number[],
    request: RequestCreateBillingWithCTes | null,
    useConfig: boolean,
    groupDocuments: boolean
  ) {
    return this.http.post<any>(`${this.API}Cte/Faturar?empresaId=${companyId}`, {
      numsCtrc: numsCTes,
      usarConfiguracao: useConfig,
      dadosFatura: request,
      agrupar: groupDocuments
    });
  }

}
