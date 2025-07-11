-- CreateTable
CREATE TABLE "Pagamento" (
    "id" SERIAL PRIMARY KEY,
    "valor" DECIMAL(10,2) NOT NULL,
    "moeda" TEXT NOT NULL DEFAULT 'BRL',
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "stripePaymentIntentId" TEXT UNIQUE,
    "stripeChargeId" TEXT,
    "idMetodoPagamento" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "descricao" TEXT,
    "erro" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "PagamentoEvento" (
    "id" SERIAL PRIMARY KEY,
    "pagamentoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "conteudoJson" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("pagamentoId") REFERENCES "Pagamento"("id") ON DELETE CASCADE
);

-- CreateTable
CREATE TABLE "Reembolso" (
    "id" SERIAL PRIMARY KEY,
    "pagamentoId" INTEGER NOT NULL UNIQUE,
    "valor" DECIMAL(10,2) NOT NULL,
    "stripeRefundId" TEXT NOT NULL,
    "motivo" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("pagamentoId") REFERENCES "Pagamento"("id") ON DELETE CASCADE
); 