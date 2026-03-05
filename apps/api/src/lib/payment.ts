import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { prisma } from "@ia-next/database";
import type { PaymentStatus, Prisma } from "@prisma/client";
import { logger } from "./logger";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function getUrlEnv(primaryName: string, fallbackName: string): string {
  const primary = process.env[primaryName]?.trim();
  if (primary) {
    return primary;
  }

  const fallback = process.env[fallbackName]?.trim();
  if (fallback) {
    return fallback;
  }

  throw new Error(`${primaryName} or ${fallbackName} is not configured`);
}

function normalizeBaseUrl(urlValue: string, envName: string): string {
  try {
    const parsed = new URL(urlValue);
    return parsed.toString().replace(/\/$/, "");
  } catch {
    throw new Error(`${envName} must be a valid URL`);
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

function parseWebhookPayload(payload: unknown): {
  type?: string;
  data?: { id?: string | number };
} {
  if (typeof payload !== "object" || payload === null) {
    return {};
  }

  const parsed = payload as {
    type?: unknown;
    data?: { id?: unknown };
  };

  return {
    type: typeof parsed.type === "string" ? parsed.type : undefined,
    data:
      typeof parsed.data === "object" && parsed.data !== null
        ? {
            id:
              typeof parsed.data.id === "string" ||
              typeof parsed.data.id === "number"
                ? parsed.data.id
                : undefined,
          }
        : undefined,
  };
}

type PaymentRecordWithUser = Prisma.PaymentGetPayload<{
  include: { user: true };
}>;

type PaymentMetadata = Record<string, unknown>;

let preferenceApi: Preference | null = null;
let paymentApi: Payment | null = null;

function getMercadoPagoClients(): { preference: Preference; payment: Payment } {
  if (preferenceApi && paymentApi) {
    return { preference: preferenceApi, payment: paymentApi };
  }

  const client = new MercadoPagoConfig({
    accessToken: getRequiredEnv("MERCADOPAGO_ACCESS_TOKEN"),
    options: { timeout: 5000, idempotencyKey: "ia-next" },
  });

  preferenceApi = new Preference(client);
  paymentApi = new Payment(client);

  return { preference: preferenceApi, payment: paymentApi };
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  description: string;
}

// Predefined credit packages
export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "starter",
    name: "Paquete Starter",
    credits: 100,
    price: 5000, // $50.00 ARS
    currency: "ARS",
    description: "Perfecto para comenzar con nuestras herramientas de IA",
  },
  {
    id: "pro",
    name: "Paquete Pro",
    credits: 250,
    price: 10000, // $100.00 ARS
    currency: "ARS",
    description: "Para usuarios que necesitan más potencia",
  },
  {
    id: "enterprise",
    name: "Paquete Enterprise",
    credits: 500,
    price: 18000, // $180.00 ARS
    currency: "ARS",
    description: "Para equipos y uso intensivo",
  },
];

class PaymentService {
  async createPaymentPreference(
    userId: string,
    packageId: string,
    userEmail?: string,
    userName?: string,
  ): Promise<{
    preferenceId: string;
    paymentId: string;
    checkoutUrl?: string;
  }> {
    try {
      const creditPackage = CREDIT_PACKAGES.find((pkg) => pkg.id === packageId);
      if (!creditPackage) {
        throw new Error(`Invalid package ID: ${packageId}`);
      }

      // Create payment record in database
      const paymentRecord = await prisma.payment.create({
        data: {
          userId,
          amount: creditPackage.price / 100, // Store as decimal
          currency: creditPackage.currency,
          status: "PENDING",
          description: creditPackage.description,
          credits: creditPackage.credits,
          externalReference: `${userId}-${Date.now()}`,
          metadata: {
            packageId,
            packageName: creditPackage.name,
          },
        },
      });

      // Create MercadoPago preference
      const apiBaseUrl = normalizeBaseUrl(
        getUrlEnv("API_BASE_URL", "NEXT_PUBLIC_API_URL"),
        "API_BASE_URL/NEXT_PUBLIC_API_URL",
      );
      const webBaseUrl = normalizeBaseUrl(
        getUrlEnv("WEB_BASE_URL", "NEXT_PUBLIC_WEB_URL"),
        "WEB_BASE_URL/NEXT_PUBLIC_WEB_URL",
      );

      const preferenceData = {
        items: [
          {
            id: creditPackage.id,
            title: creditPackage.name,
            description: creditPackage.description,
            quantity: 1,
            unit_price: creditPackage.price / 100,
            currency_id: creditPackage.currency,
          },
        ],
        payer: {
          email: userEmail,
          name: userName,
        },
        external_reference: paymentRecord.id,
        notification_url: `${apiBaseUrl}/api/mp/webhook`,
        back_urls: {
          success: `${webBaseUrl}/payment/success`,
          pending: `${webBaseUrl}/payment/pending`,
          failure: `${webBaseUrl}/payment/failure`,
        },
        auto_return: "approved" as const,
        statement_descriptor: "IA-NEXT CREDITS",
      };

      const { preference } = getMercadoPagoClients();
      const mpPreference = await preference.create({ body: preferenceData });

      if (!mpPreference.id) {
        throw new Error("Failed to create MercadoPago preference");
      }

      // Update payment record with preference ID
      await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: { preferenceId: mpPreference.id },
      });

      await logger.info("Payment preference created", {
        userId,
        paymentId: paymentRecord.id,
        preferenceId: mpPreference.id,
        packageId,
        amount: creditPackage.price / 100,
      });

      return {
        preferenceId: mpPreference.id,
        paymentId: paymentRecord.id,
        checkoutUrl: mpPreference.sandbox_init_point || mpPreference.init_point,
      };
    } catch (error: unknown) {
      await logger.error("Failed to create payment preference", {
        userId,
        packageId,
        error: getErrorMessage(error),
      });
      throw error;
    }
  }

  async handleWebhook(data: unknown): Promise<void> {
    try {
      const { type, data: webhookData } = parseWebhookPayload(data);

      if (type !== "payment") {
        await logger.info("Received non-payment webhook", {
          type,
          data: webhookData,
        });
        return;
      }

      const paymentId = webhookData?.id;
      if (!paymentId) {
        await logger.warn("Webhook missing payment ID", { data });
        return;
      }

      // Get payment details from MercadoPago
      const { payment } = getMercadoPagoClients();
      const mpPayment = await payment.get({ id: paymentId });

      if (!mpPayment || !mpPayment.external_reference) {
        await logger.warn("Could not get payment details", { paymentId });
        return;
      }

      // Find payment record in database
      const paymentRecord = await prisma.payment.findUnique({
        where: { id: mpPayment.external_reference },
        include: { user: true },
      });

      if (!paymentRecord) {
        await logger.warn("Could not find payment record", {
          externalReference: mpPayment.external_reference,
        });
        return;
      }

      // Update payment status
      const statusMap: Record<string, PaymentStatus> = {
        approved: "APPROVED",
        authorized: "AUTHORIZED",
        in_process: "IN_PROCESS",
        in_mediation: "IN_MEDIATION",
        rejected: "REJECTED",
        cancelled: "CANCELLED",
        refunded: "REFUNDED",
        charged_back: "CHARGED_BACK",
      };

      const newStatus: PaymentStatus =
        statusMap[mpPayment.status || ""] || "PENDING";
      const paymentMetadata = {
        ...(typeof paymentRecord.metadata === "object" &&
        paymentRecord.metadata !== null
          ? (paymentRecord.metadata as PaymentMetadata)
          : {}),
        mercadoPagoData: {
          id: mpPayment.id,
          status: mpPayment.status,
          status_detail: mpPayment.status_detail,
          payment_method_id: mpPayment.payment_method_id,
          payment_type_id: mpPayment.payment_type_id,
        },
      };

      if (mpPayment.status === "approved") {
        const processed = await prisma.$transaction(async (tx) => {
          const updateResult = await tx.payment.updateMany({
            where: {
              id: paymentRecord.id,
              status: { not: "APPROVED" },
            },
            data: {
              status: "APPROVED",
              mercadoPagoId: paymentId.toString(),
              paymentMethodId: mpPayment.payment_method_id || undefined,
              paymentTypeId: mpPayment.payment_type_id || undefined,
              paidAt: new Date(),
              metadata: paymentMetadata,
            },
          });

          if (updateResult.count === 0) {
            return false;
          }

          await tx.user.update({
            where: { id: paymentRecord.userId },
            data: { credits: { increment: paymentRecord.credits } },
          });

          await tx.creditLog.create({
            data: {
              userId: paymentRecord.userId,
              amount: paymentRecord.credits,
              reason: "purchase",
              metadata: {
                paymentId: paymentRecord.id,
                mercadoPagoId: paymentId.toString(),
              },
            },
          });

          return true;
        });

        if (!processed) {
          await logger.warn("Duplicate approved payment webhook ignored", {
            paymentId: paymentRecord.id,
            mercadoPagoId: paymentId,
            userId: paymentRecord.userId,
          });
          return;
        }

        await logger.info("Credits added to user account", {
          userId: paymentRecord.userId,
          credits: paymentRecord.credits,
          paymentId: paymentRecord.id,
        });
      } else {
        if (paymentRecord.status === "APPROVED") {
          await logger.warn(
            "Ignored payment status downgrade for approved payment",
            {
              paymentId: paymentRecord.id,
              mercadoPagoId: paymentId,
              currentStatus: paymentRecord.status,
              incomingStatus: newStatus,
            },
          );
          return;
        }

        await prisma.payment.update({
          where: { id: paymentRecord.id },
          data: {
            status: newStatus,
            mercadoPagoId: paymentId.toString(),
            paymentMethodId: mpPayment.payment_method_id || undefined,
            paymentTypeId: mpPayment.payment_type_id || undefined,
            metadata: paymentMetadata,
          },
        });
      }

      if (["rejected", "cancelled"].includes(mpPayment.status || "")) {
        await this.processFailedPayment(
          paymentRecord,
          mpPayment.status_detail || "Unknown error",
        );
      }

      await logger.info("Payment webhook processed", {
        paymentId: paymentRecord.id,
        mercadoPagoId: paymentId,
        status: newStatus,
        userId: paymentRecord.userId,
      });
    } catch (error: unknown) {
      await logger.error("Failed to process payment webhook", {
        error: getErrorMessage(error),
        data,
      });
      throw error;
    }
  }

  private async processFailedPayment(
    paymentRecord: PaymentRecordWithUser,
    reason: string,
  ): Promise<void> {
    try {
      const { userId, user } = paymentRecord;

      // Send failure email (disabled - using only welcome template)
      // TODO: Add payment failure template if needed
      if (user.email && user.name) {
        await logger.warn("Payment failed - email notification skipped", {
          userId,
          userEmail: user.email,
          amount: paymentRecord.amount,
          reason,
        });
      }

      await logger.info("Payment failed, notified user", {
        userId,
        paymentId: paymentRecord.id,
        reason,
      });
    } catch (error: unknown) {
      await logger.error("Failed to process failed payment", {
        paymentId: paymentRecord.id,
        error: getErrorMessage(error),
      });
    }
  }

  async getUserPayments(userId: string, limit = 10) {
    return prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async getPaymentById(paymentId: string) {
    return prisma.payment.findUnique({
      where: { id: paymentId },
      include: { user: true },
    });
  }
}

export const paymentService = new PaymentService();
