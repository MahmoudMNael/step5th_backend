-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'deducted';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
