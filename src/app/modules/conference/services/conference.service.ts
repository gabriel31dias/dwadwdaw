import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';
import { RequestFilterColumn } from '../../shared/models/filter-column.model';
import { ParamsListConference } from '../models/params-list-conference.model';
import { NovaNotaFiscal } from '../../shared/models/new-invoice.model';
import { AcessoPermissaoConferenciaModel } from '../models/check-acesss.model';

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {

  private readonly API = environment.baseURL;

  constructor(private http: HttpClient) { }

  setConference(companyId: string, conference: any) {
    return this.http.post<any>(
      `${this.API}Conferencia/GeraConferenciaProcedure?empresaId=${companyId}`, conference
    );
  }

  getDetailConference(companyId: string, key: any) {
    return this.http.get<any>(
      `${this.API}Conferencia/NotasFiscais?empresaId=${companyId}&idconferencia=${key}`
    );
  }

  getTotalConferenceStatus(companyId: string) {
    return this.http.get<any>(
      `${this.API}Conferencia/ContadoresStatus?empresaId=${companyId}`
    );
  }

  getColumnsFilter(companyId: string) {
    return this.http.get<any>(`${this.API}Conferencia/Filtros?empresaId=${companyId}`);
  }

  getConferences(body: ParamsListConference, companyId: string) {
    return this.http.post<any>(`${this.API}Conferencia/ListarComFiltros?empresaId=${companyId}`, body);
  }

  getInvoices(companyId: string, key: string) {
    return this.http.get<any>(
      `${this.API}NotaFiscal/ChaveAcessoOuCodigoColeta?empresaId=${companyId}&chaveAcesso=${key}`
    );
  }

  getTags(companyId: string) {
    return this.http.get<any>(
      `${this.API}ConfigEtiquetaVolume?empresaId=${companyId}`
    );
  }

  getVolumes(companyId: string, conferenceId: number) {
    return this.http.get<any>(
      `${this.API}NfVolumeHistorico/Tratado?empresaId=${companyId}&idConferencia=${conferenceId}`
    );
  }

  checkVolum(companyId: string, volumToCheck: any) {
    return this.http.put<any>(
      `${this.API}NfVolumeHistorico/BaixaVolume?empresaId=${companyId}`, volumToCheck
    );
  }

  finishConference(companyId: string, reqBody: { idConferencia: number, motivoDesacordo: string | null, usuario?: any, autorizadoBaixaEmDesacordo: boolean}) {
    reqBody.usuario = null;
    return this.http.put<any>(
      `${this.API}Conferencia/Baixar?empresaId=${companyId}`, reqBody
    );
  }

  initConference(companyId: string, idConference: number) {
    return this.http.put<any>(
      `${this.API}Conferencia/Iniciar?empresaId=${companyId}`, { idConferencia: idConference }
    );
  }

  printTagsConference(companyId: string, idConference: number) {
    return this.http.post<any>(
      `${this.API}Conferencia/ImprimirEtiquetas?empresaId=${companyId}`, {
        idconferencia: String(idConference)
      }
    );
  }

  printTagVolume(companyId: string, idConference: number, typeBarCode: number, barCode: string) {
    return this.http.get<any>(
      `${this.API}Conferencia/ImprimirEtiqueta?empresaId=${companyId}&idConferencia=${idConference}&tipoCodigoBarras=${typeBarCode}&codigoBarras=${barCode}`
    );
  }

  printTagSingleVolume(companyId: string, idConference: number, idHistoric: number, volume: string) {
    return this.http.post<any>(
      `${this.API}Conferencia/ImprimirEtiqueta?empresaId=${companyId}&idConferencia=${idConference}&idHistorico=${idHistoric}&volume=${volume}`, {}
    );
  }

  deleteConference(companyId: string, idsConference: number[]) {
    return this.http.post<any>(
      `${this.API}Conferencia/MassDelete?empresaId=${companyId}`, { intIds: idsConference }
    );
  }

  cancelConference(companyId: string, idsConference: number[], reason: string) {
    return this.http.put<any>(
      `${this.API}Conferencia/Cancelar?empresaId=${companyId}`, {
        intIds: idsConference,
        motivoCancelamento: reason
      }
    );
  }

  postInvoice(companyId: string, invoice: NovaNotaFiscal) {
    return this.http.post<any>(
      `${this.API}NotaFiscal?empresaId=${companyId}`, invoice
    );
  }

  getDetailsInvoice(companyId: string, idInvoice: number, cdFilial: string) {
    return this.http.get<any>(
      `${this.API}NotaFiscal/${idInvoice}?cdFilial=${cdFilial}&empresaId=${companyId}`
    );
  }

  editInvoice(companyId: string, invoice: NovaNotaFiscal) {
    return this.http.put<any>(
      `${this.API}NotaFiscal?empresaId=${companyId}`, invoice
    );
  }

  callProcedureFlag(companyId: string, body: { idconferencia: number, nonf: number, qtdetiqueta: string, cdempresa: string, cdfilemp: string }) {
    return this.http.put<any>(
      `${this.API}Conferencia/QuantidadeEtiquetasProcedure?empresaId=${companyId}`, body
    );
  }

  getHistoricVolum(companyId: string, typeBarCode: number, barCode: string) {
    return this.http.post<any>(
      `${this.API}NfVolumeHistorico/SearchByBarcode?empresaId=${companyId}`, {
        tipoCodigoBarras: typeBarCode,
        codigoBarras: barCode,
        apenasMaisRecente: false
      }
    );
  }

  getHistoricConference(companyId: string, idConference: number) {
    return this.http.get<any>(
      `${this.API}Conferencia/HistoricoAlteracoes/${idConference}?empresaId=${companyId}`
    );
  }

  sendEmail(companyId: string, idsConference: number[]) {
    return this.http.post<any>(
      `${this.API}Conferencia/EnviarPorEmail?empresaId=${companyId}`, { ids: idsConference }
    );
  }

  getDetailsStatusConference(companyId: string, idConference: number) {
    return this.http.get<any>(
      `${this.API}Conferencia/DetalhamentoStatus/${idConference}?empresaId=${companyId}`
    );
  }

  getUrlToSendRelatoryWpp(companyId: string, idsConference: number[]) {
    return this.http.post<any>(
      `${this.API}Conferencia/RelatorioUrl?empresaId=${companyId}`, { ids: idsConference }
    );
  }

  getBase64Report(companyId: string, idsBill: number[]) {
    return this.http.post<any>(
      `${this.API}Conferencia/RelatorioBase64?empresaId=${companyId}`, { ids: idsBill }
    );
  }

  getTypesConference(companyId: string) {
    return this.http.get<any>(
      `${this.API}TipoDeConferencia?empresaId=${companyId}`
    );
  }

  deleteVolumeNotFound(companyId: string, volumeId: number) {
    return this.http.put<any>(
      `${this.API}Conferencia/ExcluirVolumes?empresaId=${companyId}`, {
        ids: [ volumeId ]
      }
    );
  }

  checkAccess(companyId: string, body:AcessoPermissaoConferenciaModel) {
    return this.http.post<any>(
      `${this.API}Conferencia/VerificaAcessoFinalizarComDesacordo?empresaId=${companyId}`, body
    );
  }

  checkInvoice(companyId: string, conferenceId: number, key: string) {
    return this.http.get<any>(
      `${this.API}Conferencia/BaixaNotaFiscal?empresaId=${companyId}&conferenciaId=${conferenceId}&chave=${key}`
    );
  }

  getInvoicesToCheck(companyId: string, conferenceId: number){
    return this.http.get<any>(
      `${this.API}Conferencia/NotasFiscaisConferencias?empresaId=${companyId}&conferenciaId=${conferenceId}`
    );
  }

  deleteNFNotFound(companyId: string, idConferenceNF: number) {
    return this.http.delete<any>(
      `${this.API}Conferencia/ExcluirNotaNaoEncontrada/${idConferenceNF}?empresaId=${companyId}`,
    );
  }
}
