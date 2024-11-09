/*
  Warnings:

  - Added the required column `durationMs` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "durationMs" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Track" ALTER COLUMN "durationMs" DROP DEFAULT;
