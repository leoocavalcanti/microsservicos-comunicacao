import { MetodoPagamento, ResultadoConfirmacao, ResultadoPagamento, StatusPagamento, StatusPagamentoEnum } from '../types/pagamento.types';
import { IPagamentoService } from './interfaces/pagamento.service.interface';
import { createLogger } from './logger.service';

interface CartaoTeste {
  numero: string;
  status: StatusPagamentoEnum;
  mensagem: string;
}

export class PagamentoFakeService implements IPagamentoService {
  private readonly logger = createLogger('PagamentoFakeService');
  private static readonly CARTOES_TESTE: Record<string, CartaoTeste> = {
    SUCESSO: {
      numero: '4242424242424242',
      status: StatusPagamentoEnum.APROVADO,
      mensagem: 'Pagamento aprovado com sucesso'
    },
    RECUSADO: {
      numero: '4000000000000002',
      status: StatusPagamentoEnum.RECUSADO,
      mensagem: 'Pagamento recusado pela operadora'
    },
    PENDENTE: {
      numero: '4000000000000044',
      status: StatusPagamentoEnum.PENDENTE,
      mensagem: 'Pagamento em análise'
    }
  };

  async criarPagamento(params: { valor: number; metodoPagamento: MetodoPagamento }): Promise<ResultadoPagamento> {
    const { valor, metodoPagamento } = params;
    this.logger.info('Iniciando processamento de pagamento fake', { valor, metodoPagamento });

    // Simular delay de processamento
    this.logger.debug('Simulando delay de processamento');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Identificar o tipo de cartão baseado no número
    const cartaoTeste = Object.values(PagamentoFakeService.CARTOES_TESTE)
      .find(cartao => cartao.numero === metodoPagamento.card_number) || PagamentoFakeService.CARTOES_TESTE.SUCESSO;

    this.logger.debug('Cartão de teste identificado', { cartaoTeste });

    // Gerar ID único para o pagamento
    const paymentId = 'pay_' + Math.random().toString(36).substr(2, 9);

    const resultado = {
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

    this.logger.info('Pagamento processado com sucesso', { resultado });
    return resultado;
  }

  async confirmarPagamento(paymentId: string): Promise<ResultadoConfirmacao> {
    this.logger.info('Iniciando confirmação de pagamento fake', { paymentId });

    // Simular delay de processamento
    this.logger.debug('Simulando delay de processamento');
    await new Promise(resolve => setTimeout(resolve, 500));

    // 90% de chance de sucesso
    const sucesso = Math.random() < 0.9;
    this.logger.debug('Resultado do processamento', { sucesso });

    const resultado = {
      id: paymentId,
      status: sucesso ? StatusPagamentoEnum.APROVADO : StatusPagamentoEnum.RECUSADO,
      mensagem: sucesso ? 'Pagamento confirmado com sucesso' : 'Falha ao confirmar pagamento',
      data_confirmacao: new Date().toISOString()
    };

    this.logger.info('Confirmação de pagamento processada', { resultado });
    return resultado;
  }

  async consultarStatus(paymentId: string): Promise<StatusPagamento> {
    this.logger.info('Iniciando consulta de status do pagamento fake', { paymentId });

    // Simular delay de consulta
    this.logger.debug('Simulando delay de consulta');
    await new Promise(resolve => setTimeout(resolve, 300));

    // Status aleatório para demonstração
    const statusPossiveis = Object.values(StatusPagamentoEnum);
    const statusAleatorio = statusPossiveis[Math.floor(Math.random() * statusPossiveis.length)];

    const resultado = {
      id: paymentId,
      status: statusAleatorio,
      ultima_atualizacao: new Date().toISOString()
    };

    this.logger.info('Status do pagamento consultado', { resultado });
    return resultado;
  }
} 