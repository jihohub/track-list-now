/*
  Warnings:

  - You are about to drop the column `albumImageUrl` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `albumImageUrl` on the `Track` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" DROP COLUMN "albumImageUrl",
ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "albumImageUrl",
ADD COLUMN     "imageUrl" TEXT NOT NULL;
