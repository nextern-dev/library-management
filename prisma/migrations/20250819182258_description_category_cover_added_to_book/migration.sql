/*
  Warnings:

  - Added the required column `category` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cover` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Book" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "cover" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;
