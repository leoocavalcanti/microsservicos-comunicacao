require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const pagamentoRoutes = require('./routes/pagamento.routes');
const { PagamentoController } = require('./controllers/pagamento.controller');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Configuração padrão para outras rotas
app.use(express.json());

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configuração específica para webhook do Stripe
app.post('/api/pagamentos/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const pagamentoController = new PagamentoController();
  return pagamentoController.handleWebhook(req, res);
});

// Rotas de pagamento
app.use('/api/pagamentos', pagamentoRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Documentação Swagger disponível em http://localhost:${port}/api-docs`);
}); 