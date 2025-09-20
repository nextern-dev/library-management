/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the `Borrows` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `authorId` on table `Book` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Book" DROP CONSTRAINT "Book_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Book" DROP CONSTRAINT "Book_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Borrows" DROP CONSTRAINT "Borrows_bookId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Borrows" DROP CONSTRAINT "Borrows_userId_fkey";

-- DropIndex
DROP INDEX "public"."Book_isbn_key";

-- AlterTable
ALTER TABLE "public"."Book" DROP COLUMN "updatedAt",
ALTER COLUMN "authorId" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "cover" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."Borrows";

-- AddForeignKey
ALTER TABLE "public"."Book" ADD CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Book" ADD CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
