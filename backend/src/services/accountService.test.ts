import { beforeEach, describe, expect, it } from 'vitest';
import { accountService } from './accountService';
import { accountRepository } from '../repositories/accountRepository';
import { AccountNotFoundError } from '../errors/AccountNotFoundError';
import { InsufficientBalanceError } from '../errors/InsufficientBalanceError';
import { InvalidValueError } from '../errors/InvalidValueError';

beforeEach(() => {
  accountRepository.resetForTests();
});

describe('accountService.saque', () => {
  describe('conta corrente (R1: tarifa de R$1 + limite de cheque especial de R$500)', () => {
    it('cobra tarifa de R$1 além do valor sacado', () => {
      const conta = accountService.saque('1', 100);
      expect(conta.balance).toBe(1000 - 100 - 1);
    });

    it('permite saldo ficar negativo até exatamente -R$500 (limite do cheque especial)', () => {
      const conta = accountService.saque('1', 1499);
      expect(conta.balance).toBe(-500);
    });

    it('rejeita saque que ultrapasse o limite de cheque especial em 1 centavo', () => {
      expect(() => accountService.saque('1', 1499.01)).toThrow(InsufficientBalanceError);
    });
  });

  describe('conta poupança (R2: isenta de tarifa, sem saldo negativo)', () => {
    it('não cobra tarifa', () => {
      const conta = accountService.saque('2', 100);
      expect(conta.balance).toBe(500 - 100);
    });

    it('permite saque que zere o saldo exatamente', () => {
      const conta = accountService.saque('2', 500);
      expect(conta.balance).toBe(0);
    });

    it('rejeita saque que deixaria o saldo negativo', () => {
      expect(() => accountService.saque('2', 500.01)).toThrow(InsufficientBalanceError);
    });
  });

  describe('validações gerais', () => {
    it('rejeita valor zero ou negativo', () => {
      expect(() => accountService.saque('1', 0)).toThrow(InvalidValueError);
      expect(() => accountService.saque('1', -10)).toThrow(InvalidValueError);
    });

    it('rejeita valor não numérico (NaN)', () => {
      expect(() => accountService.saque('1', Number('abc'))).toThrow(InvalidValueError);
    });

    it('lança AccountNotFoundError para conta inexistente', () => {
      expect(() => accountService.saque('999', 100)).toThrow(AccountNotFoundError);
    });
  });
});

describe('accountService.transferencia', () => {
  it('cobra tarifa apenas da conta de origem quando origem é corrente', () => {
    const { origem, destino } = accountService.transferencia('1', '2', 100);
    expect(origem.balance).toBe(1000 - 100 - 1);
    expect(destino.balance).toBe(500 + 100);
  });

  it('não cobra tarifa quando origem é poupança', () => {
    const { origem, destino } = accountService.transferencia('2', '1', 100);
    expect(origem.balance).toBe(500 - 100);
    expect(destino.balance).toBe(1000 + 100);
  });

  it('aplica o limite de cheque especial da origem corrente na transferência', () => {
    const { origem } = accountService.transferencia('1', '2', 1499);
    expect(origem.balance).toBe(-500);
  });

  it('rejeita transferência de poupança que deixaria saldo negativo', () => {
    expect(() => accountService.transferencia('2', '1', 500.01)).toThrow(InsufficientBalanceError);
  });

  it('rejeita transferência para a mesma conta', () => {
    expect(() => accountService.transferencia('1', '1', 100)).toThrow(InvalidValueError);
  });

  it('rejeita valor zero ou negativo', () => {
    expect(() => accountService.transferencia('1', '2', 0)).toThrow(InvalidValueError);
    expect(() => accountService.transferencia('1', '2', -10)).toThrow(InvalidValueError);
  });

  it('lança AccountNotFoundError quando origem não existe', () => {
    expect(() => accountService.transferencia('999', '1', 100)).toThrow(AccountNotFoundError);
  });

  it('lança AccountNotFoundError quando destino não existe', () => {
    expect(() => accountService.transferencia('1', '999', 100)).toThrow(AccountNotFoundError);
  });
});
