const express = require('express');
const { PagamentoController } = require('../controllers/pagamento.controller');

const router = express.Router();
const pagamentoController = new PagamentoController();

// Rota para criar pagamento
router.post('/', (req, res) => pagamentoController.criarPagamento(req, res));

// Rota para listar pagamentos
router.get('/', (req, res) => pagamentoController.listarPagamentos(req, res));

// Rota para processar pagamento
router.post('/processar', (req, res) => pagamentoController.processarPagamento(req, res));

// Rota para simular confirmação (deve vir antes da rota de busca por ID)
router.post('/:id/simular-confirmacao', (req, res) => pagamentoController.simularConfirmacaoPagamento(req, res));

// Rota para buscar pagamento por ID
router.get('/:id', (req, res) => pagamentoController.buscarPagamentoPorId(req, res));

// Exportar como pagamentoRoutes para manter compatibilidade com a importação
exports.pagamentoRoutes = router; 