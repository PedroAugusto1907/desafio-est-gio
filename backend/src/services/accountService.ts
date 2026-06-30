import { AccountNotFoundError } from '../errors/AccountNotFoundError';
import { InsufficientBalanceError } from '../errors/InsufficientBalanceError';
import { accountRepository } from '../repositories/accountRepository ';
import { Account } from '../types/account';

const TARIFA_CORRENTE = 1.0;
const LIMITE_CHEQUE_ESPECIAL = 500.0;

function getAccount(id: string): Account {
  const account = accountRepository.findById(id);
  if (!account) throw new AccountNotFoundError();
  return account;
}

function calcularValorTotal(account: Account, valor: number): number {
  // R1: Conta Corrente cobra tarifa de R$1 por operação
  // R2: Conta Poupança é isenta
  const tarifa = account.type === 'CORRENTE' ? TARIFA_CORRENTE : 0;
  return valor + tarifa;
}

function validarSaldoSuficiente(account: Account, valorTotal: number): void {
  const saldoFinal = account.balance - valorTotal;

  if (account.type === 'CORRENTE') {
    // R1: pode ficar negativo até -500 (valor + tarifa não pode ultrapassar o limite)
    if (saldoFinal < -LIMITE_CHEQUE_ESPECIAL) {
      throw new InsufficientBalanceError(
        `Saldo insuficiente: limite de cheque especial (R$ ${LIMITE_CHEQUE_ESPECIAL.toFixed(2)}) seria ultrapassado`,
      );
    }
  } else {
    // R2: Conta Poupança não pode ficar negativa
    if (saldoFinal < 0) {
      throw new InsufficientBalanceError('Conta Poupança não permite saldo negativo');
    }
  }
}

export const accountService = {
  saque(accountId: string, valor: number): Account {
    if (valor <= 0) throw new Error('Valor de saque deve ser maior que zero');

    const account = getAccount(accountId);
    const valorTotal = calcularValorTotal(account, valor);

    validarSaldoSuficiente(account, valorTotal);

    const novoSaldo = account.balance - valorTotal;
    return accountRepository.updateBalance(accountId, novoSaldo)!;
  },

  transferencia(
    origemId: string,
    destinoId: string,
    valor: number,
  ): { origem: Account; destino: Account } {
    if (valor <= 0) throw new Error('Valor de transferência deve ser maior que zero');
    if (origemId === destinoId) throw new Error('Conta de origem e destino não podem ser iguais');

    const origem = getAccount(origemId);
    const destino = getAccount(destinoId);

    const valorTotal = calcularValorTotal(origem, valor);
    validarSaldoSuficiente(origem, valorTotal);

    const novoSaldoOrigem = origem.balance - valorTotal;
    const novoSaldoDestino = destino.balance + valor;

    accountRepository.updateBalance(origemId, novoSaldoOrigem);
    accountRepository.updateBalance(destinoId, novoSaldoDestino);

    return {
      origem: accountRepository.findById(origemId)!,
      destino: accountRepository.findById(destinoId)!,
    };
  },

  buscarTodas(): Account[] {
    return accountRepository.findAll();
  },

  buscarPorId(id: string): Account {
    return getAccount(id);
  },
};
