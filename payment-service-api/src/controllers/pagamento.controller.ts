import { Request, Response } from 'express';
import { PagamentoFacade } from '../services/facades/pagamento.facade';
import { createLogger } from '../services/logger.service';

/**
 * @swagger
 * /api/pagamentos:
 *   post:
 *     summary: Cria um novo pagamento
 *     tags: [Pagamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - valor
 *               - idMetodoPagamento
 *               - idUsuario
 *             properties:
 *               valor:
 *                 type: number
 *                 description: Valor do pagamento
 *               idMetodoPagamento:
 *                 type: string
 *                 description: ID do método de pagamento
 *               idUsuario:
 *                 type: string
 *                 description: ID do usuário
 *               descricao:
 *                 type: string
 *                 description: Descrição do pagamento
 *     responses:
 *       200:
 *         description: Pagamento criado com sucesso
 *       500:
 *         description: Erro ao criar pagamento
 */
export class PagamentoController {
  private readonly pagamentoFacade: PagamentoFacade;
  private readonly logger = createLogger('PagamentoController');

  constructor() {
    this.pagamentoFacade = new PagamentoFacade();
  }

  async criarPagamento(req: Request, res: Response): Promise<void> {
    try {
      this.logger.info('Iniciando criação de pagamento', { body: req.body });
      const resultado = await this.pagamentoFacade.criarPagamento(req.body);
      this.logger.info('Pagamento criado com sucesso', { resultado });
      res.json(resultado);
    } catch (error) {
      this.logger.error('Erro ao criar pagamento', { 
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        body: req.body
      });
      res.status(error instanceof Error && error.message.includes('não encontrado') ? 404 : 500).json({ 
        erro: 'Erro ao processar pagamento',
        detalhes: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * @swagger
   * /api/pagamentos/processar:
   *   post:
   *     summary: Processa um pagamento
   *     tags: [Pagamentos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - idPagamento
   *             properties:
   *               idPagamento:
   *                 type: string
   *                 description: ID do pagamento a ser processado
   *     responses:
   *       200:
   *         description: Pagamento processado com sucesso
   *       404:
   *         description: Pagamento não encontrado
   *       500:
   *         description: Erro ao processar pagamento
   */
  async processarPagamento(req: Request, res: Response): Promise<void> {
    try {
      this.logger.info('Iniciando processamento de pagamento', { body: req.body });
      const resultado = await this.pagamentoFacade.processarPagamento(req.body);
      this.logger.info('Pagamento processado com sucesso', { resultado });
      res.json(resultado);
    } catch (error) {
      this.logger.error('Erro ao processar pagamento', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        body: req.body
      });
      res.status(error instanceof Error && error.message.includes('não encontrado') ? 404 : 500)
        .json({ erro: 'Erro ao processar pagamento' });
    }
  }

  /**
   * @swagger
   * /api/pagamentos/{id}/simular-confirmacao:
   *   post:
   *     summary: Simula a confirmação de um pagamento
   *     tags: [Pagamentos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do pagamento
   *     responses:
   *       200:
   *         description: Simulação realizada com sucesso
   *       404:
   *         description: Pagamento não encontrado
   *       500:
   *         description: Erro ao simular confirmação
   */
  async simularConfirmacaoPagamento(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.logger.info('Iniciando simulação de confirmação de pagamento', { id });
      const resultado = await this.pagamentoFacade.simularConfirmacaoPagamento(id);
      this.logger.info('Simulação de confirmação realizada com sucesso', { resultado });
      res.json(resultado);
    } catch (error) {
      this.logger.error('Erro ao simular confirmação', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        id: req.params.id
      });
      res.status(error instanceof Error && error.message.includes('não encontrado') ? 404 : 500)
        .json({ erro: 'Erro ao simular confirmação' });
    }
  }

  /**
   * @swagger
   * /api/pagamentos/{id}:
   *   get:
   *     summary: Busca um pagamento por ID
   *     tags: [Pagamentos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do pagamento
   *     responses:
   *       200:
   *         description: Pagamento encontrado
   *       404:
   *         description: Pagamento não encontrado
   *       500:
   *         description: Erro ao buscar pagamento
   */
  async buscarPagamentoPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.logger.info('Buscando pagamento por ID', { id });
      const resultado = await this.pagamentoFacade.buscarPagamentoPorId(id);
      this.logger.info('Pagamento encontrado com sucesso', { resultado });
      res.json(resultado);
    } catch (error) {
      this.logger.error('Erro ao buscar pagamento', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        id: req.params.id
      });
      res.status(error instanceof Error && error.message.includes('não encontrado') ? 404 : 500)
        .json({ erro: 'Erro ao buscar pagamento' });
    }
  }
} 