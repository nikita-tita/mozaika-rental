-- CreateEnum
CREATE TYPE "public"."ReminderType" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "public"."ReminderStatus" AS ENUM ('SCHEDULED', 'SENT', 'FAILED');

-- AlterTable
ALTER TABLE "public"."payments" ADD COLUMN     "paymentLink" TEXT,
ADD COLUMN     "paymentLinkGeneratedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."payment_reminders" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "type" "public"."ReminderType" NOT NULL,
    "message" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "status" "public"."ReminderStatus" NOT NULL DEFAULT 'SCHEDULED',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_reminders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."payment_reminders" ADD CONSTRAINT "payment_reminders_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment_reminders" ADD CONSTRAINT "payment_reminders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
