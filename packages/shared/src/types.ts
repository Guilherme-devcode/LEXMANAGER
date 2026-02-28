import {
  UserRole,
  ProcessoStatus,
  AreaDireito,
  ClienteStatus,
  ClienteTipo,
  LancamentoTipo,
  LancamentoStatus,
  PrazoTipo,
  PrazoStatus,
} from './enums';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserDto {
  id: string;
  tenantId: string;
  nome: string;
  email: string;
  role: UserRole;
  ativo: boolean;
  totpEnabled: boolean;
  createdAt: string;
}

export interface TenantDto {
  id: string;
  nome: string;
  cnpj?: string;
  email: string;
  telefone?: string;
  plano: string;
  ativo: boolean;
  createdAt: string;
}

export interface ClienteDto {
  id: string;
  tenantId: string;
  tipo: ClienteTipo;
  status: ClienteStatus;
  nome: string;
  cpfCnpj?: string;
  email?: string;
  telefone?: string;
  celular?: string;
  endereco?: EnderecoDto;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnderecoDto {
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export interface ProcessoDto {
  id: string;
  tenantId: string;
  responsavelId: string;
  responsavel?: UserDto;
  numeroCnj?: string;
  titulo: string;
  descricao?: string;
  status: ProcessoStatus;
  area: AreaDireito;
  vara?: string;
  tribunal?: string;
  comarca?: string;
  instancia?: string;
  valorCausa?: string;
  dataDistribuicao?: string;
  clientes?: ClienteDto[];
  createdAt: string;
  updatedAt: string;
}

export interface MovimentacaoDto {
  id: string;
  processoId: string;
  titulo: string;
  descricao: string;
  dataMovimentacao: string;
  createdAt: string;
}

export interface PrazoDto {
  id: string;
  tenantId: string;
  processoId?: string;
  processo?: { id: string; titulo: string; numeroCnj?: string };
  responsavelId: string;
  responsavel?: UserDto;
  titulo: string;
  descricao?: string;
  tipo: PrazoTipo;
  status: PrazoStatus;
  dataVencimento: string;
  dataConclusao?: string;
  alertas: number[];
  createdAt: string;
  updatedAt: string;
}

export interface LancamentoDto {
  id: string;
  tenantId: string;
  criadorId: string;
  processoId?: string;
  clienteId?: string;
  tipo: LancamentoTipo;
  status: LancamentoStatus;
  descricao: string;
  valor: string;
  dataVencimento: string;
  dataPagamento?: string;
  categoria?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentoDto {
  id: string;
  tenantId: string;
  processoId?: string;
  uploaderId: string;
  nome: string;
  nomeOriginal: string;
  mimeType: string;
  tamanho: number;
  createdAt: string;
}

export interface DashboardKpisDto {
  processosAtivos: number;
  prazosProximos: number;
  receitaMensal: string;
  inadimplencia: string;
  processosPorStatus: Record<ProcessoStatus, number>;
  proximosPrazos: PrazoDto[];
}

export interface AuthTokensDto {
  accessToken: string;
  user: UserDto;
}
