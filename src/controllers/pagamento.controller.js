const { PrismaClient } = require('@prisma/client');
const metodoPagamentoService = require('../services/metodoPagamento.service');
const pagamentoFakeService = require('../services/pagamento.fake.service');
const prisma = new PrismaClient();

class PagamentoController {
  async criarPagamento(req, res) {
    try {
      const { valor, idMetodoPagamento, idUsuario, descricao } = req.body;

      // Validar método de pagamento
      const metodoPagamento = await metodoPagamentoService.buscarMetodoPagamento(idUsuario, idMetodoPagamento);
      if (!metodoPagamento) {
        return res.status(404).json({
          erro: 'Método de pagamento não encontrado'
        });
      }

      // Converter o valor para reais
      const valorEmReais = parseFloat(valor);

      // Validar valor mínimo (R$ 0,50)
      if (valorEmReais < 0.5) {
        return res.status(400).json({
          erro: 'O valor mínimo para pagamento é R$ 0,50'
        });
      }

      // Criar pagamento usando o serviço fake
      const resultadoPagamento = await pagamentoFakeService.criarPagamento({
        valor: valorEmReais,
        metodoPagamento
      });

      console.log('Pagamento processado:', resultadoPagamento);

      // Salvar no banco
      const pagamento = await prisma.pagamento.create({
        data: {
          valor: valorEmReais,
          idMetodoPagamento,
          idUsuario,
          descricao,
          status: resultadoPagamento.status,
          eventos: {
            create: {
              tipo: 'pagamento.criado',
              conteudoJson: JSON.stringify(resultadoPagamento)
            }
          }
        }
      });

      res.json({
        pagamentoId: pagamento.id,
        status: resultadoPagamento.status,
        mensagem: resultadoPagamento.mensagem,
        detalhes: resultadoPagamento.detalhes
      });
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      res.status(500).json({ 
        erro: 'Erro ao processar pagamento',
        detalhes: error.message 
      });
    }
  }

  async processarPagamento(req, res) {
    try {
      const { paymentId, idUsuario } = req.body;

      // Buscar o pagamento no banco de dados
      const pagamento = await prisma.pagamento.findFirst({
        where: {
          id: paymentId,
          idUsuario
        }
      });

      if (!pagamento) {
        return res.status(404).json({ erro: 'Pagamento não encontrado' });
      }

      // Confirmar pagamento usando o serviço fake
      const resultadoConfirmacao = await pagamentoFakeService.confirmarPagamento(paymentId);

      // Atualizar status no banco
      const pagamentoAtualizado = await prisma.pagamento.update({
        where: { id: paymentId },
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

      res.json({
        status: resultadoConfirmacao.status,
        mensagem: resultadoConfirmacao.mensagem,
        pagamento: pagamentoAtualizado
      });
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      res.status(500).json({ erro: 'Erro ao processar pagamento' });
    }
  }

  async listarPagamentos(req, res) {
    try {
      const pagamentos = await prisma.pagamento.findMany({
        include: {
          eventos: true
        },
        orderBy: {
          criadoEm: 'desc'
        }
      });
      res.json(pagamentos);
    } catch (error) {
      console.error('Erro ao listar pagamentos:', error);
      res.status(500).json({ erro: 'Erro ao listar pagamentos' });
    }
  }

  async buscarPagamentoPorId(req, res) {
    try {
      const { id } = req.params;
      const pagamento = await prisma.pagamento.findUnique({
        where: { id },
        include: {
          eventos: true
        }
      });

      if (!pagamento) {
        return res.status(404).json({ erro: 'Pagamento não encontrado' });
      }

      // Consultar status atualizado
      const statusAtual = await pagamentoFakeService.consultarStatus(id);

      res.json({
        ...pagamento,
        status_atual: statusAtual
      });
    } catch (error) {
      console.error('Erro ao buscar pagamento:', error);
      res.status(500).json({ erro: 'Erro ao buscar pagamento' });
    }
  }

  async simularConfirmacaoPagamento(req, res) {
    try {
      const { id } = req.params;
      const pagamento = await prisma.pagamento.findUnique({
        where: { id }
      });

      if (!pagamento) {
        return res.status(404).json({ erro: 'Pagamento não encontrado' });
      }

      // Simular confirmação usando o serviço fake
      const resultadoConfirmacao = await pagamentoFakeService.confirmarPagamento(id);

      // Atualizar status no banco
      await prisma.pagamento.update({
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

      res.json({ 
        mensagem: 'Pagamento simulado com sucesso',
        resultado: resultadoConfirmacao
      });
    } catch (error) {
      console.error('Erro ao simular confirmação:', error);
      res.status(500).json({ erro: 'Erro ao simular confirmação' });
    }
  }
}

module.exports = { PagamentoController }; 