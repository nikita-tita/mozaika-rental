/*
  Warnings:

  - You are about to drop the column `status` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ClientType" AS ENUM ('TENANT', 'LANDLORD', 'BOTH');

-- Update existing clients with NULL phone to have a default value
UPDATE "public"."clients" SET "phone" = 'Не указан' WHERE "phone" IS NULL;

-- AlterTable
ALTER TABLE "public"."clients" DROP COLUMN "status",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "city" TEXT,
ADD COLUMN     "inn" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "passport" TEXT,
ADD COLUMN     "snils" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "type" "public"."ClientType" NOT NULL DEFAULT 'TENANT',
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."sessions" DROP COLUMN "active";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "active",
DROP COLUMN "lastLogin";
