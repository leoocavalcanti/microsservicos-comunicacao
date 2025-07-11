import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { PagamentoController } from './controllers/pagamento.controller';
import { createLogger, requestLogger } from './services/logger.service';

dotenv.config();

const logger = createLogger('Server');
const app = express();
const port = process.env.PORT || 3000;

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Pagamentos',
      version: '1.0.0',
      description: 'API para processamento de pagamentos',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Servidor de Desenvolvimento',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // arquivos para gerar documentação
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(requestLogger);
app.use(express.json())

const pagamentoController = new PagamentoController();

app.post('/api/pagamentos', (req: Request, res: Response) => pagamentoController.criarPagamento(req, res));
app.post('/api/pagamentos/:id/simular-confirmacao', (req: Request, res: Response) => pagamentoController.simularConfirmacaoPagamento(req, res));
app.post('/api/pagamentos/processar', (req: Request, res: Response) => pagamentoController.processarPagamento(req, res));
app.get('/api/pagamentos/:id', (req: Request, res: Response) => pagamentoController.buscarPagamentoPorId(req, res));

app.listen(port, () => {
  logger.info(`Servidor rodando na porta ${port}`, {
    port,
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version
  });
}); 