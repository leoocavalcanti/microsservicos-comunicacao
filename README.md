# Microsserviço de Pagamentos

Serviço responsável por processar pagamentos utilizando a integração com Stripe.

## Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Conta no Stripe (para obter as chaves de API)

## Configuração

1. Clone o repositório
2. Crie um arquivo `.env` baseado no `.env.example`:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pagamento_service?schema=public"
   STRIPE_SECRET_KEY="sua_chave_secreta_do_stripe"
   STRIPE_WEBHOOK_SECRET="seu_webhook_secret_do_stripe"
   PORT=3000
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Execute as migrações do banco:
   ```bash
   npx prisma migrate dev
   ```

## Executando com Docker

```bash
docker-compose up -d
```

## Endpoints

### POST /api/pagamentos
Cria uma nova intenção de pagamento.

Payload:
```json
{
  "valor": 100.00,
  "idMetodoPagamento": 1,
  "idUsuario": 1,
  "descricao": "Pagamento de teste"
}
```

### POST /api/pagamentos/:id/confirmar
Confirma um pagamento após processamento no Stripe.

### GET /api/pagamentos
Lista todos os pagamentos.

### GET /api/pagamentos/:id
Busca um pagamento específico.

### POST /api/pagamentos/webhook
Endpoint para receber webhooks do Stripe.

## Desenvolvimento

Para rodar em modo desenvolvimento:

```bash
npm run dev
```

## Estrutura do Banco de Dados

### Pagamento
- Armazena informações do pagamento
- Relacionamento com eventos e reembolso

### PagamentoEvento
- Registra eventos do ciclo de vida do pagamento
- Log de todas as interações com Stripe

### Reembolso
- Informações de reembolsos quando aplicável

## Integração com Stripe

O serviço utiliza o Stripe para processamento de pagamentos. É necessário configurar:

1. Chave secreta do Stripe (`STRIPE_SECRET_KEY`)
2. Webhook secret para validar eventos (`STRIPE_WEBHOOK_SECRET`)

Para testar em desenvolvimento, use cartões de teste do Stripe:
- 4242 4242 4242 4242 (Sucesso)
- 4000 0000 0000 0002 (Recusado) 