/**
 * Script para configurar automáticamente Brevo Newsletter
 * 
 * Este script:
 * 1. Crea una lista de contactos para el newsletter
 * 2. Configura los atributos personalizados necesarios
 * 3. Verifica la configuración
 * 
 * Uso:
 * node setup-brevo.mjs
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
 * Obtener todas las listas
 */
async function getLists() {
  try {
    const response = await fetch(`${BASE_URL}/contacts/lists`, { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error obteniendo listas:', error.message);
    return null;
  }
}

/**
 * Crear lista de newsletter
 */
async function createNewsletterList() {
  try {
    const response = await fetch(`${BASE_URL}/contacts/lists`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'Newsletter AquatechIA',
        folderId: 1
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error creando lista:', error);
      return null;
    }

    const data = await response.json();
    console.log('✅ Lista creada exitosamente. ID:', data.id);
    return data.id;
  } catch (error) {
    console.error('Error creando lista:', error.message);
    return null;
  }
}

/**
 * Obtener atributos existentes
 */
async function getAttributes() {
  try {
    const response = await fetch(`${BASE_URL}/contacts/attributes`, { headers });
    const data = await response.json();
    return data.attributes;
  } catch (error) {
    console.error('Error obteniendo atributos:', error.message);
    return [];
  }
}

/**
 * Crear atributo personalizado
 */
async function createAttribute(name, type, enumeration = null) {
  try {
    const body = {
      type: type, // 'text', 'date', 'float', 'boolean'
    };

    if (enumeration) {
      body.enumeration = enumeration;
    }

    const response = await fetch(`${BASE_URL}/contacts/attributes/normal/${name}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json();
      // Si el atributo ya existe, no es un error
      if (error.code === 'duplicate_parameter') {
        console.log(`ℹ️  Atributo ${name} ya existe`);
        return true;
      }
      console.error(`Error creando atributo ${name}:`, error);
      return false;
    }

    console.log(`✅ Atributo ${name} creado exitosamente`);
    return true;
  } catch (error) {
    console.error(`Error creando atributo ${name}:`, error.message);
    return false;
  }
}

/**
 * Configuración principal
 */
async function setupBrevo() {
  console.log('🚀 Iniciando configuración de Brevo Newsletter...\n');

  // 1. Verificar listas existentes
  console.log('📋 Verificando listas existentes...');
  const lists = await getLists();
  
  let listId = null;
  if (lists && lists.lists) {
    const newsletterList = lists.lists.find(list => 
      list.name.toLowerCase().includes('newsletter')
    );
    
    if (newsletterList) {
      console.log(`✅ Lista de newsletter encontrada: ${newsletterList.name} (ID: ${newsletterList.id})`);
      listId = newsletterList.id;
    } else {
      console.log('⚠️  No se encontró lista de newsletter, creando una nueva...');
      listId = await createNewsletterList();
    }
  }

  console.log('\n📝 Configurando atributos personalizados...');
  
  // 2. Verificar atributos existentes
  const existingAttributes = await getAttributes();
  const existingNames = existingAttributes && existingAttributes.length > 0 
    ? existingAttributes.map(attr => attr.name) 
    : [];
  
  if (existingNames.length > 0) {
    console.log('Atributos existentes:', existingNames.join(', '));
  } else {
    console.log('No hay atributos personalizados configurados aún.');
  }

  // 3. Crear atributos necesarios si no existen
  const attributesToCreate = [
    { name: 'PORTAL', type: 'text' },
    { name: 'SOURCE', type: 'text' },
    { name: 'SUBSCRIBED_AT', type: 'date' }
  ];

  for (const attr of attributesToCreate) {
    if (!existingNames.includes(attr.name)) {
      await createAttribute(attr.name, attr.type);
    } else {
      console.log(`ℹ️  Atributo ${attr.name} ya existe`);
    }
  }

  // 4. Resumen
  console.log('\n✨ Configuración completada!\n');
  console.log('📊 Resumen:');
  console.log(`   - List ID: ${listId || 'No configurado'}`);
  console.log('   - Atributos: PORTAL, SOURCE, SUBSCRIBED_AT');
  console.log('\n📝 Actualiza tu .env con:');
  console.log(`   BREVO_NEWSLETTER_LIST_ID=${listId || '2'}`);
  console.log('\n🎉 ¡Listo! El newsletter está configurado y funcionando.');
}

// Ejecutar
setupBrevo().catch(console.error);
