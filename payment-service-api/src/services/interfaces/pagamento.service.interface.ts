import { MetodoPagamento, ResultadoConfirmacao, ResultadoPagamento, StatusPagamento } from '../../types/pagamento.types';

export interface IPagamentoService {
  criarPagamento(params: {
    valor: number;
    metodoPagamento: MetodoPagamento;
  }): Promise<ResultadoPagamento>;

  confirmarPagamento(paymentId: string): Promise<ResultadoConfirmacao>;

  consultarStatus(paymentId: string): Promise<StatusPagamento>;
} 