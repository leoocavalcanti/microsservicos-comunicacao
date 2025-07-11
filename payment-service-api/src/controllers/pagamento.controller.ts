import { Request, Response } from 'express';
import { PagamentoFacade } from '../services/facades/pagamento.facade';
import { createLogger } from '../services/logger.service';

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

  async listarPagamentos(req: Request, res: Response): Promise<void> {
    try {
      this.logger.info('Iniciando listagem de pagamentos');
      const pagamentos = await this.pagamentoFacade.listarPagamentos();
      this.logger.info('Pagamentos listados com sucesso', { quantidade: pagamentos.length });
      res.json(pagamentos);
    } catch (error) {
      this.logger.error('Erro ao listar pagamentos', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({ erro: 'Erro ao listar pagamentos' });
    }
  }

  async buscarPagamentoPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      this.logger.info('Iniciando busca de pagamento por ID', { id });
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
} 