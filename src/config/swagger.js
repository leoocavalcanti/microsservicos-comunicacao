const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Pagamentos',
      version: '1.0.0',
      description: 'API para processamento de pagamentos com integração Stripe',
      contact: {
        name: 'Suporte',
        email: 'suporte@exemplo.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Pagamento: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do pagamento'
            },
            valor: {
              type: 'number',
              format: 'float',
              description: 'Valor do pagamento'
            },
            moeda: {
              type: 'string',
              default: 'BRL',
              description: 'Moeda do pagamento'
            },
            status: {
              type: 'string',
              enum: ['pendente', 'aprovado', 'recusado', 'reembolsado'],
              description: 'Status do pagamento'
            },
            idMetodoPagamento: {
              type: 'integer',
              description: 'ID do método de pagamento'
            },
            idUsuario: {
              type: 'integer',
              description: 'ID do usuário'
            },
            descricao: {
              type: 'string',
              description: 'Descrição do pagamento'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            erro: {
              type: 'string',
              description: 'Mensagem de erro'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec; 