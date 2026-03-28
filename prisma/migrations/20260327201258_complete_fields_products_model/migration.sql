/*
  Warnings:

  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "allowNegative" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "avgCost" DOUBLE PRECISION,
ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "cost" DOUBLE PRECISION,
ADD COLUMN     "maxStock" DOUBLE PRECISION,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "reservedStock" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "trackStock" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "stock" SET DEFAULT 0,
ALTER COLUMN "stock" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "minStock" SET DEFAULT 0,
ALTER COLUMN "minStock" SET DATA TYPE DOUBLE PRECISION;
