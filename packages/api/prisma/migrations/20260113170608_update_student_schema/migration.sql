/*
  Warnings:

  - You are about to drop the column `parentEmail` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `parentPhone` on the `students` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nik]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "students" DROP COLUMN "parentEmail",
DROP COLUMN "parentPhone",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "district" TEXT,
ADD COLUMN     "fatherEducation" TEXT,
ADD COLUMN     "fatherNik" TEXT,
ADD COLUMN     "fatherPhone" TEXT,
ADD COLUMN     "guardianEducation" TEXT,
ADD COLUMN     "guardianJob" TEXT,
ADD COLUMN     "guardianNik" TEXT,
ADD COLUMN     "guardianRelation" TEXT,
ADD COLUMN     "motherEducation" TEXT,
ADD COLUMN     "motherNik" TEXT,
ADD COLUMN     "motherPhone" TEXT,
ADD COLUMN     "nik" TEXT,
ADD COLUMN     "parentAddress" TEXT,
ADD COLUMN     "parentCity" TEXT,
ADD COLUMN     "parentProvince" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "previousSchool" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "rt" TEXT,
ADD COLUMN     "rw" TEXT,
ADD COLUMN     "village" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "students_nik_key" ON "students"("nik");
