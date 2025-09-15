import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { prisma } from "@ia-next/database";
import { logger } from "./logger";
import { emailService } from "./email";

// Initialize MercadoPago client
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: { timeout: 5000, idempotencyKey: "ia-next" },
});

const preference = new Preference(client);
const payment = new Payment(client);

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
        notification_url: `${process.env.NEXT_PUBLIC_API_URL}/api/mp/webhook`,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_WEB_URL}/payment/success`,
          pending: `${process.env.NEXT_PUBLIC_WEB_URL}/payment/pending`,
          failure: `${process.env.NEXT_PUBLIC_WEB_URL}/payment/failure`,
        },
        auto_return: "approved" as const,
        statement_descriptor: "IA-NEXT CREDITS",
      };

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
    } catch (error: any) {
      await logger.error("Failed to create payment preference", {
        userId,
        packageId,
        error: error.message,
      });
      throw error;
    }
  }

  async handleWebhook(data: any): Promise<void> {
    try {
      const { type, data: webhookData } = data;

      if (type !== "payment") {
        await logger.info("Received non-payment webhook", {
          type,
          data: webhookData,
        });
        return;
      }

      const paymentId = webhookData.id;
      if (!paymentId) {
        await logger.warn("Webhook missing payment ID", { data });
        return;
      }

      // Get payment details from MercadoPago
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
      const statusMap: Record<string, any> = {
        approved: "APPROVED",
        authorized: "AUTHORIZED",
        in_process: "IN_PROCESS",
        in_mediation: "IN_MEDIATION",
        rejected: "REJECTED",
        cancelled: "CANCELLED",
        refunded: "REFUNDED",
        charged_back: "CHARGED_BACK",
      };

      const newStatus = statusMap[mpPayment.status || ""] || "PENDING";

      await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: newStatus,
          mercadoPagoId: paymentId.toString(),
          paymentMethodId: mpPayment.payment_method_id || undefined,
          paymentTypeId: mpPayment.payment_type_id || undefined,
          paidAt: mpPayment.status === "approved" ? new Date() : undefined,
          metadata: {
            ...(typeof paymentRecord.metadata === "object" &&
            paymentRecord.metadata !== null
              ? (paymentRecord.metadata as Record<string, any>)
              : {}),
            mercadoPagoData: {
              id: mpPayment.id,
              status: mpPayment.status,
              status_detail: mpPayment.status_detail,
              payment_method_id: mpPayment.payment_method_id,
              payment_type_id: mpPayment.payment_type_id,
            },
          },
        },
      });

      // If payment is approved, add credits to user
      if (mpPayment.status === "approved") {
        await this.processApprovedPayment(paymentRecord);
      } else if (["rejected", "cancelled"].includes(mpPayment.status || "")) {
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
    } catch (error: any) {
      await logger.error("Failed to process payment webhook", {
        error: error.message,
        data,
      });
    }
  }

  private async processApprovedPayment(paymentRecord: any): Promise<void> {
    try {
      const { userId, credits, user } = paymentRecord;

      // Add credits to user
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: credits } },
      });

      // Log credit addition
      await prisma.creditLog.create({
        data: {
          userId,
          amount: credits,
          reason: "purchase",
          metadata: { paymentId: paymentRecord.id },
        },
      });

      // Send success email (disabled - using only welcome template)
      // TODO: Add payment success template if needed
      if (user.email && user.name) {
        await logger.info("Payment successful - email notification skipped", {
          userId,
          userEmail: user.email,
          amount: paymentRecord.amount,
          credits,
        });
      }

      await logger.info("Credits added to user account", {
        userId,
        credits,
        paymentId: paymentRecord.id,
      });
    } catch (error: any) {
      await logger.error("Failed to process approved payment", {
        paymentId: paymentRecord.id,
        error: error.message,
      });
    }
  }

  private async processFailedPayment(
    paymentRecord: any,
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
    } catch (error: any) {
      await logger.error("Failed to process failed payment", {
        paymentId: paymentRecord.id,
        error: error.message,
      });
    }
  }

  async getUserPayments(userId: string, limit = 10): Promise<any[]> {
    return prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async getPaymentById(paymentId: string): Promise<any> {
    return prisma.payment.findUnique({
      where: { id: paymentId },
      include: { user: true },
    });
  }
}

export const paymentService = new PaymentService();
