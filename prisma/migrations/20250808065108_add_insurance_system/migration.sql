/*
  Warnings:

  - A unique constraint covering the columns `[invoiceNumber]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."PropertyLinkType" AS ENUM ('OWNER', 'TENANT', 'INTERESTED');

-- CreateEnum
CREATE TYPE "public"."YandexLeadStatus" AS ENUM ('SUBMITTED', 'CALLED_OWNER', 'PHOTO_SCHEDULED', 'PUBLISHED', 'FIRST_SHOWING', 'CONTRACT_SIGNED', 'OCCUPIED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."InsuranceType" AS ENUM ('PROPERTY', 'LIABILITY', 'RENTAL_INCOME', 'LEGAL_PROTECTION', 'COMPREHENSIVE');

-- CreateEnum
CREATE TYPE "public"."InsuranceStatus" AS ENUM ('DRAFT', 'PENDING_PAYMENT', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ClaimStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID');

-- CreateEnum
CREATE TYPE "public"."SignatureStatus" AS ENUM ('pending', 'signed', 'expired', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."SignerStatus" AS ENUM ('pending', 'sent', 'signed', 'declined', 'expired');

-- CreateEnum
CREATE TYPE "public"."SignerRole" AS ENUM ('landlord', 'tenant', 'realtor', 'witness');

-- CreateEnum
CREATE TYPE "public"."SignatureMethod" AS ENUM ('sms', 'email', 'gosuslugi', 'biometric');

-- AlterEnum
ALTER TYPE "public"."DealStatus" ADD VALUE 'DRAFT';

-- AlterTable
ALTER TABLE "public"."deals" ADD COLUMN     "commission" DOUBLE PRECISION,
ADD COLUMN     "deposit" DOUBLE PRECISION,
ADD COLUMN     "landlordId" TEXT,
ADD COLUMN     "monthlyRent" DOUBLE PRECISION,
ADD COLUMN     "tenantId" TEXT,
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "public"."notifications" ADD COLUMN     "policyId" TEXT;

-- AlterTable
ALTER TABLE "public"."payments" ADD COLUMN     "contractId" TEXT,
ADD COLUMN     "depositAmount" DOUBLE PRECISION,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "invoiceNumber" TEXT,
ADD COLUMN     "invoicePdf" TEXT,
ADD COLUMN     "invoiceSentAt" TIMESTAMP(3),
ADD COLUMN     "lastReminderType" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "penaltyAmount" DOUBLE PRECISION,
ADD COLUMN     "propertyId" TEXT,
ADD COLUMN     "reminderCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reminderSentAt" TIMESTAMP(3),
ADD COLUMN     "rentAmount" DOUBLE PRECISION,
ADD COLUMN     "utilitiesAmount" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "public"."client_property_links" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "linkType" "public"."PropertyLinkType" NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "client_property_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."yandex_rental_leads" (
    "id" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "comment" TEXT,
    "rentAmount" DOUBLE PRECISION,
    "rentPeriod" INTEGER NOT NULL DEFAULT 11,
    "commission" DOUBLE PRECISION,
    "status" "public"."YandexLeadStatus" NOT NULL DEFAULT 'SUBMITTED',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "yandex_rental_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."yandex_lead_status_history" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "status" "public"."YandexLeadStatus" NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "yandex_lead_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."insurance_policies" (
    "id" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "type" "public"."InsuranceType" NOT NULL,
    "status" "public"."InsuranceStatus" NOT NULL DEFAULT 'DRAFT',
    "insuredAmount" DOUBLE PRECISION NOT NULL,
    "deductible" DOUBLE PRECISION NOT NULL,
    "premium" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "insuranceCompany" TEXT NOT NULL,
    "propertyId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurance_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."insurance_payments" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "public"."PaymentType" NOT NULL,
    "transactionId" TEXT,
    "paidAt" TIMESTAMP(3),
    "policyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurance_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."insurance_claims" (
    "id" TEXT NOT NULL,
    "claimNumber" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "public"."ClaimStatus" NOT NULL DEFAULT 'SUBMITTED',
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "policyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurance_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."digital_signatures" (
    "id" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentId" TEXT,
    "documentUrl" TEXT NOT NULL,
    "status" "public"."SignatureStatus" NOT NULL DEFAULT 'pending',
    "signedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "signatureData" JSONB,
    "contractId" TEXT,
    "userId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "digital_signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."signature_signers" (
    "id" TEXT NOT NULL,
    "signatureId" TEXT NOT NULL,
    "clientId" TEXT,
    "role" "public"."SignerRole" NOT NULL,
    "status" "public"."SignerStatus" NOT NULL DEFAULT 'pending',
    "email" TEXT,
    "phone" TEXT,
    "signedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "signatureMethod" "public"."SignatureMethod",
    "signatureData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "signature_signers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_property_links_clientId_propertyId_linkType_key" ON "public"."client_property_links"("clientId", "propertyId", "linkType");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_policies_policyNumber_key" ON "public"."insurance_policies"("policyNumber");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_claims_claimNumber_key" ON "public"."insurance_claims"("claimNumber");

-- CreateIndex
CREATE UNIQUE INDEX "payments_invoiceNumber_key" ON "public"."payments"("invoiceNumber");

-- AddForeignKey
ALTER TABLE "public"."client_property_links" ADD CONSTRAINT "client_property_links_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."client_property_links" ADD CONSTRAINT "client_property_links_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."client_property_links" ADD CONSTRAINT "client_property_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deals" ADD CONSTRAINT "deals_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deals" ADD CONSTRAINT "deals_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "public"."clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "public"."deals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "public"."deals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "public"."insurance_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."yandex_rental_leads" ADD CONSTRAINT "yandex_rental_leads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."yandex_lead_status_history" ADD CONSTRAINT "yandex_lead_status_history_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."yandex_rental_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."insurance_policies" ADD CONSTRAINT "insurance_policies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."insurance_policies" ADD CONSTRAINT "insurance_policies_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."insurance_payments" ADD CONSTRAINT "insurance_payments_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "public"."insurance_policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."insurance_claims" ADD CONSTRAINT "insurance_claims_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "public"."insurance_policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."digital_signatures" ADD CONSTRAINT "digital_signatures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."digital_signatures" ADD CONSTRAINT "digital_signatures_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."signature_signers" ADD CONSTRAINT "signature_signers_signatureId_fkey" FOREIGN KEY ("signatureId") REFERENCES "public"."digital_signatures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."signature_signers" ADD CONSTRAINT "signature_signers_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
