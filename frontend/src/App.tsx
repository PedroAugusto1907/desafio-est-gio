import { useEffect, useState } from "react";
import { api } from "./services/api";
import { Account } from "./types/account";
import { AccountList } from "./components/AccountList";
import { SaqueForm } from "./components/SaqueForm";
import { TransferenciaForm } from "./components/TransferenciaForm";

function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);

  function atualizarConta(conta: Account) {
    setAccounts((prev) => prev.map((a) => (a.id === conta.id ? conta : a)));
  }

  function atualizarDuasContas(origem: Account, destino: Account) {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === origem.id) return origem;
        if (a.id === destino.id) return destino;
        return a;
      }),
    );
  }

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const dados = await api.listarContas();
        setAccounts(dados);
      } catch (err) {
        setErroCarregamento(
          err instanceof Error ? err.message : "Erro ao carregar contas",
        );
      }
    };

    buscarDados();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}>
      <h1>Banco</h1>
      {erroCarregamento && <p style={{ color: "red" }}>{erroCarregamento}</p>}
      <AccountList
        accounts={accounts}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <hr />
      <SaqueForm contaId={selectedId} onSucesso={atualizarConta} />
      <hr />
      <TransferenciaForm contaId={selectedId} onSucesso={atualizarDuasContas} />
    </div>
  );
}

export default App;
