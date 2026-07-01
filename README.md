# Banco — Desafio Técnico Agilize

Aplicação de banco com backend em API REST (Node.js + TypeScript + Express). Implementa as
operações de **saque** (obrigatória) e **transferência** (diferencial), respeitando as regras de
tarifa e limite de cheque especial por tipo de conta (Corrente e Poupança).

## Stack

- **Backend:** Node.js 20+ / TypeScript 6+, Express 5, Vitest (testes)
- **Frontend:** React + TypeScript, Vite

## Pré-requisitos

- [Node.js](https://nodejs.org/) versão 20 ou superior
- npm (já incluso na instalação do Node)

## Como executar

O projeto tem duas partes que rodam **simultaneamente**, em terminais separados: o backend
(API) e o frontend (interface web). O frontend depende do backend estar no ar para funcionar.

### 1. Backend (API)

```bash
cd backend
npm install
npm run dev
```

O servidor sobe em `http://localhost:3000`.

Outros scripts disponíveis:

```bash
npm run build      # compila TypeScript para JavaScript (saída em dist/)
npm run start       # roda a versão compilada (requer build antes)
npm run lint        # checa o código com ESLint
npm run format      # formata o código com Prettier
npm run test        # roda a suíte de testes uma vez (Vitest)
npm run test:watch  # roda os testes em modo watch, reexecutando a cada mudança
```

### 2. Frontend

Em **outro terminal**, na raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

A interface sobe em `http://localhost:5173`. Abra esse endereço no navegador.

Outros scripts disponíveis:

```bash
npm run build   # gera a versão de produção (saída em dist/)
npm run lint    # checa o código com ESLint
```

> ⚠️ O frontend está configurado para chamar a API em `http://localhost:3000`. Se o backend
> estiver rodando em outra porta, ajuste a constante `BASE_URL` em
> `frontend/src/services/api.ts`.

## Como usar

1. Com backend e frontend rodando, abra `http://localhost:5173` no navegador.
2. A lista de contas é carregada automaticamente ao abrir a página.
3. Clique em uma conta para selecioná-la (ela fica em destaque).
4. Preencha o formulário de **Saque** com um valor e confirme — o saldo da conta selecionada é
   atualizado na tela.
5. Preencha o formulário de **Transferência** com o ID da conta de destino e um valor — os
   saldos de origem e destino são atualizados na tela.
6. Erros de regra de negócio (saldo insuficiente, conta inexistente) aparecem em vermelho
   abaixo do formulário correspondente.

## Contas de exemplo (dados pré-carregados em memória)

| id  | tipo     | saldo inicial | dono  |
| --- | -------- | ------------- | ----- |
| 1   | CORRENTE | R$ 1000,00    | João  |
| 2   | POUPANCA | R$ 500,00     | Maria |

> Os dados não persistem: a cada reinício do servidor, o estado volta ao inicial acima.

## Endpoints da API

Base URL: `http://localhost:3000/api`

### Listar todas as contas

```
GET /accounts
```

### Buscar conta por id

```
GET /accounts/:id
```

### Realizar saque

```
POST /accounts/:id/saque
Content-Type: application/json

{ "valor": 100 }
```

### Realizar transferência

```
POST /accounts/:id/transferencia
Content-Type: application/json

{ "destinoId": "2", "valor": 100 }
```

## Regras de negócio implementadas

| Conta    | Tarifa por saque/transferência | Saldo negativo                                 |
| -------- | ------------------------------ | ---------------------------------------------- |
| Corrente | R$ 1,00 por operação           | Permitido até **-R$ 500,00** (cheque especial) |
| Poupança | Isento                         | **Não permitido**                              |

Na transferência, a tarifa é cobrada apenas da conta de **origem**; o destino recebe o valor cheio.

## Testes

A regra de negócio (`accountService`) tem cobertura de testes unitários com **Vitest**, incluindo
os casos de borda das regras R1 e R2: tarifa, limite exato do cheque especial (-R$500,00), saldo
zerado, valores inválidos (zero, negativo, `NaN`) e transferência para a mesma conta.

```bash
cd backend
npm run test
```

Os testes ficam em `backend/src/services/accountService.test.ts`.

## Exemplo de uso (via curl)

```bash
# Saque de R$100 na conta corrente (id 1) — desconta R$101 (R$100 + R$1 de tarifa)
curl -X POST http://localhost:3000/api/accounts/1/saque \
  -H "Content-Type: application/json" \
  -d "{\"valor\": 100}"

# Transferência de R$100 da conta 1 (corrente) para a conta 2 (poupança)
curl -X POST http://localhost:3000/api/accounts/1/transferencia \
  -H "Content-Type: application/json" \
  -d "{\"destinoId\": \"2\", \"valor\": 100}"
```

### Respostas de erro

| Situação                                                                          | Status HTTP |
| --------------------------------------------------------------------------------- | ----------- |
| Valor inválido (zero, negativo, não numérico) ou transferência para a mesma conta | `400`       |
| Conta não encontrada                                                              | `404`       |
| Saldo insuficiente (regra de negócio violada)                                     | `422`       |
| Erro inesperado                                                                   | `500`       |
