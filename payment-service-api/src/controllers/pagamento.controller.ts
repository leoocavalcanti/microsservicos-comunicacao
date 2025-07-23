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
   * /api/pagamentos/{id}/aprovar:
   *   post:
   *     summary: Aprova um pagamento
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
   *         description: Pagamento aprovado com sucesso
   *       404:
   *         description: Pagamento não encontrado
   *       500:
   *         description: Erro ao aprovar pagamento
   */
  async aprovarPagamento(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.logger.info('Iniciando aprovação de pagamento', { id });
      const resultado = await this.pagamentoFacade.aprovarPagamento(id);
      this.logger.info('Pagamento aprovado com sucesso', { resultado });
      res.json(resultado);
    } catch (error) {
      this.logger.error('Erro ao aprovar pagamento', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        id: req.params.id
      });
      res.status(error instanceof Error && error.message.includes('não encontrado') ? 404 : 500)
        .json({ erro: 'Erro ao aprovar pagamento' });
    }
  }

  /**
   * @swagger
   * /api/pagamentos/{id}/rejeitar:
   *   post:
   *     summary: Rejeita um pagamento
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
   *         description: Pagamento rejeitado com sucesso
   *       404:
   *         description: Pagamento não encontrado
   *       500:
   *         description: Erro ao rejeitar pagamento
   */
  async rejeitarPagamento(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.logger.info('Iniciando rejeição de pagamento', { id });
      const resultado = await this.pagamentoFacade.rejeitarPagamento(id);
      this.logger.info('Pagamento rejeitado com sucesso', { resultado });
      res.json(resultado);
    } catch (error) {
      this.logger.error('Erro ao rejeitar pagamento', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        id: req.params.id
      });
      res.status(error instanceof Error && error.message.includes('não encontrado') ? 404 : 500)
        .json({ erro: 'Erro ao rejeitar pagamento' });
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

  /**
   * @swagger
   * /api/pagamentos/usuario/{idUsuario}:
   *   get:
   *     summary: Lista todos os pagamentos de um usuário
   *     tags: [Pagamentos]
   *     parameters:
   *       - in: path
   *         name: idUsuario
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID do usuário (UUID)
   *     responses:
   *       200:
   *         description: Lista de pagamentos do usuário
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   valor:
   *                     type: number
   *                   status:
   *                     type: string
   *                   descricao:
   *                     type: string
   *                   criadoEm:
   *                     type: string
   *                     format: date-time
   *                   eventos:
   *                     type: array
   *                     items:
   *                       type: object
   *       404:
   *         description: Nenhum pagamento encontrado para o usuário
   *       500:
   *         description: Erro ao buscar pagamentos
   */
  async listarPagamentosPorUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { idUsuario } = req.params;
      this.logger.info('Listando pagamentos por usuário', { idUsuario });
      const pagamentos = await this.pagamentoFacade.listarPagamentosPorUsuario(idUsuario);
      
      if (!pagamentos.length) {
        this.logger.info('Nenhum pagamento encontrado para o usuário', { idUsuario });
        res.status(404).json({ mensagem: 'Nenhum pagamento encontrado para este usuário' });
        return;
      }

      this.logger.info('Pagamentos listados com sucesso', { 
        idUsuario, 
        quantidade: pagamentos.length 
      });
      res.json(pagamentos);
    } catch (error) {
      this.logger.error('Erro ao listar pagamentos do usuário', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        idUsuario: req.params.idUsuario
      });
      res.status(500).json({ 
        erro: 'Erro ao listar pagamentos',
        detalhes: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
} 