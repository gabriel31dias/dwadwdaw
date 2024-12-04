import { SizeCustomField } from "../../settings/models/size-custom-field";
import { TypeCustomField } from "../../settings/models/type-custom-field";

export interface ExhibitionCustomField {
  id?: number;
  idExibicao: number;
  codigo: number;
  label: string;
  tipo: TypeCustomField;
  itens: string[];
  tamanho: SizeCustomField;
  valor: string | string[];
}

export interface RegisterCustomField {
  id?: number;
  idCampoPersonalizado: number;
  idExibicao: number;
  idRegistro?: string;
  valor: string;
}

