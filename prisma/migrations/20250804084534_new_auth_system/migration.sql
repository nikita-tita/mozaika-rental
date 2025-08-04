/*
  Warnings:

  - The values [ACTIVE] on the enum `ContractStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PROCESSING,COMPLETED,FAILED,REFUNDED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [COMMISSION,REFUND] on the enum `PaymentType` will be removed. If these variants are still used in the database, this will fail.
  - The values [DRAFT] on the enum `PropertyStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [STUDIO,ROOM] on the enum `PropertyType` will be removed. If these variants are still used in the database, this will fail.
  - The values [TENANT,LANDLORD] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `inn` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `middleName` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `passport` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `realtorId` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `snils` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `bookingId` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `clientTenantId` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `deposit` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyRent` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `propertyId` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `terms` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `bookingId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `channels` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `contractId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `propertyId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `sentChannels` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `bookingId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `contractId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `propertyId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `providerData` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `payments` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the column `amenities` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `clientOwnerId` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `deposit` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `floor` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerMonth` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `rooms` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `totalFloors` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `utilities` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the `bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contract_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `digital_signatures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `escrow_accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `multilistings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notification_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `property_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `property_inventories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `realtor_salaries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rental_insurances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tenant_scorings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `yandex_rent_submissions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `clients` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `content` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `price` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Made the column `firstName` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."ClientStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PROSPECT');

-- CreateEnum
CREATE TYPE "public"."DealStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('INFO', 'WARNING', 'ERROR', 'SUCCESS');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ContractStatus_new" AS ENUM ('DRAFT', 'SIGNED', 'EXPIRED', 'TERMINATED');
ALTER TABLE "public"."contracts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."contracts" ALTER COLUMN "status" TYPE "public"."ContractStatus_new" USING ("status"::text::"public"."ContractStatus_new");
ALTER TYPE "public"."ContractStatus" RENAME TO "ContractStatus_old";
ALTER TYPE "public"."ContractStatus_new" RENAME TO "ContractStatus";
DROP TYPE "public"."ContractStatus_old";
ALTER TABLE "public"."contracts" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."PaymentStatus_new" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');
ALTER TABLE "public"."payments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."payments" ALTER COLUMN "status" TYPE "public"."PaymentStatus_new" USING ("status"::text::"public"."PaymentStatus_new");
ALTER TYPE "public"."PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "public"."PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "public"."payments" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."PaymentType_new" AS ENUM ('RENT', 'DEPOSIT', 'UTILITIES', 'MAINTENANCE');
ALTER TABLE "public"."payments" ALTER COLUMN "type" TYPE "public"."PaymentType_new" USING ("type"::text::"public"."PaymentType_new");
ALTER TYPE "public"."PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "public"."PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "public"."PaymentType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."PropertyStatus_new" AS ENUM ('AVAILABLE', 'RENTED', 'SOLD', 'MAINTENANCE');
ALTER TABLE "public"."properties" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."properties" ALTER COLUMN "status" TYPE "public"."PropertyStatus_new" USING ("status"::text::"public"."PropertyStatus_new");
ALTER TYPE "public"."PropertyStatus" RENAME TO "PropertyStatus_old";
ALTER TYPE "public"."PropertyStatus_new" RENAME TO "PropertyStatus";
DROP TYPE "public"."PropertyStatus_old";
ALTER TABLE "public"."properties" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."PropertyType_new" AS ENUM ('APARTMENT', 'HOUSE', 'COMMERCIAL', 'LAND');
ALTER TABLE "public"."properties" ALTER COLUMN "type" TYPE "public"."PropertyType_new" USING ("type"::text::"public"."PropertyType_new");
ALTER TYPE "public"."PropertyType" RENAME TO "PropertyType_old";
ALTER TYPE "public"."PropertyType_new" RENAME TO "PropertyType";
DROP TYPE "public"."PropertyType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserRole_new" AS ENUM ('ADMIN', 'REALTOR', 'CLIENT');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."users" ALTER COLUMN "role" TYPE "public"."UserRole_new" USING ("role"::text::"public"."UserRole_new");
ALTER TYPE "public"."UserRole" RENAME TO "UserRole_old";
ALTER TYPE "public"."UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "public"."users" ALTER COLUMN "role" SET DEFAULT 'REALTOR';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."bookings" DROP CONSTRAINT "bookings_clientTenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."bookings" DROP CONSTRAINT "bookings_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."bookings" DROP CONSTRAINT "bookings_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."clients" DROP CONSTRAINT "clients_realtorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."contracts" DROP CONSTRAINT "contracts_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."contracts" DROP CONSTRAINT "contracts_clientTenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."contracts" DROP CONSTRAINT "contracts_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."contracts" DROP CONSTRAINT "contracts_templateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."contracts" DROP CONSTRAINT "contracts_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."digital_signatures" DROP CONSTRAINT "digital_signatures_contractId_fkey";

-- DropForeignKey
ALTER TABLE "public"."escrow_accounts" DROP CONSTRAINT "escrow_accounts_contractId_fkey";

-- DropForeignKey
ALTER TABLE "public"."escrow_accounts" DROP CONSTRAINT "escrow_accounts_scoringId_fkey";

-- DropForeignKey
ALTER TABLE "public"."multilistings" DROP CONSTRAINT "multilistings_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."multilistings" DROP CONSTRAINT "multilistings_realtorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."notification_settings" DROP CONSTRAINT "notification_settings_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_contractId_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."properties" DROP CONSTRAINT "properties_clientOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."properties" DROP CONSTRAINT "properties_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."property_images" DROP CONSTRAINT "property_images_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."property_inventories" DROP CONSTRAINT "property_inventories_contractId_fkey";

-- DropForeignKey
ALTER TABLE "public"."property_inventories" DROP CONSTRAINT "property_inventories_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."realtor_salaries" DROP CONSTRAINT "realtor_salaries_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."realtor_salaries" DROP CONSTRAINT "realtor_salaries_realtorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."rental_insurances" DROP CONSTRAINT "rental_insurances_contractId_fkey";

-- DropForeignKey
ALTER TABLE "public"."rental_insurances" DROP CONSTRAINT "rental_insurances_scoringId_fkey";

-- DropForeignKey
ALTER TABLE "public"."reviews" DROP CONSTRAINT "reviews_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."reviews" DROP CONSTRAINT "reviews_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."reviews" DROP CONSTRAINT "reviews_targetUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tenant_scorings" DROP CONSTRAINT "tenant_scorings_contractId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tenant_scorings" DROP CONSTRAINT "tenant_scorings_realtorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."yandex_rent_submissions" DROP CONSTRAINT "yandex_rent_submissions_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."yandex_rent_submissions" DROP CONSTRAINT "yandex_rent_submissions_realtorId_fkey";

-- DropIndex
DROP INDEX "public"."contracts_bookingId_key";

-- DropIndex
DROP INDEX "public"."notifications_scheduledAt_idx";

-- DropIndex
DROP INDEX "public"."notifications_userId_read_idx";

-- AlterTable
ALTER TABLE "public"."clients" DROP COLUMN "address",
DROP COLUMN "birthDate",
DROP COLUMN "city",
DROP COLUMN "inn",
DROP COLUMN "isActive",
DROP COLUMN "middleName",
DROP COLUMN "passport",
DROP COLUMN "realtorId",
DROP COLUMN "snils",
DROP COLUMN "source",
DROP COLUMN "type",
ADD COLUMN     "status" "public"."ClientStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."contracts" DROP COLUMN "bookingId",
DROP COLUMN "clientTenantId",
DROP COLUMN "deposit",
DROP COLUMN "endDate",
DROP COLUMN "monthlyRent",
DROP COLUMN "propertyId",
DROP COLUMN "startDate",
DROP COLUMN "templateId",
DROP COLUMN "tenantId",
DROP COLUMN "terms",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "dealId" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."notifications" DROP COLUMN "bookingId",
DROP COLUMN "channels",
DROP COLUMN "contractId",
DROP COLUMN "data",
DROP COLUMN "expiresAt",
DROP COLUMN "paymentId",
DROP COLUMN "priority",
DROP COLUMN "propertyId",
DROP COLUMN "readAt",
DROP COLUMN "scheduledAt",
DROP COLUMN "sentChannels",
DROP COLUMN "type",
ADD COLUMN     "type" "public"."NotificationType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."payments" DROP COLUMN "bookingId",
DROP COLUMN "contractId",
DROP COLUMN "currency",
DROP COLUMN "description",
DROP COLUMN "metadata",
DROP COLUMN "propertyId",
DROP COLUMN "provider",
DROP COLUMN "providerData",
DROP COLUMN "providerId",
ADD COLUMN     "dealId" TEXT,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."properties" DROP COLUMN "amenities",
DROP COLUMN "city",
DROP COLUMN "clientOwnerId",
DROP COLUMN "deposit",
DROP COLUMN "district",
DROP COLUMN "floor",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "ownerId",
DROP COLUMN "pricePerMonth",
DROP COLUMN "rooms",
DROP COLUMN "totalFloors",
DROP COLUMN "utilities",
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'AVAILABLE',
ALTER COLUMN "area" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;

-- DropTable
DROP TABLE "public"."bookings";

-- DropTable
DROP TABLE "public"."contract_templates";

-- DropTable
DROP TABLE "public"."digital_signatures";

-- DropTable
DROP TABLE "public"."escrow_accounts";

-- DropTable
DROP TABLE "public"."multilistings";

-- DropTable
DROP TABLE "public"."notification_settings";

-- DropTable
DROP TABLE "public"."property_images";

-- DropTable
DROP TABLE "public"."property_inventories";

-- DropTable
DROP TABLE "public"."realtor_salaries";

-- DropTable
DROP TABLE "public"."rental_insurances";

-- DropTable
DROP TABLE "public"."reviews";

-- DropTable
DROP TABLE "public"."tenant_scorings";

-- DropTable
DROP TABLE "public"."yandex_rent_submissions";

-- DropEnum
DROP TYPE "public"."BookingStatus";

-- DropEnum
DROP TYPE "public"."ClientType";

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."deals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."DealStatus" NOT NULL DEFAULT 'NEW',
    "amount" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "clientId" TEXT,
    "propertyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "public"."sessions"("token");

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."properties" ADD CONSTRAINT "properties_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clients" ADD CONSTRAINT "clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deals" ADD CONSTRAINT "deals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deals" ADD CONSTRAINT "deals_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deals" ADD CONSTRAINT "deals_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
