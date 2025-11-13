-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_order_id_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "order_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
