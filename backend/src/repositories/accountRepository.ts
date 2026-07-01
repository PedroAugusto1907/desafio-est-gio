import { randomUUID } from 'crypto';
import { Account } from '../types/account';

const SEED_ACCOUNTS: Account[] = [
  { id: '1', type: 'CORRENTE', balance: 1000, owner: 'João' },
  { id: '2', type: 'POUPANCA', balance: 500, owner: 'Maria' },
];

let accounts: Account[] = SEED_ACCOUNTS.map((acc) => ({ ...acc }));

export const accountRepository = {
  findById(id: string): Account | undefined {
    return accounts.find((acc) => acc.id === id);
  },

  findAll(): Account[] {
    return [...accounts];
  },

  create(data: Omit<Account, 'id'>): Account {
    const account: Account = { id: randomUUID(), ...data };
    accounts.push(account);
    return account;
  },

  updateBalance(id: string, newBalance: number): Account | undefined {
    const account = this.findById(id);
    if (account) account.balance = newBalance;
    return account;
  },

  // Usado apenas em testes, para garantir estado limpo entre casos de teste.
  resetForTests(): void {
    accounts = SEED_ACCOUNTS.map((acc) => ({ ...acc }));
  },
};
