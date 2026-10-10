-- CreateEnum
CREATE TYPE "StructureCategory" AS ENUM ('LEADERSHIP', 'DEPARTMENT', 'COMMITTEE');

-- DropForeignKey
ALTER TABLE "org_members" DROP CONSTRAINT IF EXISTS "org_members_studentId_fkey";

-- AlterTable
ALTER TABLE "org_members" ADD COLUMN IF NOT EXISTS "className" TEXT,
ADD COLUMN IF NOT EXISTS "name" TEXT,
ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "photo" TEXT,
ADD COLUMN IF NOT EXISTS "section" TEXT,
ALTER COLUMN "studentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "student_organizations" ADD COLUMN IF NOT EXISTS "mission" TEXT[],
ADD COLUMN IF NOT EXISTS "programs" JSONB,
ADD COLUMN IF NOT EXISTS "vision" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "school_structures" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "category" "StructureCategory" NOT NULL DEFAULT 'LEADERSHIP',
    "department" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "photo" TEXT,
    "greeting" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "teacherId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_structures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'school_structures_schoolId_fkey'
    ) THEN
        ALTER TABLE "school_structures" ADD CONSTRAINT "school_structures_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'school_structures_teacherId_fkey'
    ) THEN
        ALTER TABLE "school_structures" ADD CONSTRAINT "school_structures_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'org_members_studentId_fkey'
    ) THEN
        ALTER TABLE "org_members" ADD CONSTRAINT "org_members_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
