/*
  Warnings:

  - The primary key for the `Pagamento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PagamentoEvento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Reembolso` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "PagamentoEvento" DROP CONSTRAINT "PagamentoEvento_pagamentoId_fkey";

-- DropForeignKey
ALTER TABLE "Reembolso" DROP CONSTRAINT "Reembolso_pagamentoId_fkey";

-- AlterTable
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Pagamento_id_seq";

-- AlterTable
ALTER TABLE "PagamentoEvento" DROP CONSTRAINT "PagamentoEvento_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "pagamentoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "PagamentoEvento_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PagamentoEvento_id_seq";

-- AlterTable
ALTER TABLE "Reembolso" DROP CONSTRAINT "Reembolso_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "pagamentoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Reembolso_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Reembolso_id_seq";

-- AddForeignKey
ALTER TABLE "PagamentoEvento" ADD CONSTRAINT "PagamentoEvento_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "Pagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reembolso" ADD CONSTRAINT "Reembolso_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "Pagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
