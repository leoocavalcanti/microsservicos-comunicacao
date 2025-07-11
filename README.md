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
│   ├── prisma/              # Configuração e migrações do Prisma
│   ├── Dockerfile          # Dockerfile da API de pagamentos
│   ├── package.json       # Dependências
│   └── tsconfig.json     # Configuração TypeScript
│
├── payment-method-api/    # API de Métodos de Pagamento (Python)
│   ├── api.py           # Código da API FastAPI
│   ├── Dockerfile      # Dockerfile da API de métodos
│   └── pyproject.toml # Dependências Python
│
└── docker-compose.yml   # Configuração dos serviços
```

## Serviços

### 1. API de Pagamentos (payment-service-api)
- **Tecnologia**: Node.js + TypeScript + Express
- **Banco de Dados**: PostgreSQL
- **Porta**: 3000
- **Responsabilidades**:
  - Processamento de pagamentos
  - Gestão de transações
  - Registro de eventos

### 2. API de Métodos de Pagamento (payment-method-api)
- **Tecnologia**: Python + FastAPI
- **Banco de Dados**: PostgreSQL
- **Porta**: 8000
- **Responsabilidades**:
  - CRUD de métodos de pagamento
  - Validação de cartões
  - Gestão de dados sensíveis

## Como Executar

1. Clone o repositório
2. Execute os serviços:
   ```bash
   docker-compose up --build
   ```

3. Acesse:
   - API de Pagamentos: http://localhost:3000
   - API de Métodos de Pagamento: http://localhost:8000/docs

## Desenvolvimento

### API de Pagamentos
```bash
cd payment-service-api
npm install
npm run dev
```

### API de Métodos de Pagamento
```bash
cd payment-method-api
python -m venv .venv
source .venv/bin/activate  # ou `.venv\Scripts\activate` no Windows
pip install -r requirements.txt
uvicorn api:app --reload
```

## Bancos de Dados

O sistema utiliza dois bancos PostgreSQL:

1. **Banco Principal** (porta 5432)
   - Armazena pagamentos e eventos
   - Usado pela API de Pagamentos

2. **Banco de Métodos** (porta 5433)
   - Armazena dados de cartões
   - Usado pela API de Métodos de Pagamento

## Logs

Os logs são armazenados em:
- `payment-service-api/logs/error.log`: Apenas erros
- `payment-service-api/logs/combined.log`: Todos os logs 