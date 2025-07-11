# Sistema de Pagamentos

Este é um sistema de processamento de pagamentos composto por dois microsserviços:

## Estrutura do Projeto

```
.
├── payment-service-api/        # API Principal de Pagamentos (Node.js)
│   ├── src/                   # Código fonte
│   │   ├── controllers/       # Controladores
│   │   ├── services/         # Serviços
│   │   ├── types/           # Tipos e interfaces
│   │   └── server.ts        # Entrada da aplicação
│   ├── prisma/              # Configuração do Prisma
│   ├── data/               # Dados persistentes do banco PostgreSQL
│   ├── logs/              # Logs da aplicação
│   ├── Dockerfile        # Dockerfile da API de pagamentos
│   ├── package.json     # Dependências
│   └── tsconfig.json   # Configuração TypeScript
│
├── payment-method-api/    # API de Métodos de Pagamento (Python)
│   ├── api.py           # Código da API FastAPI
│   ├── data/           # Dados persistentes do banco PostgreSQL
│   ├── Dockerfile     # Dockerfile da API de métodos
│   └── pyproject.toml # Dependências Python
│
└── docker-compose.yml   # Configuração dos serviços

```

## Como Executar

1. Clone o repositório

2. Execute os serviços:
   ```bash
   docker-compose up --build
   ```

   Na primeira execução, aguarde até que:
   - Os bancos de dados estejam prontos (healthcheck)
   - O schema do banco seja criado
   - As APIs iniciem

   O sistema usa healthcheck para garantir que os bancos estejam prontos antes de iniciar as APIs.
   Se precisar reiniciar apenas um serviço:
   ```bash
   docker-compose restart payment-service-app    # Reinicia API Node.js
   docker-compose restart payment-method-app     # Reinicia API Python
   docker-compose restart payment-service-db     # Reinicia banco principal
   docker-compose restart payment-method-db      # Reinicia banco de métodos
   ```

3. Acesse as documentações:
   - API de Pagamentos: http://localhost:3000/api-docs
   - API de Métodos de Pagamento: http://localhost:8000/docs

## Serviços Docker

O sistema é composto por 4 containers Docker:

1. **payment-service-app** (porta 3000)
   - API principal de pagamentos (Node.js)
   - Processa e gerencia pagamentos
   - Logs em `payment-service-api/logs/`

2. **payment-method-app** (porta 8000)
   - API de métodos de pagamento (Python)
   - Gerencia cartões e dados sensíveis

3. **payment-service-db** (porta 5432)
   - Banco PostgreSQL para pagamentos
   - Dados persistidos em `payment-service-api/data/`

4. **payment-method-db** (porta 5433)
   - Banco PostgreSQL para métodos de pagamento
   - Dados persistidos em `payment-method-api/data/`

## Bancos de Dados

O sistema utiliza dois bancos PostgreSQL que são recriados a cada inicialização:

1. **payment-service-db** (porta 5432)
   - Armazena pagamentos e eventos
   - Usado pela API de Pagamentos
   - Schema gerenciado pelo Prisma
   - Recriado automaticamente na inicialização
   - Dados persistidos em `payment-service-api/data/`

2. **payment-method-db** (porta 5433)
   - Armazena dados de cartões
   - Usado pela API de Métodos de Pagamento
   - Schema gerenciado pelo SQLModel
   - Recriado automaticamente na inicialização
   - Dados persistidos em `payment-method-api/data/`

### Migrações

#### API de Pagamentos (Node.js)
As migrações são gerenciadas pelo Prisma e são executadas automaticamente na inicialização. Se precisar executar manualmente:

```bash
# Dentro do container
docker-compose exec app npx prisma migrate deploy

# Ou localmente (necessário ter Node.js)
cd payment-service-api
npx prisma migrate deploy
```

#### API de Métodos de Pagamento (Python)
As migrações são gerenciadas pelo SQLModel e são executadas automaticamente na inicialização.

## IDs do Sistema

Nos exemplos abaixo, você encontrará alguns IDs que precisam ser substituídos. Aqui está a explicação de cada um:

### METHOD_ID
- É o ID do método de pagamento (cartão)
- Formato: UUID (ex: "550e8400-e29b-41d4-a716-446655440000")
- **Obtido através da API Python** ao criar um método de pagamento
- Use este ID ao criar um pagamento na API Node.js

### PAYMENT_ID
- É o ID do pagamento
- Formato: UUID (ex: "7d793789-d2bd-4c93-a5e9-1e4f62c8e7d9")
- **Obtido através da API Node.js** ao criar um pagamento
- Use este ID para processar, simular ou consultar o pagamento

### USER_ID
- É o ID do usuário no sistema
- Formato: UUID (ex: "123e4567-e89b-12d3-a456-426614174000")
- Deve ser fornecido pelo seu sistema de autenticação
- Usado em ambas as APIs para identificar o usuário

## Guia de Uso das APIs

### API de Métodos de Pagamento (Python - porta 8000)

Esta API gerencia os métodos de pagamento (cartões) dos usuários.

#### 1. Criar Método de Pagamento
```bash
curl -X POST http://localhost:8000/api/metodos-pagamento \
  -H "Content-Type: application/json" \
  -d '{
    "user": "123e4567-e89b-12d3-a456-426614174000",
    "owner_name": "João Silva",
    "card_number": "4111111111111111",
    "expiration_date": "12/25",
    "security_code": "123"
  }'
```

#### 2. Listar Métodos de Pagamento do Usuário
```bash
curl "http://localhost:8000/api/metodos-pagamento?userId=123e4567-e89b-12d3-a456-426614174000"
```

#### 3. Atualizar Método de Pagamento
```bash
curl -X PATCH http://localhost:8000/api/metodos-pagamento/METHOD_ID \
  -H "Content-Type: application/json" \
  -d '{
    "owner_name": "João Silva Santos",
    "expiration_date": "12/26"
  }'
```

#### 4. Deletar Método de Pagamento
```bash
curl -X DELETE "http://localhost:8000/api/metodos-pagamento/METHOD_ID?userId=123e4567-e89b-12d3-a456-426614174000"
```

### API de Pagamentos (Node.js - porta 3000)

Esta API processa pagamentos usando os métodos de pagamento cadastrados.

#### 1. Criar Pagamento
```bash
curl -X POST http://localhost:3000/api/pagamentos \
  -H "Content-Type: application/json" \
  -d '{
    "valor": 100.50,
    "idMetodoPagamento": "METHOD_ID",  # ID retornado pela API Python ao criar método de pagamento
    "idUsuario": "123e4567-e89b-12d3-a456-426614174000",
    "descricao": "Compra de produto"
  }'
```

#### 2. Processar Pagamento
```bash
curl -X POST http://localhost:3000/api/pagamentos/processar \
  -H "Content-Type: application/json" \
  -d '{
    "idPagamento": "PAYMENT_ID"  # ID retornado pela API Node.js ao criar pagamento
  }'
```

#### 3. Simular Confirmação de Pagamento
```bash
curl -X POST http://localhost:3000/api/pagamentos/PAYMENT_ID/simular-confirmacao  # ID retornado pela API Node.js ao criar pagamento
```

#### 4. Buscar Pagamento por ID
```bash
curl http://localhost:3000/api/pagamentos/PAYMENT_ID  # ID retornado pela API Node.js ao criar pagamento
```

## Fluxo Típico de Uso

1. Cadastre um método de pagamento usando a API Python
   - Guarde o METHOD_ID retornado na resposta

2. Use o METHOD_ID para criar um pagamento na API Node.js
   - Guarde o PAYMENT_ID retornado na resposta

3. Use o PAYMENT_ID para:
   - Processar o pagamento
   - Simular confirmação (em ambiente de desenvolvimento)
   - Consultar o status

## Logs

Os logs são armazenados em:
- `payment-service-api/logs/error.log`: Apenas erros
- `payment-service-api/logs/combined.log`: Todos os logs

## Exemplos de Respostas

### Criar Método de Pagamento (Python API)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",  # Este é o METHOD_ID que você usará na API Node.js
  "user": "123e4567-e89b-12d3-a456-426614174000",
  "owner_name": "João Silva",
  "card_number": "411111******1111",
  "expiration_date": "12/25"
}
```

### Criar Pagamento (Node.js API)
```json
{
  "id": "7d793789-d2bd-4c93-a5e9-1e4f62c8e7d9",  # Este é o PAYMENT_ID que você usará para processar/consultar
  "valor": 100.50,
  "moeda": "BRL",
  "status": "pendente",
  "idMetodoPagamento": "550e8400-e29b-41d4-a716-446655440000",
  "idUsuario": "123e4567-e89b-12d3-a456-426614174000",
  "descricao": "Compra de produto",
  "criadoEm": "2024-03-15T10:30:00Z"
}
```

## Códigos de Status

- 200: Sucesso
- 201: Recurso criado
- 400: Erro nos dados enviados
- 404: Recurso não encontrado
- 500: Erro interno do servidor 