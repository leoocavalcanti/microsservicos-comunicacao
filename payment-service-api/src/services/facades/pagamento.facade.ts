import { PrismaClient } from '@prisma/client';
import { CriarPagamentoDTO, ProcessarPagamentoDTO, ResultadoConfirmacao, ResultadoPagamento, StatusPagamento } from '../../types/pagamento.types';
import { MetodoPagamentoService } from '../metodoPagamento.service';
import { PagamentoFakeService } from '../pagamento.fake.service';

export class PagamentoFacade {
  private readonly prisma: PrismaClient;
  private readonly metodoPagamentoService: MetodoPagamentoService;
  private readonly pagamentoService: PagamentoFakeService;

  constructor() {
    this.prisma = new PrismaClient();
    this.metodoPagamentoService = new MetodoPagamentoService();
    this.pagamentoService = new PagamentoFakeService();
  }

  async criarPagamento(dados: CriarPagamentoDTO): Promise<{
    pagamentoId: string;
    status: string;
    mensagem: string;
    detalhes: ResultadoPagamento['detalhes'];
  }> {
    // Validar método de pagamento
    const metodoPagamento = await this.metodoPagamentoService.buscarMetodoPagamento(
      dados.idUsuario,
      dados.idMetodoPagamento
    );

    if (!metodoPagamento) {
      throw new Error('Método de pagamento não encontrado');
    }

    // Validar valor mínimo (R$ 0,50)
    if (dados.valor < 0.5) {
      throw new Error('O valor mínimo para pagamento é R$ 0,50');
    }

    // Criar pagamento usando o serviço fake
    const resultadoPagamento = await this.pagamentoService.criarPagamento({
      valor: dados.valor,
      metodoPagamento
    });

    // Salvar no banco
    const pagamento = await this.prisma.pagamento.create({
      data: {
        valor: dados.valor,
        idMetodoPagamento: dados.idMetodoPagamento,
        idUsuario: dados.idUsuario,
        descricao: dados.descricao,
        status: resultadoPagamento.status,
        eventos: {
          create: {
            tipo: 'pagamento.criado',
            conteudoJson: JSON.stringify(resultadoPagamento)
          }
        }
      }
    });

    return {
      pagamentoId: pagamento.id,
      status: resultadoPagamento.status,
      mensagem: resultadoPagamento.mensagem,
      detalhes: resultadoPagamento.detalhes
    };
  }

  async processarPagamento(dados: ProcessarPagamentoDTO): Promise<{
    status: string;
    mensagem: string;
    pagamento: any;
  }> {
    // Buscar o pagamento no banco de dados
    const pagamento = await this.prisma.pagamento.findFirst({
      where: {
        id: dados.paymentId,
        idUsuario: dados.idUsuario
      }
    });

    if (!pagamento) {
      throw new Error('Pagamento não encontrado');
    }

    // Confirmar pagamento usando o serviço fake
    const resultadoConfirmacao = await this.pagamentoService.confirmarPagamento(dados.paymentId);

    // Atualizar status no banco
    const pagamentoAtualizado = await this.prisma.pagamento.update({
      where: { id: dados.paymentId },
      data: {
        status: resultadoConfirmacao.status,
        eventos: {
          create: {
            tipo: 'pagamento.confirmado',
            conteudoJson: JSON.stringify(resultadoConfirmacao)
          }
        }
      }
    });

    return {
      status: resultadoConfirmacao.status,
      mensagem: resultadoConfirmacao.mensagem,
      pagamento: pagamentoAtualizado
    };
  }

  async listarPagamentos(): Promise<any[]> {
    return this.prisma.pagamento.findMany({
      include: {
        eventos: true
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });
  }

  async listarPagamentosPorUsuario(idUsuario: string): Promise<any[]> {
    return this.prisma.pagamento.findMany({
      where: {
        idUsuario
      },
      include: {
        eventos: true
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });
  }

  async buscarPagamentoPorId(id: string): Promise<{
    pagamento: any;
    status_atual: StatusPagamento;
  }> {
    const pagamento = await this.prisma.pagamento.findUnique({
      where: { id },
      include: {
        eventos: true
      }
    });

    if (!pagamento) {
      throw new Error('Pagamento não encontrado');
    }

    // Consultar status atualizado
    const statusAtual = await this.pagamentoService.consultarStatus(id);

    return {
      pagamento,
      status_atual: statusAtual
    };
  }

  async simularConfirmacaoPagamento(id: string): Promise<{
    mensagem: string;
    resultado: ResultadoConfirmacao;
  }> {
    const pagamento = await this.prisma.pagamento.findUnique({
      where: { id }
    });

    if (!pagamento) {
      throw new Error('Pagamento não encontrado');
    }

    // Simular confirmação usando o serviço fake
    const resultadoConfirmacao = await this.pagamentoService.confirmarPagamento(id);

    // Atualizar status no banco
    await this.prisma.pagamento.update({
      where: { id },
      data: {
        status: resultadoConfirmacao.status,
        eventos: {
          create: {
            tipo: 'pagamento.simulado',
            conteudoJson: JSON.stringify(resultadoConfirmacao)
          }
        }
      }
    });

    return {
      mensagem: 'Pagamento simulado com sucesso',
      resultado: resultadoConfirmacao
    };
  }
} 