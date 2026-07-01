export class InvalidValueError extends Error {
  constructor(message = 'Valor inválido para esta operação') {
    super(message);
    this.name = 'InvalidValueError';
  }
}
