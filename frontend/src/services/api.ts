import type { Account } from "../types/account";

const BASE_URL = "http://localhost:3000/api";

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Erro desconhecido");
  }
  return data as T;
}

export const api = {
  async listarContas(): Promise<Account[]> {
    const res = await fetch(`${BASE_URL}/accounts`);
    return handleResponse<Account[]>(res);
  },

  async saque(id: string, valor: number): Promise<Account> {
    const res = await fetch(`${BASE_URL}/accounts/${id}/saque`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valor }),
    });
    return handleResponse<Account>(res);
  },

  async transferencia(
    origemId: string,
    destinoId: string,
    valor: number,
  ): Promise<{ origem: Account; destino: Account }> {
    const res = await fetch(`${BASE_URL}/accounts/${origemId}/transferencia`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destinoId, valor }),
    });
    return handleResponse<{ origem: Account; destino: Account }>(res);
  },
};
