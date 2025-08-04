-- CreateEnum
CREATE TYPE "public"."ClientType" AS ENUM ('TENANT', 'LANDLORD', 'BOTH');

-- AlterTable
ALTER TABLE "public"."bookings" ADD COLUMN     "clientTenantId" TEXT;

-- AlterTable
ALTER TABLE "public"."contracts" ADD COLUMN     "clientTenantId" TEXT;

-- AlterTable
ALTER TABLE "public"."properties" ADD COLUMN     "clientOwnerId" TEXT;

-- CreateTable
CREATE TABLE "public"."clients" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "type" "public"."ClientType" NOT NULL DEFAULT 'TENANT',
    "passport" TEXT,
    "snils" TEXT,
    "inn" TEXT,
    "address" TEXT,
    "city" TEXT,
    "notes" TEXT,
    "source" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "realtorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."clients" ADD CONSTRAINT "clients_realtorId_fkey" FOREIGN KEY ("realtorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."properties" ADD CONSTRAINT "properties_clientOwnerId_fkey" FOREIGN KEY ("clientOwnerId") REFERENCES "public"."clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "public"."clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "public"."clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
