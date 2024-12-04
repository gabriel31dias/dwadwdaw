import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Historico } from "../models/historic-change.model";
import { formatUTCToLocal } from "./date-utils";
import { ModalDetailsChangeComponent } from "../components/modais/modal-details-change/modal-details-change.component";

export function formatHistoric(historics: any[]): Historico[] {
  const historicsFormatted: Historico[] = [];
  for (const historic of historics) {
    // Formatação do histórico.
    const newHistoric: Historico = <Historico>{};
    const dateTime = formatUTCToLocal(historic.historico.dataHora);
    [ newHistoric.data, newHistoric.hora ] = dateTime.split(' - ');
    newHistoric.usuario = historic.historico.login;
    newHistoric.acao = historic.historico.acao;
    newHistoric.quantidadeDeAlteracoes = historic.historico.quantidadeDeAlteracoes;
    newHistoric.detalhes = historic.detalhes;
    historicsFormatted.push(newHistoric);
  }
  return historicsFormatted;
}

// Abre o modal de detalhes da alteração.
export function openModalDetailsHistoric(modalService: NgbModal, historic: Historico) {
  const modalOptions: NgbModalOptions = {
    centered: true,
    modalDialogClass: 'modal-historic-changes',
  };
  const modalRef = modalService.open(ModalDetailsChangeComponent, modalOptions);
  modalRef.componentInstance.historic = historic;


  modalRef.result
    .then((res: boolean) => {
    })
    .catch((res) => {
    })
}


