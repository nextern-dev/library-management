/*
  Warnings:

  - You are about to drop the column `category_en` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `category_fa` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `description_en` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `description_fa` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `title_en` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `title_fa` on the `Book` table. All the data in the column will be lost.
  - Added the required column `title` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Book" DROP COLUMN "category_en",
DROP COLUMN "category_fa",
DROP COLUMN "description_en",
DROP COLUMN "description_fa",
DROP COLUMN "title_en",
DROP COLUMN "title_fa",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
