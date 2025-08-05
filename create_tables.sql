-- Создание таблицы users
CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "phone" TEXT,
  "role" TEXT NOT NULL DEFAULT 'REALTOR',
  "avatar" TEXT,
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Создание уникального индекса для email
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- Создание таблицы sessions
CREATE TABLE IF NOT EXISTS "sessions" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "userAgent" TEXT,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- Создание уникального индекса для token
CREATE UNIQUE INDEX IF NOT EXISTS "sessions_token_key" ON "sessions"("token");

-- Создание таблицы properties
CREATE TABLE IF NOT EXISTS "properties" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
  "address" TEXT NOT NULL,
  "area" DOUBLE PRECISION,
  "bedrooms" INTEGER,
  "bathrooms" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "features" TEXT[],
  "images" TEXT[],
  "price" DOUBLE PRECISION NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- Создание таблицы clients
CREATE TABLE IF NOT EXISTS "clients" (
  "id" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL,
  "address" TEXT,
  "birthDate" TIMESTAMP(3),
  "city" TEXT,
  "inn" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "middleName" TEXT,
  "passport" TEXT,
  "snils" TEXT,
  "source" TEXT,
  "type" TEXT NOT NULL DEFAULT 'TENANT',
  CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- Создание таблицы deals
CREATE TABLE IF NOT EXISTS "deals" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'NEW',
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

-- Создание таблицы contracts
CREATE TABLE IF NOT EXISTS "contracts" (
  "id" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "signedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "content" TEXT NOT NULL,
  "dealId" TEXT,
  "expiresAt" TIMESTAMP(3),
  "title" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- Создание таблицы payments
CREATE TABLE IF NOT EXISTS "payments" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "amount" DOUBLE PRECISION NOT NULL,
  "userId" TEXT NOT NULL,
  "dueDate" TIMESTAMP(3),
  "paidAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "dealId" TEXT,
  CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- Создание таблицы notifications
CREATE TABLE IF NOT EXISTS "notifications" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "type" TEXT NOT NULL,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
); 