/** Insere a máscara de CNPJ.
 *
 * (Ex.: 63915985000103 -> 63.915.985/0001-03)
*/
export function setMaskCnpj(cnpj: string): string {
  if (cnpj) {
    const cleanedCNPJ = cnpj.replace(/[^\d]/g, '');

    const part1 = cleanedCNPJ.substr(0, 2);
    const part2 = cleanedCNPJ.substr(2, 3);
    const part3 = cleanedCNPJ.substr(5, 3);
    const part4 = cleanedCNPJ.substr(8, 4);
    const part5 = cleanedCNPJ.substr(12, 2);

    return `${part1}.${part2}.${part3}/${part4}-${part5}`;
  } else {
    return cnpj;
  }
}

/** Insere a máscara de CPF.
 *
 * (Ex.: 1234567890 -> 123.456.789-0)
*/
export function setMaskCpf(cpf: string): string {
  if (cpf) {
    cpf = cpf.replace(/\D/g,"");
    cpf = cpf.replace(/(\d{3})(\d)/,"$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/,"$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/,"$1-$2");

    return cpf
  } else {
    return ''
  }
}

/**
 * Insere a máscara de CPF/CNPJ.
 *
 * (Ex. CPF: 1234567890 -> 123.456.789-0)
 *
 * (Ex. CNPJ: 63915985000103 -> 63.915.985/0001-03)
*/
export function setMaskCpfCnpj(value: string | null): string | null {
  value = removeMaskCpfCnpj(value ? value : '')
  if (value?.length === 11) {
    value = value.replace(/\D/g,"");
    value = value.replace(/(\d{3})(\d)/,"$1.$2");
    value = value.replace(/(\d{3})(\d)/,"$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/,"$1-$2");

    return value;
  } else if (value?.length === 14) {
    const cleanedCNPJ = value.replace(/[^\d]/g, '');

    const part1 = cleanedCNPJ.substr(0, 2);
    const part2 = cleanedCNPJ.substr(2, 3);
    const part3 = cleanedCNPJ.substr(5, 3);
    const part4 = cleanedCNPJ.substr(8, 4);
    const part5 = cleanedCNPJ.substr(12, 2);

    return `${part1}.${part2}.${part3}/${part4}-${part5}`;
  } else {
    return value;
  }
}

/**
 * Remove a máscara de CPF/CNPJ.
 *
 * (Ex. CPF: 123.456.789-0 -> 1234567890)
 *
 * (Ex. CNPJ: 63.915.985/0001-03 -> 63915985000103)
*/
export function removeMaskCpfCnpj(cnpj: string): string {
  if (cnpj) {
    return cnpj.replace(/[^\d]/g, '');
  } else {
    return '';
  }
}

/** Verifica se o CPF informado é um CPF válido.
 * @param cpf CPF a ser validado.
 * @returns Retorna um `boolean` que indica de o CPF é válido ou não (`true` - CPF válido / `false` - CPF inválido).
*/
export function isValidCPF(cpf: string | null): boolean {
  if (cpf === null || cpf === '') return false;
  cpf = removeMaskCpfCnpj(cpf);
  if (cpf.length < 11) return false;
  if (cpf == '00000000000') return false;

  let sum: number;
  var rest: number;
  sum = 0;

  for (let i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  rest = (sum * 10) % 11;

  if ((rest == 10) || (rest == 11))  rest = 0;
  if (rest != parseInt(cpf.substring(9, 10)) ) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;

  if ((rest == 10) || (rest == 11))  rest = 0;
  if (rest != parseInt(cpf.substring(10, 11))) return false;
  return true;
}
