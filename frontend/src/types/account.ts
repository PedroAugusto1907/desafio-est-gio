export type AccountType = "CORRENTE" | "POUPANCA";

export interface Account {
  id: string;
  type: AccountType;
  balance: number;
  owner: string;
}
