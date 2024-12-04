import { Measure } from "../../shared/models/measure.model";
import { NotaFiscal } from "../../shared/models/nota-fiscal.model";

export interface TotaisDaCarga {
  qtdNotas: number;
  qtdVolumes: number,
  pesoLiquido: string;
  pesoBruto: number;
  metragemCubica: number;
  valorMercadoria: number;

  nfs: NotaFiscal[];
  medidas: Measure[];
}
