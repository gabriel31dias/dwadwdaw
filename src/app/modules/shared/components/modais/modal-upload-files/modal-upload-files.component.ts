import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Snackbar } from '../../../models/snackbar.model';
import { InvoiceService } from '../../../services/invoice.service';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { NotaFiscalBase64 } from '../../../models/invoice-base64.model';

@Component({
  selector: 'app-modal-upload-files',
  templateUrl: './modal-upload-files.component.html',
  styleUrls: ['./modal-upload-files.component.scss']
})
export class ModalUploadFilesComponent {

  companyId: string;
  files: File[] = [];
  snackbar: Snackbar = new Snackbar();
  loading: boolean = false;
  invoicesBase64: NotaFiscalBase64[] = [];
  numInvoices: string[] = [];
  xmlInvalid: string[] = [];

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal,
    private invoiceService: InvoiceService,
    private storage: StorageService
  ) {
    this.companyId = storage.getCompanyId()!;
    translate.use('pt-br')
  }

  // Fecha o modal.
  close() {
    this.modal.close();
  }

  // Insere no array "files" o(s) arquivo(s) que o usuário selecionou.
  onFileSelected(event: any) {
    const fileElements = event.srcElement.files;

    for (let i = 0; i < fileElements.length; i++) {
      const fileElement = fileElements[i];

      if (this.hasValidFile(fileElement)) {
        for (const file of this.files) {
          fileElement.name === file.name ? this.removeFile(file) : '';
        }
        this.files.push(fileElement);
      } else {
        this.snackbar.open = true;
        this.snackbar.message = 'arquivoInvalido';
      }
    }
  }

  // Insere no array "files" o(s) arquivo(s) que o usuário arrastou e soltou.
  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const fileElement = files[i];

      if (this.hasValidFile(fileElement)) {
        for (const file of this.files) {
          fileElement.name === file.name ? this.removeFile(file) : '';
        }
        this.files.push(fileElement);
      } else {
        this.snackbar.open = true;
        this.snackbar.message = 'arquivoInvalido';
      }
    }
  }

  // Remove o arquivo selecionado.
  removeFile(file: File) {
    this.files.splice(this.files.indexOf(file), 1)
  }

  // Vertifica se o arquivo selecionado é um arquivo com formato e tamanho válido.
  hasValidFile(file: File): boolean {
    const maxSize: number = 5000000;
    const validExtensions = [ 'text/xml', 'application/xml' ];

    if (file.size <= maxSize) {
      if (file.type) {
        return validExtensions.includes(file.type.toLocaleLowerCase());
      } else {
        const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
        return validExtensions.includes(fileExtension);
      }
    } else {
      return false;
    }

  }

  async confirm() {
    this.loading = true;

    // Conversão dos arquivos para base64.
    const bases64 = await Promise.all(
      this.files.map(file => this.fileToBase64(file))
    );

    // Faz a junção dos nomes dos arquivos com seus respectivos base64 em um objeto.
    for (let index: number = 0; index < bases64.length; index++) {
      const newInvoiceB64: NotaFiscalBase64 = <NotaFiscalBase64>{};
      newInvoiceB64.nome = this.files[index].name;
      newInvoiceB64.xmlBase64 = bases64[index];
      this.invoicesBase64.push(newInvoiceB64)
    }

    this.numInvoices = [];
    this.xmlInvalid = [];
    this.invoiceService.uploadInvoiceXML(this.companyId, this.invoicesBase64).subscribe({
      next: (response) => {
        const invoicesCreated: any[] = response.dados.notasFiscais.novos;
        const invoicesExist: any[] = response.dados.notasFiscais.existentes;
        const allInvoices: any[] = invoicesExist.concat(invoicesCreated);
        this.xmlInvalid = response.dados.xmlInvalidos;

        allInvoices.forEach(invoice => {
          this.numInvoices.push(invoice.nf ? invoice.nf : invoice.noChaveAcessoNFe);
        });

        this.loading = false;

        // Retorna as chaves para busca das NFs criadas a partir do XML
        // e também o nome dos arquivos XML inválidos para mostrar ao usuário.
        const result = {
          status: 'success',
          numInvoices: this.numInvoices,
          xmlInvalid: this.xmlInvalid
        }
        this.modal.close(result)
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.snackbar.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    });
  }

  // Converte o arquivo em base64.
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split('base64,')[1]);
      };

      reader.readAsDataURL(file);
    });
  }
}