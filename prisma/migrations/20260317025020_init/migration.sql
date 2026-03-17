-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('VIEWING', 'INSPECTION', 'MAINTENANCE', 'MEETING');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'STARTER', 'PROFESSIONAL', 'BUSINESS', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ScreeningStatus" AS ENUM ('SCREENING_PENDING', 'IN_PROGRESS', 'SCREENING_COMPLETED', 'SCREENING_FAILED');

-- CreateEnum
CREATE TYPE "MaintenanceSystemType" AS ENUM ('HVAC', 'PLUMBING', 'ELECTRICAL', 'ROOFING', 'APPLIANCE', 'STRUCTURAL');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "WorkflowTriggerType" AS ENUM ('MANUAL', 'NEW_TENANT', 'LEASE_EXPIRY', 'MAINTENANCE_REQUEST', 'PAYMENT_RECEIVED', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "WorkflowExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "ScreeningRequest" (
    "id" TEXT NOT NULL,
    "tenantName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "status" "ScreeningStatus" NOT NULL DEFAULT 'SCREENING_PENDING',
    "creditScore" INTEGER,
    "backgroundCheck" BOOLEAN,
    "evictionHistory" BOOLEAN,
    "employmentVerification" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScreeningRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceRecord" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "systemType" "MaintenanceSystemType" NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "nextPredictedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaintenanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenancePrediction" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "systemType" "MaintenanceSystemType" NOT NULL,
    "predictedFailureDate" TIMESTAMP(3) NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaintenancePrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL DEFAULT 'EXPENSE',
    "category" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialReport" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "netIncome" DECIMAL(10,2) NOT NULL,
    "grossIncome" DECIMAL(10,2) NOT NULL,
    "expenses" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinancialReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "triggerType" "WorkflowTriggerType" NOT NULL,
    "steps" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowExecution" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "status" "WorkflowExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "log" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
    "trial_start_date" TIMESTAMP(3),
    "trial_end_date" TIMESTAMP(3),
    "current_period_start" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "tenantId" TEXT,
    "type" "BookingType" NOT NULL DEFAULT 'VIEWING',
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFeatureUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "lastUsed" TIMESTAMP(3),
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFeatureUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipDismissal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tipId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TipDismissal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScreeningRequest_propertyId_idx" ON "ScreeningRequest"("propertyId");

-- CreateIndex
CREATE INDEX "ScreeningRequest_status_idx" ON "ScreeningRequest"("status");

-- CreateIndex
CREATE INDEX "ScreeningRequest_email_idx" ON "ScreeningRequest"("email");

-- CreateIndex
CREATE INDEX "ScreeningRequest_createdAt_idx" ON "ScreeningRequest"("createdAt");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_propertyId_idx" ON "MaintenanceRecord"("propertyId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_systemType_idx" ON "MaintenanceRecord"("systemType");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_completedAt_idx" ON "MaintenanceRecord"("completedAt");

-- CreateIndex
CREATE INDEX "MaintenancePrediction_propertyId_idx" ON "MaintenancePrediction"("propertyId");

-- CreateIndex
CREATE INDEX "MaintenancePrediction_systemType_idx" ON "MaintenancePrediction"("systemType");

-- CreateIndex
CREATE INDEX "MaintenancePrediction_predictedFailureDate_idx" ON "MaintenancePrediction"("predictedFailureDate");

-- CreateIndex
CREATE INDEX "Transaction_propertyId_idx" ON "Transaction"("propertyId");

-- CreateIndex
CREATE INDEX "FinancialReport_propertyId_idx" ON "FinancialReport"("propertyId");

-- CreateIndex
CREATE INDEX "Workflow_userId_idx" ON "Workflow"("userId");

-- CreateIndex
CREATE INDEX "Workflow_triggerType_idx" ON "Workflow"("triggerType");

-- CreateIndex
CREATE INDEX "Workflow_isActive_idx" ON "Workflow"("isActive");

-- CreateIndex
CREATE INDEX "WorkflowExecution_workflowId_idx" ON "WorkflowExecution"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowExecution_status_idx" ON "WorkflowExecution"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_stripe_customer_id_idx" ON "Subscription"("stripe_customer_id");

-- CreateIndex
CREATE INDEX "Subscription_stripe_subscription_id_idx" ON "Subscription"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Booking_propertyId_idx" ON "Booking"("propertyId");

-- CreateIndex
CREATE INDEX "Booking_tenantId_idx" ON "Booking"("tenantId");

-- CreateIndex
CREATE INDEX "Booking_startTime_idx" ON "Booking"("startTime");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Availability_propertyId_idx" ON "Availability"("propertyId");

-- CreateIndex
CREATE INDEX "Availability_userId_idx" ON "Availability"("userId");

-- CreateIndex
CREATE INDEX "Availability_dayOfWeek_idx" ON "Availability"("dayOfWeek");

-- CreateIndex
CREATE INDEX "UserFeatureUsage_userId_idx" ON "UserFeatureUsage"("userId");

-- CreateIndex
CREATE INDEX "UserFeatureUsage_feature_idx" ON "UserFeatureUsage"("feature");

-- CreateIndex
CREATE UNIQUE INDEX "UserFeatureUsage_userId_feature_key" ON "UserFeatureUsage"("userId", "feature");

-- CreateIndex
CREATE INDEX "TipDismissal_userId_idx" ON "TipDismissal"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TipDismissal_userId_tipId_key" ON "TipDismissal"("userId", "tipId");

-- AddForeignKey
ALTER TABLE "ScreeningRequest" ADD CONSTRAINT "ScreeningRequest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenancePrediction" ADD CONSTRAINT "MaintenancePrediction_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialReport" ADD CONSTRAINT "FinancialReport_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeatureUsage" ADD CONSTRAINT "UserFeatureUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipDismissal" ADD CONSTRAINT "TipDismissal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
