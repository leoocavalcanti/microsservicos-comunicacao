import cors from 'cors';
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import healthRoutes from './routes/health.routes';
import pagamentoRoutes from './routes/pagamento.routes';
import { DiscoveryService } from './services/discovery.service';
import { createLogger } from './services/logger.service';

const app = express();
const logger = createLogger('App');
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Pagamentos',
      version: '1.0.0',
      description: 'API para gerenciamento de pagamentos',
    },
  },
  apis: ['./src/controllers/*.ts'], // Arquivos com anotações do Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da API
app.use('/', healthRoutes);
app.use('/api/pagamentos', pagamentoRoutes);

const startServer = async () => {
  try {
    const discoveryService = new DiscoveryService();
    await discoveryService.register(port);
    
    app.listen(port, () => {
      logger.info(`Servidor iniciado na porta ${port}`);
      logger.info(`Documentação Swagger disponível em http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    logger.error('Erro ao iniciar servidor', {
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1);
  }
};

startServer(); 