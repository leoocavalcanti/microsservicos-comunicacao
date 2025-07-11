const axios = require('axios');

class MetodoPagamentoService {
  constructor() {
    this.apiUrl = process.env.PAYMENT_METHOD_API_URL || 'http://localhost:8000';
    console.log('API URL configurada:', this.apiUrl);
  }

  async listarMetodosPagamento(userId) {
    try {
      console.log('Iniciando busca de métodos de pagamento para usuário:', userId);
      console.log('URL completa:', `${this.apiUrl}/payment_method?user=${userId}`);
      
      const response = await axios.get(`${this.apiUrl}/payment_method`, {
        params: { user: userId }
      });
      
      console.log('Headers da resposta:', response.headers);
      console.log('Status da resposta:', response.status);
      console.log('Dados da resposta:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao listar métodos de pagamento:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        stack: error.stack
      });
      throw new Error(`Erro ao buscar métodos de pagamento: ${error.message}`);
    }
  }

  async buscarMetodoPagamento(userId, paymentMethodId) {
    try {
      console.log('Iniciando busca de método de pagamento específico:', { userId, paymentMethodId });
      
      const metodosPagamento = await this.listarMetodosPagamento(userId);
      console.log('Métodos de pagamento retornados pela API:', metodosPagamento);
      
      if (!Array.isArray(metodosPagamento)) {
        console.error('Resposta da API não é um array:', metodosPagamento);
        throw new Error('Formato de resposta inválido da API de métodos de pagamento');
      }

      const metodoPagamento = metodosPagamento.find(metodo => {
        console.log('Comparando método:', {
          metodoUuid: metodo.uuid,
          paymentMethodId,
          igual: metodo.uuid === paymentMethodId
        });
        return metodo.uuid === paymentMethodId;
      });

      console.log('Método de pagamento encontrado:', metodoPagamento);

      if (!metodoPagamento) {
        console.error('Método de pagamento não encontrado para os IDs:', { userId, paymentMethodId });
        return null;
      }

      return metodoPagamento;
    } catch (error) {
      console.error('Erro detalhado ao buscar método de pagamento:', {
        message: error.message,
        stack: error.stack,
        userId,
        paymentMethodId
      });
      throw new Error(`Erro ao buscar método de pagamento: ${error.message}`);
    }
  }

  async criarMetodoPagamento(dadosMetodoPagamento) {
    try {
      const response = await axios.post(`${this.apiUrl}/payment_method`, dadosMetodoPagamento);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar método de pagamento:', error.message);
      throw new Error('Erro ao criar método de pagamento');
    }
  }

  async atualizarMetodoPagamento(userId, paymentMethodId, dadosAtualizacao) {
    try {
      const response = await axios.patch(`${this.apiUrl}/payment_method`, dadosAtualizacao, {
        params: { user: userId, uuid: paymentMethodId }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar método de pagamento:', error.message);
      throw new Error('Erro ao atualizar método de pagamento');
    }
  }

  async deletarMetodoPagamento(userId, paymentMethodId) {
    try {
      await axios.delete(`${this.apiUrl}/payment_method`, {
        params: { user: userId, uuid: paymentMethodId }
      });
      return true;
    } catch (error) {
      console.error('Erro ao deletar método de pagamento:', error.message);
      throw new Error('Erro ao deletar método de pagamento');
    }
  }
}

module.exports = new MetodoPagamentoService(); 