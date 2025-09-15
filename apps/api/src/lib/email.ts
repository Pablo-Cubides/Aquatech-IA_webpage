import * as brevo from "@getbrevo/brevo";
import { prisma } from "@ia-next/database";
import { logger } from "./logger";

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
  variables?: Record<string, any>;
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
          event: template.toUpperCase() as any,
          templateId: finalTemplateId.toString(),
          subject: config.subject,
          status: "SENT",
          metadata: { variables, name },
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
    } catch (error: any) {
      await logger.error("Failed to send email", {
        to,
        template,
        error: error.message,
      });

      // Update email event status to failed
      try {
        await prisma.emailEvent.updateMany({
          where: {
            email: to,
            event: template.toUpperCase() as any,
            status: "SENT",
          },
          data: {
            status: "ERROR",
            processedAt: new Date(),
            metadata: { error: error.message },
          },
        });
      } catch (updateError) {
        await logger.error("Failed to update email event status", {
          error: updateError,
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
  async handleWebhookEvent(event: any) {
    try {
      const { email, event: eventType, "message-id": messageId } = event;

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

      const newStatus = statusMap[eventType] || "ERROR";

      await prisma.emailEvent.update({
        where: { id: emailEvent.id },
        data: {
          status: newStatus as any,
          processedAt: new Date(),
          metadata: {
            ...(typeof emailEvent.metadata === "object" &&
            emailEvent.metadata !== null
              ? (emailEvent.metadata as Record<string, any>)
              : {}),
            webhookEvent: event,
          },
        },
      });

      await logger.info(`Updated email event from webhook`, {
        emailEventId: emailEvent.id,
        eventType,
        newStatus,
      });
    } catch (error: any) {
      await logger.error("Failed to process email webhook", {
        error: error.message,
        event,
      });
    }
  }
}

export const emailService = new EmailService();
