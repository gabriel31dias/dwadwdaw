import { RegisterCustomField } from "../../shared/models/exhibition-custom-field.model";
import { LocalDeEntrega } from "./delivery-place.model";
import { Motorista } from "./driver-collection.model";
import { DadosColeta } from "./info-collection.model";
import { TotaisDaCarga } from "./load-totals.model";

export interface Coleta {
  dadosColeta: DadosColeta;
  localDeEntrega?: LocalDeEntrega;
  totaisDaCarga: TotaisDaCarga;
  motorista: Motorista;
  camposPersonalizados?: RegisterCustomField[] | null;
  coletadoEm: string | null;
  noCotacao: string | null;
  noCotacaoTratado: string | null;
  viagem: string | null;
  viagemTratado: string | null;
  cte: string | null;
}
