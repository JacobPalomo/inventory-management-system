-- AlterTable
ALTER TABLE "Refund" ADD COLUMN "method" "PaymentMethod";
ALTER TABLE "Refund" ADD COLUMN "reference" TEXT;
ALTER TABLE "Refund" ADD COLUMN "sessionId" TEXT;

UPDATE "Refund" SET "method" = 'OTHER' WHERE "method" IS NULL;

ALTER TABLE "Refund" ALTER COLUMN "method" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "CashSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
