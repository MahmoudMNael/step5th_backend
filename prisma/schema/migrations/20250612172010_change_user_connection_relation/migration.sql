/*
  Warnings:

  - You are about to drop the column `referrer_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_referrer_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "referrer_id",
ADD COLUMN     "parent_connection_id" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parent_connection_id_fkey" FOREIGN KEY ("parent_connection_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
