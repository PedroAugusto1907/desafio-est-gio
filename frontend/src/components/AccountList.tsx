import { Account } from "../types/account";

interface Props {
  accounts: Account[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function AccountList({ accounts, selectedId, onSelect }: Props) {
  return (
    <div>
      <h2>Contas</h2>
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>
            <button
              type="button"
              onClick={() => onSelect(account.id)}
              style={{
                fontWeight: account.id === selectedId ? "bold" : "normal",
              }}
            >
              #{account.id} — {account.owner} ({account.type}) — Saldo: R${" "}
              {account.balance.toFixed(2)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
