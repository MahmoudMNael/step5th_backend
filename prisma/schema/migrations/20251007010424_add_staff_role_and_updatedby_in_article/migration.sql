-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'STAFF';

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "updated_by_id" TEXT;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
