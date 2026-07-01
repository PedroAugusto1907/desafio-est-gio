# Banco — Desafio Técnico Agilize

Aplicação de banco com backend em API REST (Node.js + TypeScript + Express). Implementa as
operações de **saque** (obrigatória) e **transferência** (diferencial), respeitando as regras de
tarifa e limite de cheque especial por tipo de conta (Corrente e Poupança).

> ⚠️ **Status atual:** apenas o **backend** está implementado neste momento. O **frontend** ainda
> não foi desenvolvido. Este README será atualizado assim que a interface web estiver pronta.

## Stack

- **Backend:** Node.js 20+ / TypeScript 6+, Express 5
- **Frontend:** ainda não implementado

## Pré-requisitos

- [Node.js](https://nodejs.org/) versão 20 ou superior
- npm (já incluso na instalação do Node)

## Como executar o backend

```bash
cd backend
npm install
npm run dev
```

O servidor sobe em `http://localhost:3000`.

Outros scripts disponíveis:

```bash
npm run build   # compila TypeScript para JavaScript (saída em dist/)
npm run start   # roda a versão compilada (requer build antes)
npm run lint    # checa o código com ESLint
npm run format  # formata o código com Prettier
```

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

| Situação                                      | Status HTTP |
| --------------------------------------------- | ----------- |
| Conta não encontrada                          | `404`       |
| Saldo insuficiente (regra de negócio violada) | `422`       |
| Erro inesperado                               | `500`       |
