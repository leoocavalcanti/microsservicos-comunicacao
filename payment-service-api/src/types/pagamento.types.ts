export interface MetodoPagamento {
  uuid: string;
  card_number: string;
  security_code: string;
  user: string;
  owner_name: string;
  expiration_date: string;
}

export interface DetalhesCartao {
  ultimos_digitos: string;
  bandeira: string;
  tipo: string;
}

export interface ResultadoPagamento {
  id: string;
  valor: number;
  status: string;
  mensagem: string;
  data: string;
  detalhes: DetalhesCartao;
}

export interface ResultadoConfirmacao {
  id: string;
  status: string;
  mensagem: string;
  data_confirmacao: string;
}

export interface StatusPagamento {
  id: string;
  status: string;
  ultima_atualizacao: string;
}

export interface CriarPagamentoDTO {
  valor: number;
  idMetodoPagamento: string;
  idUsuario: string;
  descricao?: string;
}

export interface ProcessarPagamentoDTO {
  paymentId: string;
  idUsuario: string;
}

export enum StatusPagamentoEnum {
  APROVADO = 'aprovado',
  PENDENTE = 'pendente',
  RECUSADO = 'recusado'
} 