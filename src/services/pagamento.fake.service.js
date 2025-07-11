class PagamentoFakeService {
  static STATUS = {
    APROVADO: 'aprovado',
    PENDENTE: 'pendente',
    RECUSADO: 'recusado'
  };

  static CARTOES_TESTE = {
    SUCESSO: {
      numero: '4242424242424242',
      status: PagamentoFakeService.STATUS.APROVADO,
      mensagem: 'Pagamento aprovado com sucesso'
    },
    RECUSADO: {
      numero: '4000000000000002',
      status: PagamentoFakeService.STATUS.RECUSADO,
      mensagem: 'Pagamento recusado pela operadora'
    },
    PENDENTE: {
      numero: '4000000000000044',
      status: PagamentoFakeService.STATUS.PENDENTE,
      mensagem: 'Pagamento em análise'
    }
  };

  async criarPagamento({ valor, metodoPagamento }) {
    console.log('Processando pagamento fake:', { valor, metodoPagamento });

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Identificar o tipo de cartão baseado no número
    const cartaoTeste = Object.values(PagamentoFakeService.CARTOES_TESTE)
      .find(cartao => cartao.numero === metodoPagamento.card_number) || PagamentoFakeService.CARTOES_TESTE.SUCESSO;

    // Gerar ID único para o pagamento
    const paymentId = 'pay_' + Math.random().toString(36).substr(2, 9);

    return {
      id: paymentId,
      valor,
      status: cartaoTeste.status,
      mensagem: cartaoTeste.mensagem,
      data: new Date().toISOString(),
      detalhes: {
        ultimos_digitos: metodoPagamento.card_number.slice(-4),
        bandeira: 'VISA',
        tipo: 'Crédito'
      }
    };
  }

  async confirmarPagamento(paymentId) {
    console.log('Confirmando pagamento fake:', paymentId);

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 500));

    // 90% de chance de sucesso
    const sucesso = Math.random() < 0.9;

    return {
      id: paymentId,
      status: sucesso ? PagamentoFakeService.STATUS.APROVADO : PagamentoFakeService.STATUS.RECUSADO,
      mensagem: sucesso ? 'Pagamento confirmado com sucesso' : 'Falha ao confirmar pagamento',
      data_confirmacao: new Date().toISOString()
    };
  }

  async consultarStatus(paymentId) {
    console.log('Consultando status do pagamento fake:', paymentId);

    // Simular delay de consulta
    await new Promise(resolve => setTimeout(resolve, 300));

    // Status aleatório para demonstração
    const statusPossiveis = Object.values(PagamentoFakeService.STATUS);
    const statusAleatorio = statusPossiveis[Math.floor(Math.random() * statusPossiveis.length)];

    return {
      id: paymentId,
      status: statusAleatorio,
      ultima_atualizacao: new Date().toISOString()
    };
  }
}

module.exports = new PagamentoFakeService(); 