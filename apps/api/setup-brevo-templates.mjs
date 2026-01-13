/**
 * Script para configurar templates de email en Brevo
 * 
 * Crea:
 * 1. Email de bienvenida al newsletter
 * 2. Email de confirmación (double opt-in)
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY;
if (!BREVO_API_KEY) {
  console.error('❌ BREVO_API_KEY no está definida en las variables de entorno');
  process.exit(1);
}
const BASE_URL = 'https://api.brevo.com/v3';

const headers = {
  'accept': 'application/json',
  'api-key': BREVO_API_KEY,
  'content-type': 'application/json'
};

/**
 * Obtener todos los templates
 */
async function getTemplates() {
  try {
    const response = await fetch(`${BASE_URL}/smtp/templates`, { headers });
    const data = await response.json();
    return data.templates || [];
  } catch (error) {
    console.error('Error obteniendo templates:', error.message);
    return [];
  }
}

/**
 * Crear template de email de bienvenida
 */
async function createWelcomeTemplate() {
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a AquatechIA</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #00efff 0%, #0077b6 100%); padding: 40px 20px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">¡Bienvenido a AquatechIA!</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
                                Hola,
                            </p>
                            <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
                                ¡Gracias por unirte a nuestra comunidad! 🎉
                            </p>
                            <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
                                Ahora recibirás contenido exclusivo sobre:
                            </p>
                            <ul style="font-size: 16px; line-height: 1.8; color: #333333; margin: 0 0 30px 0; padding-left: 20px;">
                                <li>🤖 Inteligencia Artificial aplicada al agua y medio ambiente</li>
                                <li>🌍 Gestión ambiental con tecnología</li>
                                <li>🔧 Herramientas y recursos gratuitos</li>
                                <li>📚 Tutoriales y casos de estudio</li>
                            </ul>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="https://aquatechia.com" style="display: inline-block; padding: 14px 32px; background-color: #00efff; color: #000000; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                            Explorar AquatechIA
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 30px 0 0 0;">
                                Si tienes alguna pregunta, simplemente responde a este email.
                            </p>
                            <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 10px 0 0 0;">
                                ¡Nos vemos pronto! 👋
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="font-size: 14px; color: #6c757d; margin: 0 0 10px 0;">
                                © 2026 AquatechIA. Todos los derechos reservados.
                            </p>
                            <p style="font-size: 12px; color: #6c757d; margin: 0;">
                                <a href="{{ unsubscribe }}" style="color: #6c757d; text-decoration: underline;">Cancelar suscripción</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;

  try {
    const response = await fetch(`${BASE_URL}/smtp/templates`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        templateName: 'Newsletter - Bienvenida AquatechIA',
        subject: '¡Bienvenido a AquatechIA! 🎉',
        sender: {
          name: 'AquatechIA',
          email: 'noreply@aquatechia.com'
        },
        htmlContent: htmlContent,
        isActive: true,
        tag: 'newsletter-welcome'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error creando template de bienvenida:', error);
      return null;
    }

    const data = await response.json();
    console.log('✅ Template de bienvenida creado. ID:', data.id);
    return data.id;
  } catch (error) {
    console.error('Error creando template de bienvenida:', error.message);
    return null;
  }
}

/**
 * Crear template de confirmación (double opt-in)
 */
async function createConfirmationTemplate() {
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirma tu suscripción</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0077b6 0%, #023e8a 100%); padding: 40px 20px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Confirma tu suscripción</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                            <p style="font-size: 18px; line-height: 1.6; color: #333333; margin: 0 0 30px 0;">
                                ¡Gracias por tu interés en AquatechIA!
                            </p>
                            <p style="font-size: 16px; line-height: 1.6; color: #666666; margin: 0 0 30px 0;">
                                Para completar tu suscripción y comenzar a recibir nuestro contenido exclusivo, 
                                por favor confirma tu dirección de email haciendo clic en el botón de abajo:
                            </p>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ params.CONFIRMATION_URL }}" style="display: inline-block; padding: 16px 40px; background-color: #00efff; color: #000000; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 18px;">
                                            Confirmar mi suscripción
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="font-size: 14px; line-height: 1.6; color: #999999; margin: 30px 0 0 0;">
                                Si no solicitaste esta suscripción, puedes ignorar este email de forma segura.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="font-size: 14px; color: #6c757d; margin: 0;">
                                © 2026 AquatechIA. Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;

  try {
    const response = await fetch(`${BASE_URL}/smtp/templates`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        templateName: 'Newsletter - Confirmación de Suscripción',
        subject: 'Confirma tu suscripción a AquatechIA',
        sender: {
          name: 'AquatechIA',
          email: 'noreply@aquatechia.com'
        },
        htmlContent: htmlContent,
        isActive: true,
        tag: 'newsletter-confirmation'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error creando template de confirmación:', error);
      return null;
    }

    const data = await response.json();
    console.log('✅ Template de confirmación creado. ID:', data.id);
    return data.id;
  } catch (error) {
    console.error('Error creando template de confirmación:', error.message);
    return null;
  }
}

/**
 * Configuración principal
 */
async function setupTemplates() {
  console.log('📧 Configurando templates de email...\n');

  // 1. Verificar templates existentes
  const existingTemplates = await getTemplates();
  const welcomeExists = existingTemplates.find(t => t.name.includes('Bienvenida AquatechIA'));
  const confirmationExists = existingTemplates.find(t => t.name.includes('Confirmación de Suscripción'));

  console.log(`Encontrados ${existingTemplates.length} templates existentes\n`);

  // 2. Crear template de bienvenida
  let welcomeId = null;
  if (welcomeExists) {
    console.log(`ℹ️  Template de bienvenida ya existe (ID: ${welcomeExists.id})`);
    welcomeId = welcomeExists.id;
  } else {
    welcomeId = await createWelcomeTemplate();
  }

  // 3. Crear template de confirmación
  let confirmationId = null;
  if (confirmationExists) {
    console.log(`ℹ️  Template de confirmación ya existe (ID: ${confirmationExists.id})`);
    confirmationId = confirmationExists.id;
  } else {
    confirmationId = await createConfirmationTemplate();
  }

  // 4. Resumen
  console.log('\n✨ Configuración de templates completada!\n');
  console.log('📊 Resumen:');
  console.log(`   - Template Bienvenida ID: ${welcomeId || 'No configurado'}`);
  console.log(`   - Template Confirmación ID: ${confirmationId || 'No configurado'}`);
  console.log('\n📝 Próximos pasos:');
  console.log('   1. Ve a Brevo Dashboard → Campaigns → Email templates');
  console.log('   2. Revisa y personaliza los templates según tus necesidades');
  console.log('   3. Configura una automatización para enviar el email de bienvenida');
  console.log('\n💡 Tip: Puedes configurar double opt-in en Settings → Forms');
}

// Ejecutar
setupTemplates().catch(console.error);
