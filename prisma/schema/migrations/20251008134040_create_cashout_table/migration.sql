-- CreateEnum
CREATE TYPE "CashoutStatus" AS ENUM ('PENDING', 'RESOLVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CashoutProvider" AS ENUM ('INSTAPAY', 'WALLET');

-- CreateTable
CREATE TABLE "CashoutRequest" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "notes" TEXT,
    "status" "CashoutStatus" NOT NULL DEFAULT 'PENDING',
    "provider" "CashoutProvider" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashoutRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CashoutRequest" ADD CONSTRAINT "CashoutRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
