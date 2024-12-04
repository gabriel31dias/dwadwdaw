/** Regex para verificação de e-mail válido. */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/** Recebe uma string de e-mails separados por ";" e retorna esses e-mails dentro de um array. */
export function formatEmailsField(emailFied: string): string[] {
  if (emailFied.includes(';')) {
    return emailFied
      .split(';')
      .map(email => email.trim())
      .filter(value => !!value);
  } else {
    return emailFied ? [emailFied.trim()] : [];
  }
}

