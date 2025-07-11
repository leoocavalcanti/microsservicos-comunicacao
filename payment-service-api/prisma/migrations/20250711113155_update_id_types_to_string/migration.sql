-- DropForeignKey
ALTER TABLE "PagamentoEvento" DROP CONSTRAINT "PagamentoEvento_pagamentoId_fkey";

-- DropForeignKey
ALTER TABLE "Reembolso" DROP CONSTRAINT "Reembolso_pagamentoId_fkey";

-- AlterTable
ALTER TABLE "Pagamento" ALTER COLUMN "idMetodoPagamento" SET DATA TYPE TEXT,
ALTER COLUMN "idUsuario" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "PagamentoEvento" ADD CONSTRAINT "PagamentoEvento_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "Pagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reembolso" ADD CONSTRAINT "Reembolso_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "Pagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
