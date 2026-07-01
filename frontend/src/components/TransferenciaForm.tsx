import { useState, FormEvent } from "react";
import { api } from "../services/api";
import { Account } from "../types/account";

interface Props {
  contaId: string | null;
  onSucesso: (origem: Account, destino: Account) => void;
}

export function TransferenciaForm({ contaId, onSucesso }: Props) {
  const [destinoId, setDestinoId] = useState("");
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!contaId) {
      setErro("Selecione uma conta de origem primeiro");
      return;
    }

    setCarregando(true);
    try {
      const resultado = await api.transferencia(
        contaId,
        destinoId,
        Number(valor),
      );
      onSucesso(resultado.origem, resultado.destino);
      setValor("");
      setDestinoId("");
    } catch (err) {
      setErro(
        err instanceof Error ? err.message : "Erro ao realizar transferência",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Transferência</h2>
      <p>Conta de origem: {contaId ?? "nenhuma"}</p>
      <input
        type="text"
        placeholder="ID da conta destino"
        value={destinoId}
        onChange={(e) => setDestinoId(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        min="0"
        step="0.01"
        required
      />
      <button type="submit" disabled={carregando}>
        {carregando ? "Processando..." : "Transferir"}
      </button>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </form>
  );
}
