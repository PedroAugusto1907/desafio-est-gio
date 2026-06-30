export class AccountNotFoundError extends Error {
  constructor(message = 'Conta não encontrada') {
    super(message);
    this.name = 'AccountNotFoundError';
  }
}
