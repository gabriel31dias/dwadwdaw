import { NotaFiscal, NotaFiscalGrid } from "../models/nota-fiscal.model";
import { removeCurrencyMask, setCurrencyMask } from "./currency-mask";

/** Formata o Objeto do tipo `NotaFiscal` para o Objeto do tipo `NotaFiscalGrid`.
 * @param NF Objeto de nota fiscal do tipo `NotaFiscal`.
 * @returns Retorna um Objeto do tipo `NotaFiscalGrid`.
*/
export function formatterNFToGridObject(NF: NotaFiscal): NotaFiscalGrid {
  const nfFormatted: NotaFiscalGrid = {
    // ID para identificação do SlickGrid.
    id: 0,
    // Dados da Nota Fiscal.
    codigo: NF.nota.codigo,
    tipo_documento: NF.nota.tipo_documento,
    numero: NF.nota.numero,
    serie: NF.nota.serie,
    data_emissao: NF.nota.data_emissao,
    chave_acesso: NF.nota.chave_acesso,
    // Dados da carga.
    valor_mercadoria: NF.nota.carga && NF.nota.carga.valor_mercadoria ? setCurrencyMask(NF.nota.carga.valor_mercadoria) : 'R$ 0,00',
    metragem_cubica: NF.nota.carga && NF.nota.carga.metragem_cubica ? NF.nota.carga.metragem_cubica!.toLocaleString('pt-br') : '0',
    peso_bruto: NF.nota.carga && NF.nota.carga.peso_bruto ? NF.nota.carga.peso_bruto!.toLocaleString('pt-br')  : '0',
    peso_liquido: NF.nota.carga && NF.nota.carga.peso_liquido ? NF.nota.carga.peso_liquido!.toLocaleString('pt-br')  : '0',
    quantidade_volumes: NF.nota.carga ? NF.nota.carga.quantidade_volumes : 0,
    // Dados adicionais da carga.
    pedido: NF.nota.carga.dados_adicionais.pedido,
    romaneio: NF.nota.carga.dados_adicionais.romaneio,
    // Dados da empresa.
    codigo_empresa: NF.empresa && NF.empresa.codigo ? NF.empresa.codigo : null,
    // Dados da filial.
    codigo_filial: NF.filial && NF.filial.codigo ? NF.filial.codigo : null,
    // Remetente.
    cpf_cnpj_remetente: NF.remetente.cpf_cnpj,
    nome_fantasia_remetente: NF.remetente.nome_fantasia,
    // Destinatário.
    cpf_cnpj_destinatario: NF.destinatario.cpf_cnpj,
    nome_fantasia_destinatario: NF.destinatario.nome_fantasia,
    // Pagador.
    cpf_cnpj_pagador: NF.pagador.cpf_cnpj,
    nome_fantasia_pagador: NF.pagador.nome_fantasia,
    // Transportador.
    cpf_cnpj_transportador: NF.transportador ? NF.transportador.cpf_cnpj : null,
    nome_fantasia_transportador: NF.transportador ? NF.transportador.nome_fantasia : null,
    // Expedidor.
    cpf_cnpj_expedidor: NF.expedidor ? NF.expedidor.cpf_cnpj : null,
    nome_fantasia_expedidor: NF.expedidor ? NF.expedidor.nome_fantasia : null,
    // Recebedor.
    cpf_cnpj_recebedor: NF.recebedor ? NF.recebedor.cpf_cnpj : null,
    nome_fantasia_recebedor: NF.recebedor ? NF.recebedor.nome_fantasia : null,
    // Outros dados.
    data_inclusao: NF.outros_dados ? NF.outros_dados?.data_inclusao : null
  }

  return nfFormatted;
}

/** Formata o array do tipo `NotaFiscal` para o array do tipo `NotaFiscalGrid`.
 * @param NFs Array de notas fiscais do tipo `NotaFiscal`.
 * @returns Retorna um array do tipo `NotaFiscalGrid`.
*/
export function formatterNFToGridArray(NFs: NotaFiscal[]): NotaFiscalGrid[] {
  const nfsFormatted: NotaFiscalGrid[] = [];

  for (const NF of NFs) {
    const newNF: NotaFiscalGrid = {
      // ID para identificação do SlickGrid.
      id: nfsFormatted.length,
      // Dados da Nota Fiscal.
      codigo: NF.nota.codigo,
      tipo_documento: NF.nota.tipo_documento,
      numero: NF.nota.numero,
      serie: NF.nota.serie,
      data_emissao: NF.nota.data_emissao,
      chave_acesso: NF.nota.chave_acesso,
      // Dados da carga.
      valor_mercadoria: NF.nota.carga && NF.nota.carga.valor_mercadoria ? setCurrencyMask(NF.nota.carga.valor_mercadoria) : 'R$ 0,00',
      metragem_cubica: NF.nota.carga && NF.nota.carga.metragem_cubica ? NF.nota.carga.metragem_cubica!.toLocaleString('pt-br') : '0',
      peso_bruto: NF.nota.carga && NF.nota.carga.peso_bruto ? NF.nota.carga.peso_bruto!.toLocaleString('pt-br')  : '0',
      peso_liquido: NF.nota.carga && NF.nota.carga.peso_liquido ? NF.nota.carga.peso_liquido!.toLocaleString('pt-br')  : '0',
      quantidade_volumes: NF.nota.carga ? NF.nota.carga.quantidade_volumes : 0,
      // Dados adicionais da carga.
      pedido: NF.nota.carga.dados_adicionais.pedido,
      romaneio: NF.nota.carga.dados_adicionais.romaneio,
      // Dados da empresa.
      codigo_empresa: NF.empresa && NF.empresa.codigo ? NF.empresa.codigo : null,
      // Dados da filial.
      codigo_filial: NF.filial && NF.filial.codigo ? NF.filial.codigo : null,
      // Remetente.
      cpf_cnpj_remetente: NF.remetente.cpf_cnpj,
      nome_fantasia_remetente: NF.remetente.nome_fantasia,
      // Destinatário.
      cpf_cnpj_destinatario: NF.destinatario.cpf_cnpj,
      nome_fantasia_destinatario: NF.destinatario.nome_fantasia,
      // Pagador.
      cpf_cnpj_pagador: NF.pagador.cpf_cnpj,
      nome_fantasia_pagador: NF.pagador.nome_fantasia,
      // Transportador.
      cpf_cnpj_transportador: NF.transportador ? NF.transportador.cpf_cnpj : null,
      nome_fantasia_transportador: NF.transportador ? NF.transportador.nome_fantasia : null,
      // Expedidor.
      cpf_cnpj_expedidor: NF.expedidor ? NF.expedidor.cpf_cnpj : null,
      nome_fantasia_expedidor: NF.expedidor ? NF.expedidor.nome_fantasia : null,
      // Recebedor.
      cpf_cnpj_recebedor: NF.recebedor ? NF.recebedor.cpf_cnpj : null,
      nome_fantasia_recebedor: NF.recebedor ? NF.recebedor.nome_fantasia : null,
      // Outros dados.
      data_inclusao: NF.outros_dados ? NF.outros_dados?.data_inclusao : null
    }

    nfsFormatted.push(newNF);
  }

  return nfsFormatted;
}

/** Formata o array utilizado no GRID para um array do tipo `NotaFiscal`.
 * @param NFs Array de notas fiscais do tipo `NotaFiscalGrid`.
 * @returns Retorna um array do tipo `NotaFiscal`.
*/
export function formatterGridToNFArray(NFs: NotaFiscalGrid[]): NotaFiscal[] {
  const nfsFormatted: NotaFiscal[] = [];

  for (const NF of NFs) {
    const newNF: NotaFiscal = {
      empresa: {
        codigo: NF.codigo_empresa,
        cpf_cnpj: null,
        nome_fantasia: null,
      },
      filial: {
        codigo: NF.codigo_filial,
        cpf_cnpj: null,
        nome_fantasia: null,
      },
      nota: {
        codigo: NF.codigo,
        tipo_documento: NF.tipo_documento,
        numero: NF.numero,
        serie: NF.serie,
        data_emissao: NF.data_emissao,
        chave_acesso: NF.chave_acesso,
        carga: {
          valor_mercadoria: NF.valor_mercadoria ? removeCurrencyMask(NF.valor_mercadoria) : null,
          metragem_cubica: NF.metragem_cubica ? removeCurrencyMask(NF.metragem_cubica) : null,
          peso_bruto: NF.peso_bruto ? removeCurrencyMask(NF.peso_bruto) : null,
          peso_liquido: NF.peso_liquido ? removeCurrencyMask(NF.peso_liquido) : null,
          quantidade_volumes: NF.quantidade_volumes,
          dados_adicionais: {
            pedido: NF.pedido,
            romaneio: NF.romaneio,
          }
        }
      },
      remetente: {
        cpf_cnpj: NF.cpf_cnpj_remetente,
        nome_fantasia: NF.nome_fantasia_remetente,
      },
      destinatario: {
        cpf_cnpj: NF.cpf_cnpj_destinatario,
        nome_fantasia: NF.nome_fantasia_destinatario,
      },
      pagador: {
        cpf_cnpj: NF.cpf_cnpj_pagador,
        nome_fantasia: NF.nome_fantasia_pagador,
      },
      expedidor: {
        cpf_cnpj: NF.cpf_cnpj_expedidor,
        nome_fantasia: NF.nome_fantasia_expedidor,
      },
      recebedor: {
        cpf_cnpj: NF.cpf_cnpj_recebedor,
        nome_fantasia: NF.nome_fantasia_recebedor,
      },
      transportador: {
        cpf_cnpj: NF.cpf_cnpj_remetente,
        nome_fantasia: NF.nome_fantasia_recebedor,
      },
      outros_dados: {
        data_inclusao: NF.data_inclusao
      }
    }

    nfsFormatted.push(newNF);
  }

  return nfsFormatted;
}

/** Formata o array do tipo `NotaFiscalModel (Backend)` para o array do tipo `NotaFiscalGrid`.
 * @param NFs Array de notas fiscais do tipo `any (Frontend)`  - `NotaFiscalModel (Backend)`.
 * @returns Retorna um array do tipo `NotaFiscalGrid`.
*/
export function formatterNFModelToGridArray(NFs: any[]): NotaFiscalGrid[] {
  const nfsFormatted: NotaFiscalGrid[] = [];

  for (const NF of NFs) {
    const newNF: NotaFiscalGrid = {
      // ID para identificação do SlickGrid.
      id: nfsFormatted.length,
      // Dados da Nota Fiscal.
      codigo: NF.nota_fiscal.codigo,
      tipo_documento: NF.nota_fiscal.tipo_documento,
      numero: NF.nota_fiscal.numero,
      serie: NF.nota_fiscal.serie,
      data_emissao: NF.nota_fiscal.data_emissao,
      chave_acesso: NF.nota_fiscal.chave_acesso,
      // Dados da carga.
      valor_mercadoria: NF.nota_fiscal.carga && NF.nota_fiscal.carga.valor_mercadoria ? setCurrencyMask(NF.nota_fiscal.carga.valor_mercadoria) : 'R$ 0,00',
      metragem_cubica: NF.nota_fiscal.carga && NF.nota_fiscal.carga.metragem_cubica ? NF.nota_fiscal.carga.metragem_cubica!.toLocaleString('pt-br') : '0',
      peso_bruto: NF.nota_fiscal.carga && NF.nota_fiscal.carga.peso_bruto ? NF.nota_fiscal.carga.peso_bruto!.toLocaleString('pt-br')  : '0',
      peso_liquido: NF.nota_fiscal.carga && NF.nota_fiscal.carga.peso_liquido ? NF.nota_fiscal.carga.peso_liquido!.toLocaleString('pt-br')  : '0',
      quantidade_volumes: NF.nota_fiscal.carga ? NF.nota_fiscal.carga.quantidade_volumes : 0,
      // Dados adicionais.
      pedido: NF.nota_fiscal.dados_adicionais.pedido,
      romaneio: NF.nota_fiscal.dados_adicionais.romaneio,
      // Dados da empresa.
      codigo_empresa: NF.dados_empresa && NF.dados_empresa.empresa && NF.dados_empresa.empresa.codigo ? NF.dados_empresa.empresa.codigo : null,
      // Dados da filial.
      codigo_filial: NF.dados_empresa && NF.dados_empresa.filial && NF.dados_empresa.filial.codigo ? NF.dados_empresa.filial.codigo : null,
      // Remetente.
      cpf_cnpj_remetente: NF.remetente.cnpj_cpf,
      nome_fantasia_remetente: NF.remetente.nome_fantasia,
      // Destinatário.
      cpf_cnpj_destinatario: NF.destinatario.cnpj_cpf,
      nome_fantasia_destinatario: NF.destinatario.nome_fantasia,
      // Pagador.
      cpf_cnpj_pagador: NF.pagador.cnpj_cpf,
      nome_fantasia_pagador: NF.pagador.nome_fantasia,
      // Transportador.
      cpf_cnpj_transportador: NF.transportador ? NF.transportador.cnpj_cpf : null,
      nome_fantasia_transportador: NF.transportador ? NF.transportador.nome_fantasia : null,
      // Expedidor.
      cpf_cnpj_expedidor: NF.expedidor ? NF.expedidor.cnpj_cpf : null,
      nome_fantasia_expedidor: NF.expedidor ? NF.expedidor.nome_fantasia : null,
      // Recebedor.
      cpf_cnpj_recebedor: NF.recebedor ? NF.recebedor.cnpj_cpf : null,
      nome_fantasia_recebedor: NF.recebedor ? NF.recebedor.nome_fantasia : null,
      // Outros dados.
      data_inclusao: NF.outros_dados ? NF.outros_dados?.data_inclusao : null
    }

    nfsFormatted.push(newNF);
  }

  return nfsFormatted;
}
