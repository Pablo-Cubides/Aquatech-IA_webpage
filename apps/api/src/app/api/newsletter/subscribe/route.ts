import { NextRequest, NextResponse } from "next/server";
import * as brevo from "@getbrevo/brevo";
import { logger } from "../../../../lib/logger";
import { z } from "zod";

// Initialize Brevo Contacts API
const contactsApi = new brevo.ContactsApi();
contactsApi.setApiKey(
  brevo.ContactsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || "",
);

const subscribeSchema = z.object({
  email: z.string().email("Email inválido"),
  portal: z.enum(["ia", "ambiental"]).optional(),
  source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, portal, source } = subscribeSchema.parse(body);

    // Create or update contact in Brevo
    const createContact = new brevo.CreateContact();
    createContact.email = email;
    createContact.listIds = [
      parseInt(process.env.BREVO_NEWSLETTER_LIST_ID || "2"),
    ]; // Main newsletter list ID
    createContact.attributes = {
      PORTAL: portal || "general",
      SOURCE: source || "footer",
      SUBSCRIBED_AT: new Date().toISOString(),
    };
    createContact.updateEnabled = true;

    await contactsApi.createContact(createContact);

    await logger.info("Newsletter subscription successful", {
      email,
      portal,
      source,
    });

    return NextResponse.json(
      {
        success: true,
        message: "¡Gracias por suscribirte! Revisa tu email para confirmar.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Si el contacto ya existe, Brevo devuelve un error específico
    if (error.response?.body?.code === "duplicate_parameter") {
      return NextResponse.json(
        {
          success: true,
          message: "Este email ya está suscrito.",
        },
        { status: 200 }
      );
    }

    await logger.error("Newsletter subscription failed", {
      error: error.message,
      body: error.response?.body,
    });

    return NextResponse.json(
      {
        success: false,
        message: "Error al suscribirse. Intenta de nuevo.",
      },
      { status: 500 }
    );
  }
}
