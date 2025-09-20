/*
  Warnings:

  - You are about to drop the column `category` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Book" DROP COLUMN "category",
DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "category_en" TEXT DEFAULT '',
ADD COLUMN     "category_fa" TEXT DEFAULT '',
ADD COLUMN     "description_en" TEXT DEFAULT '',
ADD COLUMN     "description_fa" TEXT DEFAULT '',
ADD COLUMN     "title_en" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title_fa" TEXT NOT NULL DEFAULT '';
