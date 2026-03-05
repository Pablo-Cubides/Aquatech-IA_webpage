import * as brevo from "@getbrevo/brevo";
import { prisma } from "@ia-next/database";
import { EmailEventStatus, EmailEventType, Prisma } from "@prisma/client";
import { logger } from "./logger";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

function toEmailEventType(template: EmailTemplate): EmailEventType {
  const map: Record<EmailTemplate, EmailEventType> = {
    [EmailTemplate.WELCOME]: EmailEventType.WELCOME,
  };

  return map[template];
}

function parseWebhookEvent(input: unknown): {
  eventType?: string;
  messageId?: string;
  raw: unknown;
} {
  if (typeof input !== "object" || input === null) {
    return { raw: input };
  }

  const parsed = input as Record<string, unknown>;

  return {
    eventType: typeof parsed.event === "string" ? parsed.event : undefined,
    messageId:
      typeof parsed["message-id"] === "string"
        ? parsed["message-id"]
        : undefined,
    raw: input,
  };
}

function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? null)) as Prisma.InputJsonValue;
}

// Initialize Brevo client
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || "",
);

export enum EmailTemplate {
  WELCOME = "welcome",
}

interface EmailData {
  to: string;
  name?: string;
  template: EmailTemplate;
  templateId?: number;
  variables?: Record<string, unknown>;
  userId?: string;
}

class EmailService {
  private getTemplateConfig(template: EmailTemplate) {
    const configs = {
      [EmailTemplate.WELCOME]: {
        templateId: 1, // Template de bienvenida en Brevo
        subject: "¡Bienvenido a AquatechIA!",
      },
    };

    return configs[template];
  }

  async sendEmail(data: EmailData): Promise<string | null> {
    const { to, name, template, templateId, variables = {}, userId } = data;
    const config = this.getTemplateConfig(template);
    const finalTemplateId = templateId || config.templateId;

    try {
      // Create email event record
      const emailEvent = await prisma.emailEvent.create({
        data: {
          userId,
          email: to,
          event: toEmailEventType(template),
          templateId: finalTemplateId.toString(),
          subject: config.subject,
          status: EmailEventStatus.SENT,
          metadata: toInputJsonValue({
            variables,
            ...(name ? { name } : {}),
          }),
        },
      });

      // Send email via Brevo
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      sendSmtpEmail.to = [{ email: to, name }];
      sendSmtpEmail.templateId = finalTemplateId;
      sendSmtpEmail.params = variables;
      sendSmtpEmail.headers = {
        "X-Mailin-custom": `email_event_id:${emailEvent.id}`,
      };

      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

      // Update email event with message ID
      if (result.body?.messageId) {
        await prisma.emailEvent.update({
          where: { id: emailEvent.id },
          data: { messageId: result.body.messageId },
        });
      }

      await logger.info("Email sent successfully", {
        to,
        template,
        templateId: finalTemplateId,
        messageId: result.body?.messageId,
        emailEventId: emailEvent.id,
      });

      return result.body?.messageId || null;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      await logger.error("Failed to send email", {
        to,
        template,
        error: errorMessage,
      });

      // Update email event status to failed
      try {
        await prisma.emailEvent.updateMany({
          where: {
            email: to,
            event: toEmailEventType(template),
            status: EmailEventStatus.SENT,
          },
          data: {
            status: EmailEventStatus.ERROR,
            processedAt: new Date(),
            metadata: toInputJsonValue({ error: errorMessage }),
          },
        });
      } catch (updateError: unknown) {
        await logger.error("Failed to update email event status", {
          error: getErrorMessage(updateError),
        });
      }

      throw error;
    }
  }

  // Método principal para enviar solo emails de bienvenida
  async sendWelcomeEmail(to: string, name: string, userId?: string) {
    return this.sendEmail({
      to,
      name,
      template: EmailTemplate.WELCOME,
      variables: { name },
      userId,
    });
  }

  // Handle webhook events from Brevo
  async handleWebhookEvent(event: unknown) {
    try {
      const { eventType, messageId, raw } = parseWebhookEvent(event);

      if (!messageId) {
        await logger.warn("Received webhook event without message ID", {
          event,
        });
        return;
      }

      // Find email event by message ID
      const emailEvent = await prisma.emailEvent.findFirst({
        where: { messageId },
      });

      if (!emailEvent) {
        await logger.warn("Could not find email event for webhook", {
          messageId,
          eventType,
        });
        return;
      }

      // Update email event status based on webhook event
      const statusMap: Record<string, string> = {
        delivered: "DELIVERED",
        opened: "OPENED",
        clicked: "CLICKED",
        bounced: "BOUNCED",
        complained: "COMPLAINED",
        blocked: "BLOCKED",
      };

      const newStatus = (eventType ? statusMap[eventType] : undefined) || "ERROR";

      const existingMetadata =
        typeof emailEvent.metadata === "object" &&
        emailEvent.metadata !== null &&
        !Array.isArray(emailEvent.metadata)
          ? (emailEvent.metadata as Record<string, unknown>)
          : {};

      await prisma.emailEvent.update({
        where: { id: emailEvent.id },
        data: {
          status: newStatus as EmailEventStatus,
          processedAt: new Date(),
          metadata: toInputJsonValue({
            ...existingMetadata,
            webhookEvent: raw,
          }),
        },
      });

      await logger.info(`Updated email event from webhook`, {
        emailEventId: emailEvent.id,
        eventType,
        newStatus,
      });
    } catch (error: unknown) {
      await logger.error("Failed to process email webhook", {
        error: getErrorMessage(error),
        event,
      });
    }
  }
}

export const emailService = new EmailService();
