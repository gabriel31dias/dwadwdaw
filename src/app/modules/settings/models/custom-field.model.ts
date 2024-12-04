import { TypeCustomField } from "./type-custom-field";

export interface CustomField {
  codigo?: number;
  nome: string;
  textoAjuda: string;
  habilitado: boolean;
  tipo: TypeCustomField;
  itens: string[];
  permiteExclusao?: boolean;
}
