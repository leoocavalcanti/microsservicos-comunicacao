import { Router } from 'express';
import { PagamentoController } from '../controllers/pagamento.controller';

const router = Router();
const pagamentoController = new PagamentoController();

router.post('/', (req, res) => pagamentoController.criarPagamento(req, res));
router.post('/processar', (req, res) => pagamentoController.processarPagamento(req, res));
router.get('/usuario/:idUsuario', (req, res) => pagamentoController.listarPagamentosPorUsuario(req, res));
router.get('/:id', (req, res) => pagamentoController.buscarPagamentoPorId(req, res));
router.post('/:id/simular-confirmacao', (req, res) => pagamentoController.simularConfirmacaoPagamento(req, res));

export default router; 