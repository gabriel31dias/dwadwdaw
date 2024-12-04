// Implementa a máscara de moeda BR (Ex.: 10.99 -> R$ 10,99)
export function setCurrencyMask(value: number | null): string {
  if (value || value === 0) {
    return value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
  } else {
    return '';
  }
}

export function removeCurrencyMask(value: string | null): number {
  if (value === null) return 0;
  if (value === '') return 0;

  const numericString = value.replace(/[^\d,]/g, '');
  const validNumericString = numericString.replace(',', '.');
  const numericValue = parseFloat(validNumericString);

  return numericValue;
}

export function isNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value)
}
