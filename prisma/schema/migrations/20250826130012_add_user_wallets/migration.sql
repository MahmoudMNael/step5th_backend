-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'added';

-- CreateTable
CREATE TABLE "UserWallet" (
    "user_id" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWallet_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "UserWallet" ADD CONSTRAINT "UserWallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
