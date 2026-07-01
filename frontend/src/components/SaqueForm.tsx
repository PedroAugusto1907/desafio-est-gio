import { useState, FormEvent } from "react";
import { api } from "../services/api";
import { Account } from "../types/account";

interface Props {
  contaId: string | null;
  onSucesso: (conta: Account) => void;
}

export function SaqueForm({ contaId, onSucesso }: Props) {
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!contaId) {
      setErro("Selecione uma conta primeiro");
      return;
    }

    setCarregando(true);
    try {
      const contaAtualizada = await api.saque(contaId, Number(valor));
      onSucesso(contaAtualizada);
      setValor("");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao realizar saque");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Saque</h2>
      <p>Conta selecionada: {contaId ?? "nenhuma"}</p>
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
        {carregando ? "Processando..." : "Sacar"}
      </button>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </form>
  );
}
