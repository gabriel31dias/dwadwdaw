import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';
import { NotaFiscalBase64 } from '../models/invoice-base64.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private readonly API = environment.baseURL;
  private readonly APIV2 = environment.baseURLV2;

  constructor(private http: HttpClient) { }

  uploadInvoiceXML(companyId: string, invoicesXML: NotaFiscalBase64[]) {
    return this.http.post<any>(
      `${this.API}NotaFiscal/FromXml?empresaId=${companyId}`, { arquivos: invoicesXML }
    );
  }

  /** API `POST` de criação de Nota fical a partir de um arquivo XML em formato Base64.
   * @param companyId Id da empresa.
   * @param invoicesXML Arquivos de XML de Nota fiscal em Base64.
   * @returns Retorna duas listas. Lista 1: Lista de objetos de notas fiscais criadas. Lista 2: Lista de nomes de arquivos que são inválidos.
  */
  uploadInvoiceXMLV2(companyId: string, invoicesXML: NotaFiscalBase64[]) {
    return this.http.post<any>(
      `${this.APIV2}NotaFiscal/Xml?empresa_id=${companyId}`, { arquivos: invoicesXML }
    );
  }
}
