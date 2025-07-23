import dotenv from 'dotenv';
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import pagamentoRoutes from './routes/pagamento.routes';
import { DiscoveryService } from './services/discovery.service';
import { createLogger, requestLogger } from './services/logger.service';

dotenv.config();

const logger = createLogger('Server');
const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

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
app.use(express.json());

// Rotas da API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Serviço de pagamento está funcionando corretamente' });
});

app.use('/api/pagamentos', pagamentoRoutes);

const startServer = async () => {
  try {
    const discoveryService = new DiscoveryService();
    await discoveryService.register(port);
    
    app.listen(port, () => {
      logger.info(`Servidor iniciado na porta ${port}`, {
        port,
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version
      });
      logger.info(`Documentação Swagger disponível em http://localhost:${port}/docs`);
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