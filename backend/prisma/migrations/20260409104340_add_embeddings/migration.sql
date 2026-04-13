-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "embedding" vector;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "embedding" vector;
