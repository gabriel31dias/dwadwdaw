import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';
import { ParamsListGrid } from '../../shared/models/params-list-grid.model';
import { RequestFilterColumn } from '../../shared/models/filter-column.model';
import { CreateAccountReceivable, FreightDocument } from '../models/create-account-receivable.model';
import { BaixaFatura } from '../models/bill-decrease.model';


@Injectable({
  providedIn: 'root'
})
export class ReceivableService {

  private readonly API = environment.baseURL;

  constructor(private http: HttpClient) { }

  getReceivables(body: ParamsListGrid, companyId: string) {
    return this.http.post<any>(`${this.API}ContasAReceber/Grid?empresaId=${companyId}`, body);
  }

  getColumnsFilter(companyId: string) {
    return this.http.get<any>(`${this.API}ContasAReceber/Filtros?empresaId=${companyId}`);
  }

  getLists(companyId: string) {
    return this.http.get<any>(`${this.API}ContasAReceber/Picklists?empresaId=${companyId}`);
  }

  getReceiptAccount(companyId: string, cdGroup: string) {
    return this.http.get<any>(`${this.API}Contas/ByCdGrupo?empresaId=${companyId}&cdGrupo=${cdGroup}`);
  }

  getCtesReceivable(companyId: string, key: string, filters?: RequestFilterColumn[], typeDate?: string | null, dateInit?: string, dateFinal?: string) {
    const body = {
      columns: [],
      page: 1,
      take: 1000,
      search: key,
      filtros: filters?.length! >= 1 ? filters : [],
      tipoData: typeDate ? typeDate : null,
      dataInicial: dateInit ? dateInit : null,
      dataFinal: dateFinal ? dateFinal : null,
    }
    return this.http.post<any>(`${this.API}CTe/InclusaoEmFatura?empresaId=${companyId}&chaveAcesso=${key}`, body);
  }

  getColumnsFilterCTe(companyId: string) {
    return this.http.get<any>(`${this.API}CTe/Filtros?empresaId=${companyId}`);
  }

  createBill(body: CreateAccountReceivable, companyId: string) {
    return this.http.post<any>(`${this.API}ContasAReceber?empresaId=${companyId}`, body);
  }

  sendReceivablesToEmail(companyId: string, body: { ids: string[], emailDestinatario: string }) {
    return this.http.post<any>(`${this.API}ContasAReceber/EnviarPorEmail?empresaId=${companyId}`, body);
  }

  getDetailsReceivable(companyId: string, idBill: string) {
    return this.http.get<any>(`${this.API}ContasAReceber?empresaId=${companyId}&noFatura=${idBill}`);
  }

  getCtesBill(companyId: string, idBill: string) {
    return this.http.get<any>(`${this.API}ContasAReceber/Documentos?empresaId=${companyId}&noFatura=${idBill}`);
  }

  editBill(body: CreateAccountReceivable, companyId: string) {
    return this.http.put<any>(`${this.API}ContasAReceber?empresaId=${companyId}`, body);
  }

  decreaseBill(companyId: string, decreaseBill: BaixaFatura) {
    return this.http.post<any>(`${this.API}ContasAReceber/Baixar?empresaId=${companyId}`, decreaseBill);
  }

  reverseBill(companyId: string, idsBill: string[]) {
    return this.http.post<any>(`${this.API}ContasAReceber/Estornar?empresaId=${companyId}`, { ids: idsBill });
  }

  getMovements(companyId: string, idBill: string) {
    return this.http.get<any>(`${this.API}ContasAReceber/Movimentos?empresaId=${companyId}&noFatura=${idBill}`);
  }

  cancelReceivable(companyId: string, body: { motivo: string, ids: string[] }) {
    return this.http.post<any>(`${this.API}ContasAReceber/Cancelar?empresaId=${companyId}`, body);
  }

  deleteReceivable(companyId: string, idsBill: number[]) {
    return this.http.post<any>(
      `${this.API}ContasAReceber/Excluir?empresaId=${companyId}`, { ids: idsBill }
    );
  }

  getUrlToSendRelatoryWpp(companyId: string, idsBill: string[]) {
    return this.http.post<any>(
      `${this.API}ContasAReceber/RelatorioUrl?empresaId=${companyId}`, { ids: idsBill }
    );
  }

  getHistoricReceivable(companyId: string, idBill: string) {
    return this.http.get<any>(
      `${this.API}ContasAReceber/HistoricoAlteracoes?empresaId=${companyId}&noFatura=${idBill}`
    );
  }

  getTypesMovement(companyId: string) {
    return this.http.get<any>(
      `${this.API}TipoDeMovimento/Recebimentos?empresaId=${companyId}`
    );
  }

  getCurrentAccounts(companyId: string) {
    return this.http.get<any>(
      `${this.API}ContaCorrente?empresaId=${companyId}`
    );
  }

  launchMovement(companyId: string, body: any) {
    return this.http.post<any>(
      `${this.API}ContasAReceber/Movimento?empresaId=${companyId}`, body
    );
  }

  getBanks(companyId: string) {
    return this.http.get<any>(
      `${this.API}Banco?empresaId=${companyId}`
    );
  }

  getCurrentAccountByBank(companyId: string, cdBank: string) {
    return this.http.get<any>(
      `${this.API}ContaCorrente/ByBanco?empresaId=${companyId}&cdBanco=${cdBank}`
    );
  }

  getBase64Report(companyId: string, idsBill: string[]) {
    return this.http.post<any>(
      `${this.API}ContasAReceber/RelatorioBase64?empresaId=${companyId}`, { ids: idsBill }
    );
  }

  updateCTes(companyId: string, idBill: string, ctes: FreightDocument[], valueBill: number) {
    return this.http.put<any>(
      `${this.API}ContasAReceber/Documentos?empresaId=${companyId}`, {
        noFatura: idBill,
        valorBrutoManual: valueBill,
        documentosDeFrete: ctes
      }
    );
  }

  getConfigClient(companyId: string, cdClient: string) {
    return this.http.get<any>(
      `${this.API}Cliente/CondicoesFaturamento?empresaId=${companyId}&cdCliente=${cdClient}`,
    );
  }

  getFileSendToBank(companyId: string, idBill: string, type: number){
    return this.http.get<any>(
      `${this.API}ContasAReceber/EnviarParaBanco?empresaId=${companyId}&numeroFatura=${idBill}&tipo=${type}`
    );
  }

}
