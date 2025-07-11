import axios from 'axios';
import { MetodoPagamento } from '../types/pagamento.types';
import { createLogger } from './logger.service';

export class MetodoPagamentoService {
  private readonly apiUrl: string;
  private readonly logger = createLogger('MetodoPagamentoService');

  constructor() {
    this.apiUrl = process.env.PAYMENT_METHOD_API_URL || 'http://localhost:8000';
    this.logger.info('API URL configurada', { apiUrl: this.apiUrl });
  }

  async listarMetodosPagamento(userId: string): Promise<MetodoPagamento[]> {
    try {
      this.logger.info('Iniciando busca de métodos de pagamento', { userId });
      this.logger.debug('URL completa', { url: `${this.apiUrl}/payment_method?user=${userId}` });
      
      const response = await axios.get<MetodoPagamento[]>(`${this.apiUrl}/payment_method`, {
        params: { user: userId }
      });
      
      this.logger.debug('Resposta da API', {
        headers: response.headers,
        status: response.status,
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao listar métodos de pagamento', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        response: axios.isAxiosError(error) ? error.response?.data : undefined,
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
        headers: axios.isAxiosError(error) ? error.response?.headers : undefined,
        stack: error instanceof Error ? error.stack : undefined,
        userId
      });
      throw new Error(`Erro ao buscar métodos de pagamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async buscarMetodoPagamento(userId: string, paymentMethodId: string): Promise<MetodoPagamento | null> {
    try {
      this.logger.info('Iniciando busca de método de pagamento específico', { userId, paymentMethodId });
      
      const metodosPagamento = await this.listarMetodosPagamento(userId);
      this.logger.debug('Métodos de pagamento retornados pela API', { metodosPagamento });
      
      if (!Array.isArray(metodosPagamento)) {
        this.logger.error('Resposta da API não é um array', { metodosPagamento });
        throw new Error('Formato de resposta inválido da API de métodos de pagamento');
      }

      const metodoPagamento = metodosPagamento.find(metodo => {
        this.logger.debug('Comparando método', {
          metodoUuid: metodo.uuid,
          paymentMethodId,
          igual: metodo.uuid === paymentMethodId
        });
        return metodo.uuid === paymentMethodId;
      });

      this.logger.info('Resultado da busca de método de pagamento', { 
        encontrado: !!metodoPagamento,
        metodoPagamento 
      });

      if (!metodoPagamento) {
        this.logger.warn('Método de pagamento não encontrado', { userId, paymentMethodId });
        return null;
      }

      return metodoPagamento;
    } catch (error) {
      this.logger.error('Erro ao buscar método de pagamento', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        userId,
        paymentMethodId
      });
      throw new Error(`Erro ao buscar método de pagamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async criarMetodoPagamento(dadosMetodoPagamento: Partial<MetodoPagamento>): Promise<MetodoPagamento> {
    try {
      this.logger.info('Iniciando criação de método de pagamento', { dadosMetodoPagamento });
      const response = await axios.post<MetodoPagamento>(`${this.apiUrl}/payment_method`, dadosMetodoPagamento);
      this.logger.info('Método de pagamento criado com sucesso', { metodoPagamento: response.data });
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao criar método de pagamento', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        dadosMetodoPagamento
      });
      throw new Error('Erro ao criar método de pagamento');
    }
  }

  async atualizarMetodoPagamento(userId: string, paymentMethodId: string, dadosAtualizacao: Partial<MetodoPagamento>): Promise<MetodoPagamento> {
    try {
      this.logger.info('Iniciando atualização de método de pagamento', {
        userId,
        paymentMethodId,
        dadosAtualizacao
      });
      const response = await axios.patch<MetodoPagamento>(`${this.apiUrl}/payment_method`, dadosAtualizacao, {
        params: { user: userId, uuid: paymentMethodId }
      });
      this.logger.info('Método de pagamento atualizado com sucesso', { metodoPagamento: response.data });
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao atualizar método de pagamento', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        userId,
        paymentMethodId,
        dadosAtualizacao
      });
      throw new Error('Erro ao atualizar método de pagamento');
    }
  }

  async deletarMetodoPagamento(userId: string, paymentMethodId: string): Promise<boolean> {
    try {
      this.logger.info('Iniciando exclusão de método de pagamento', { userId, paymentMethodId });
      await axios.delete(`${this.apiUrl}/payment_method`, {
        params: { user: userId, uuid: paymentMethodId }
      });
      this.logger.info('Método de pagamento excluído com sucesso', { userId, paymentMethodId });
      return true;
    } catch (error) {
      this.logger.error('Erro ao deletar método de pagamento', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        userId,
        paymentMethodId
      });
      throw new Error('Erro ao deletar método de pagamento');
    }
  }
} 