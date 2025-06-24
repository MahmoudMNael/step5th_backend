-- AlterTable
ALTER TABLE "User" ADD COLUMN     "referrer_id" TEXT,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
