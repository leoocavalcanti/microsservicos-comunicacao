const express = require('express');
const metodoPagamentoService = require('../services/metodoPagamento.service');

const router = express.Router();

/**
 * @swagger
 * /api/metodos-pagamento:
 *   get:
 *     summary: Lista todos os métodos de pagamento de um usuário
 *     tags: [Métodos de Pagamento]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de métodos de pagamento
 *       500:
 *         description: Erro ao listar métodos de pagamento
 */
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ erro: 'ID do usuário é obrigatório' });
    }
    const metodosPagamento = await metodoPagamentoService.listarMetodosPagamento(userId);
    res.json(metodosPagamento);
  } catch (error) {
    console.error('Erro ao listar métodos de pagamento:', error);
    res.status(500).json({ erro: 'Erro ao listar métodos de pagamento' });
  }
});

/**
 * @swagger
 * /api/metodos-pagamento:
 *   post:
 *     summary: Cria um novo método de pagamento
 *     tags: [Métodos de Pagamento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - owner_name
 *               - card_number
 *               - expiration_date
 *               - security_code
 *             properties:
 *               user:
 *                 type: string
 *                 format: uuid
 *               owner_name:
 *                 type: string
 *               card_number:
 *                 type: string
 *               expiration_date:
 *                 type: string
 *               security_code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Método de pagamento criado
 *       500:
 *         description: Erro ao criar método de pagamento
 */
router.post('/', async (req, res) => {
  try {
    const metodoPagamento = await metodoPagamentoService.criarMetodoPagamento(req.body);
    res.status(201).json(metodoPagamento);
  } catch (error) {
    console.error('Erro ao criar método de pagamento:', error);
    res.status(500).json({ erro: 'Erro ao criar método de pagamento' });
  }
});

/**
 * @swagger
 * /api/metodos-pagamento/{id}:
 *   patch:
 *     summary: Atualiza um método de pagamento
 *     tags: [Métodos de Pagamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do método de pagamento
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               owner_name:
 *                 type: string
 *               expiration_date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Método de pagamento atualizado
 *       404:
 *         description: Método de pagamento não encontrado
 *       500:
 *         description: Erro ao atualizar método de pagamento
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ erro: 'ID do usuário é obrigatório' });
    }

    const metodoPagamento = await metodoPagamentoService.atualizarMetodoPagamento(userId, id, req.body);
    res.json(metodoPagamento);
  } catch (error) {
    console.error('Erro ao atualizar método de pagamento:', error);
    res.status(500).json({ erro: 'Erro ao atualizar método de pagamento' });
  }
});

/**
 * @swagger
 * /api/metodos-pagamento/{id}:
 *   delete:
 *     summary: Remove um método de pagamento
 *     tags: [Métodos de Pagamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do método de pagamento
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     responses:
 *       204:
 *         description: Método de pagamento removido
 *       404:
 *         description: Método de pagamento não encontrado
 *       500:
 *         description: Erro ao remover método de pagamento
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ erro: 'ID do usuário é obrigatório' });
    }

    await metodoPagamentoService.deletarMetodoPagamento(userId, id);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar método de pagamento:', error);
    res.status(500).json({ erro: 'Erro ao deletar método de pagamento' });
  }
});

exports.metodoPagamentoRoutes = router; 