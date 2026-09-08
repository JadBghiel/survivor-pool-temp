-- CreateEnum
CREATE TYPE "LocationPrecision" AS ENUM ('EXACT', 'MUNICIPALITY');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "locationPrecision" "LocationPrecision" NOT NULL DEFAULT 'MUNICIPALITY';
