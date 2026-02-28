-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SOCIO', 'ASSOCIADO', 'ESTAGIARIO', 'SECRETARIA', 'FINANCEIRO');

-- CreateEnum
CREATE TYPE "ProcessoStatus" AS ENUM ('ATIVO', 'SUSPENSO', 'ARQUIVADO', 'GANHO', 'PERDIDO');

-- CreateEnum
CREATE TYPE "AreaDireito" AS ENUM ('CIVEL', 'TRABALHISTA', 'CRIMINAL', 'TRIBUTARIO', 'FAMILIA', 'PREVIDENCIARIO', 'EMPRESARIAL', 'AMBIENTAL', 'CONSUMIDOR', 'ADMINISTRATIVO', 'IMOBILIARIO', 'OUTRO');

-- CreateEnum
CREATE TYPE "ClienteStatus" AS ENUM ('ATIVO', 'INATIVO', 'LEAD', 'PROSPECTO');

-- CreateEnum
CREATE TYPE "ClienteTipo" AS ENUM ('PF', 'PJ');

-- CreateEnum
CREATE TYPE "LancamentoTipo" AS ENUM ('RECEITA', 'DESPESA');

-- CreateEnum
CREATE TYPE "LancamentoStatus" AS ENUM ('PENDENTE', 'PAGO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "PrazoTipo" AS ENUM ('FATAL', 'NORMAL', 'AUDIENCIA', 'PERICIA', 'REUNIAO', 'TAREFA');

-- CreateEnum
CREATE TYPE "PrazoStatus" AS ENUM ('PENDENTE', 'CONCLUIDO', 'PERDIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "NotificacaoStatus" AS ENUM ('PENDENTE', 'ENVIADO', 'FALHOU');

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "plano" TEXT NOT NULL DEFAULT 'starter',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ASSOCIADO',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "totpSecret" TEXT,
    "totpEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revogado" BOOLEAN NOT NULL DEFAULT false,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tipo" "ClienteTipo" NOT NULL,
    "status" "ClienteStatus" NOT NULL DEFAULT 'ATIVO',
    "nome" TEXT NOT NULL,
    "cpfCnpj" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "celular" TEXT,
    "endereco" JSONB,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processos" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "responsavelId" TEXT NOT NULL,
    "numeroCnj" TEXT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "status" "ProcessoStatus" NOT NULL DEFAULT 'ATIVO',
    "area" "AreaDireito" NOT NULL,
    "vara" TEXT,
    "tribunal" TEXT,
    "comarca" TEXT,
    "instancia" TEXT,
    "valorCausa" DECIMAL(15,2),
    "dataDistribuicao" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "processos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processo_clientes" (
    "processoId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "papel" TEXT NOT NULL DEFAULT 'AUTOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processo_clientes_pkey" PRIMARY KEY ("processoId","clienteId")
);

-- CreateTable
CREATE TABLE "movimentacoes" (
    "id" TEXT NOT NULL,
    "processoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataMovimentacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimentacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prazos" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "processoId" TEXT,
    "responsavelId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "PrazoTipo" NOT NULL DEFAULT 'NORMAL',
    "status" "PrazoStatus" NOT NULL DEFAULT 'PENDENTE',
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataConclusao" TIMESTAMP(3),
    "alertas" INTEGER[] DEFAULT ARRAY[1, 3, 7, 15]::INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prazos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prazo_notificacoes" (
    "id" TEXT NOT NULL,
    "prazoId" TEXT NOT NULL,
    "diasAntes" INTEGER NOT NULL,
    "canal" TEXT NOT NULL DEFAULT 'email',
    "status" "NotificacaoStatus" NOT NULL DEFAULT 'PENDENTE',
    "enviadoEm" TIMESTAMP(3),
    "erro" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prazo_notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lancamentos" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "criadorId" TEXT NOT NULL,
    "processoId" TEXT,
    "clienteId" TEXT,
    "tipo" "LancamentoTipo" NOT NULL,
    "status" "LancamentoStatus" NOT NULL DEFAULT 'PENDENTE',
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(15,2) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "categoria" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lancamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "processoId" TEXT,
    "uploaderId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nomeOriginal" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "caminho" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidadeId" TEXT,
    "dadosAntes" JSONB,
    "dadosDepois" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_cnpj_key" ON "tenants"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_email_key" ON "tenants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_tenantId_email_key" ON "users"("tenantId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "clientes_tenantId_idx" ON "clientes"("tenantId");

-- CreateIndex
CREATE INDEX "processos_tenantId_idx" ON "processos"("tenantId");

-- CreateIndex
CREATE INDEX "processos_tenantId_status_idx" ON "processos"("tenantId", "status");

-- CreateIndex
CREATE INDEX "processos_numeroCnj_idx" ON "processos"("numeroCnj");

-- CreateIndex
CREATE INDEX "movimentacoes_processoId_idx" ON "movimentacoes"("processoId");

-- CreateIndex
CREATE INDEX "prazos_tenantId_idx" ON "prazos"("tenantId");

-- CreateIndex
CREATE INDEX "prazos_tenantId_status_idx" ON "prazos"("tenantId", "status");

-- CreateIndex
CREATE INDEX "prazos_dataVencimento_idx" ON "prazos"("dataVencimento");

-- CreateIndex
CREATE UNIQUE INDEX "prazo_notificacoes_prazoId_diasAntes_canal_key" ON "prazo_notificacoes"("prazoId", "diasAntes", "canal");

-- CreateIndex
CREATE INDEX "lancamentos_tenantId_idx" ON "lancamentos"("tenantId");

-- CreateIndex
CREATE INDEX "lancamentos_tenantId_tipo_status_idx" ON "lancamentos"("tenantId", "tipo", "status");

-- CreateIndex
CREATE INDEX "documentos_tenantId_idx" ON "documentos"("tenantId");

-- CreateIndex
CREATE INDEX "documentos_processoId_idx" ON "documentos"("processoId");

-- CreateIndex
CREATE INDEX "audit_logs_tenantId_idx" ON "audit_logs"("tenantId");

-- CreateIndex
CREATE INDEX "audit_logs_tenantId_entidade_idx" ON "audit_logs"("tenantId", "entidade");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos" ADD CONSTRAINT "processos_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos" ADD CONSTRAINT "processos_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processo_clientes" ADD CONSTRAINT "processo_clientes_processoId_fkey" FOREIGN KEY ("processoId") REFERENCES "processos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processo_clientes" ADD CONSTRAINT "processo_clientes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_processoId_fkey" FOREIGN KEY ("processoId") REFERENCES "processos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prazos" ADD CONSTRAINT "prazos_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prazos" ADD CONSTRAINT "prazos_processoId_fkey" FOREIGN KEY ("processoId") REFERENCES "processos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prazos" ADD CONSTRAINT "prazos_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prazo_notificacoes" ADD CONSTRAINT "prazo_notificacoes_prazoId_fkey" FOREIGN KEY ("prazoId") REFERENCES "prazos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_criadorId_fkey" FOREIGN KEY ("criadorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_processoId_fkey" FOREIGN KEY ("processoId") REFERENCES "processos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_processoId_fkey" FOREIGN KEY ("processoId") REFERENCES "processos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
