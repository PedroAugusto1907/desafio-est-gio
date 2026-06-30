export class InsufficientBalanceError extends Error {
  constructor(message = 'Saldo insuficiente para esta operação') {
    super(message);
    this.name = 'InsufficientBalanceError';
  }
}
