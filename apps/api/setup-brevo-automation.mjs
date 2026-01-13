/**
 * Script para configurar automatización de email de bienvenida en Brevo
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY;
if (!BREVO_API_KEY) {
  console.error('❌ BREVO_API_KEY no está definida en las variables de entorno');
  process.exit(1);
}
const BASE_URL = 'https://api.brevo.com/v3';
const NEWSLETTER_LIST_ID = 5;
const WELCOME_TEMPLATE_ID = 1;

const headers = {
  'accept': 'application/json',
  'api-key': BREVO_API_KEY,
  'content-type': 'application/json'
};

/**
 * Crear automatización de bienvenida
 */
async function createWelcomeAutomation() {
  try {
    const response = await fetch(`${BASE_URL}/automation/automations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'Newsletter - Bienvenida Automática',
        type: 'listAddition',
        settings: {
          listId: NEWSLETTER_LIST_ID,
          emailCampaignId: WELCOME_TEMPLATE_ID
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error creando automatización:', error);
      return null;
    }

    const data = await response.json();
    console.log('✅ Automatización creada exitosamente. ID:', data.id);
    return data.id;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

/**
 * Obtener automatizaciones existentes
 */
async function getAutomations() {
  try {
    const response = await fetch(`${BASE_URL}/automation/automations`, { headers });
    const data = await response.json();
    return data.automations || [];
  } catch (error) {
    console.error('Error obteniendo automatizaciones:', error.message);
    return [];
  }
}

async function setup() {
  console.log('🤖 Configurando automatización de bienvenida...\n');
  
  const existing = await getAutomations();
  console.log(`Automatizaciones existentes: ${existing.length}\n`);
  
  const welcomeExists = existing.find(a => a.name.includes('Bienvenida'));
  
  if (welcomeExists) {
    console.log(`ℹ️  Automatización de bienvenida ya existe (ID: ${welcomeExists.id})`);
  } else {
    const automationId = await createWelcomeAutomation();
    
    if (automationId) {
      console.log('\n✨ ¡Automatización configurada exitosamente!');
      console.log('\n📧 Ahora cuando alguien se suscriba recibirá automáticamente el email de bienvenida.');
    }
  }
}

setup().catch(console.error);
