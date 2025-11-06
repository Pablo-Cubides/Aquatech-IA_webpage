import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | AquatechIA",
  description:
    "Política de privacidad y protección de datos personales en AquatechIA",
  robots: "index, follow",
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#000000] text-white min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#00EFFF]">
            Política de Privacidad
          </h1>
          <p className="text-[#CCCCCC] text-sm mt-4">
            Última actualización: {new Date().toLocaleDateString("es-ES")}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              1. Responsable del Tratamiento de Datos
            </h2>
            <p className="text-[#CCCCCC] mb-4">
              <strong>AquatechIA</strong> es el responsable del tratamiento de
              tus datos personales en el contexto de nuestros servicios
              educativos y herramientas de gestión ambiental.
            </p>
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-sm text-[#CCCCCC]">
                📧 Email:{" "}
                <span className="text-gray-200">privacy@aquatechia.com</span>
              </p>
              <p className="text-sm text-[#CCCCCC] mt-2">
                🌐 Sitio web:{" "}
                <span className="text-gray-200">https://aquatechia.com</span>
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              2. ¿Qué Datos Recopilamos?
            </h2>
            <p className="text-[#CCCCCC] mb-4">
              Recopilamos los siguientes tipos de datos:
            </p>
            <ul className="space-y-3 text-[#CCCCCC]">
              <li className="flex gap-3">
                <span className="text-[#00EFFF]">▪</span>
                <span>
                  <strong>Datos de Autenticación:</strong> email, nombre
                  completo, foto de perfil (proporcionados a través de Google
                  OAuth)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00EFFF]">▪</span>
                <span>
                  <strong>Datos de Perfil:</strong> información biográfica
                  voluntaria, ubicación, intereses académicos
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00EFFF]">▪</span>
                <span>
                  <strong>Datos de Uso:</strong> historial de herramientas
                  utilizadas, tiempo de sesión, interacciones con contenido
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00EFFF]">▪</span>
                <span>
                  <strong>Datos Técnicos:</strong> dirección IP, tipo de
                  navegador, dispositivo, sistema operativo
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00EFFF]">▪</span>
                <span>
                  <strong>Datos de Contenido:</strong> notas, archivos subidos,
                  comentarios (solo con tu consentimiento)
                </span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              3. Base Legal para el Tratamiento
            </h2>
            <p className="text-[#CCCCCC] mb-4">
              Tratamos tus datos bajo las siguientes bases legales:
            </p>
            <ul className="space-y-2 text-[#CCCCCC] ml-4">
              <li>
                ✓ <strong>Consentimiento:</strong> Proporcionado al registrarte
              </li>
              <li>
                ✓ <strong>Contrato:</strong> Para proporcionar nuestros
                servicios
              </li>
              <li>
                ✓ <strong>Interés Legítimo:</strong> Mejorar seguridad y
                prevenir fraude
              </li>
              <li>
                ✓ <strong>Cumplimiento Legal:</strong> Cuando así lo requiera la
                ley
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              4. Cómo Usamos Tus Datos
            </h2>
            <p className="text-[#CCCCCC] mb-4">Utilizamos tus datos para:</p>
            <ul className="space-y-2 text-[#CCCCCC] ml-4">
              <li>✓ Proporcionar y mejorar nuestros servicios</li>
              <li>✓ Personalizar tu experiencia educativa</li>
              <li>✓ Enviar notificaciones y actualizaciones</li>
              <li>✓ Analizar el uso de la plataforma (analytics)</li>
              <li>✓ Prevenir fraude y mejorar seguridad</li>
              <li>✓ Cumplir con obligaciones legales</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              5. Derechos del Usuario (GDPR)
            </h2>
            <p className="text-[#CCCCCC] mb-4">Tienes derecho a:</p>
            <ul className="space-y-3 text-[#CCCCCC]">
              <li className="flex gap-3">
                <span className="text-[#00EFFF]">🔐</span>
                <span>
                  <strong>Acceso:</strong> Solicitar una copia de tus datos
                  personales
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00EFFF]">✏️</span>
                <span>
                  <strong>Rectificación:</strong> Corregir datos inexactos
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00EFFF]">🗑️</span>
                <span>
                  <strong>Eliminación:</strong> Solicitar el borrado de tus
                  datos
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00EFFF]">⏸️</span>
                <span>
                  <strong>Limitación:</strong> Limitar cómo procesamos tus datos
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00EFFF]">📤</span>
                <span>
                  <strong>Portabilidad:</strong> Recibir tus datos en formato
                  estructurado
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00EFFF]">🚫</span>
                <span>
                  <strong>Objeción:</strong> Oponertu procesamiento de datos
                </span>
              </li>
            </ul>
            <p className="text-[#CCCCCC] text-sm mt-4">
              Para ejercer estos derechos, contacta a:{" "}
              <strong>privacy@aquatechia.com</strong>
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              6. Compartir Datos con Terceros
            </h2>
            <p className="text-[#CCCCCC] mb-4">
              Solo compartimos tus datos con terceros en los siguientes casos:
            </p>
            <ul className="space-y-2 text-[#CCCCCC] ml-4">
              <li>
                🔸 <strong>Proveedores:</strong> Supabase (base de datos),
                Sentry (monitoreo)
              </li>
              <li>
                🔸 <strong>Cumplimiento Legal:</strong> Si así lo requiere la
                ley
              </li>
              <li>
                🔸 <strong>Consentimiento:</strong> Si tu lo autorizas
                explícitamente
              </li>
            </ul>
            <p className="text-[#CCCCCC] text-sm mt-4">
              No vendemos ni alquilamos tus datos personales a terceros.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              7. Seguridad de Datos
            </h2>
            <p className="text-[#CCCCCC] mb-4">
              Implementamos medidas de seguridad técnicas y organizativas para
              proteger tus datos:
            </p>
            <ul className="space-y-2 text-[#CCCCCC] ml-4">
              <li>🛡️ Encriptación en tránsito (HTTPS/TLS)</li>
              <li>🛡️ Encriptación en reposo para datos sensibles</li>
              <li>🛡️ Autenticación segura (NextAuth.js)</li>
              <li>🛡️ Monitoreo y logging de acceso</li>
              <li>🛡️ Revisiones de seguridad regulares</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              8. Retención de Datos
            </h2>
            <p className="text-[#CCCCCC] mb-4">
              Conservamos tus datos personales durante el tiempo necesario para:
            </p>
            <ul className="space-y-2 text-[#CCCCCC] ml-4">
              <li>
                📅 <strong>Datos de Cuenta:</strong> Mientras tu cuenta esté
                activa
              </li>
              <li>
                📅 <strong>Datos de Uso:</strong> Máximo 12 meses
              </li>
              <li>
                📅 <strong>Logs de Acceso:</strong> Máximo 90 días
              </li>
              <li>
                📅 <strong>Datos Legales:</strong> Según lo requiera la ley
              </li>
            </ul>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              9. Cookies y Tecnologías de Rastreo
            </h2>
            <p className="text-[#CCCCCC] mb-4">Utilizamos cookies para:</p>
            <ul className="space-y-2 text-[#CCCCCC] ml-4">
              <li>🍪 Mantener tu sesión activa</li>
              <li>🍪 Recordar preferencias</li>
              <li>🍪 Analizar uso (Google Analytics)</li>
              <li>🍪 Mejorar seguridad (CSRF tokens)</li>
            </ul>
            <p className="text-[#CCCCCC] text-sm mt-4">
              Puedes gestionar cookies desde las preferencias de tu navegador.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              10. Cambios a Esta Política
            </h2>
            <p className="text-[#CCCCCC]">
              Podemos actualizar esta política ocasionalmente. Te notificaremos
              de cambios significativos mediante email o publicando la nueva
              política en nuestro sitio.
            </p>
          </section>

          {/* Footer */}
          <section className="bg-gray-900 p-6 rounded-lg border border-gray-800 mt-12">
            <h3 className="text-lg font-bold mb-3 text-[#00EFFF]">
              ¿Preguntas?
            </h3>
            <p className="text-[#CCCCCC] mb-4">
              Si tienes preguntas sobre esta política o cómo manejamos tus
              datos, por favor contáctanos:
            </p>
            <div className="text-[#CCCCCC] space-y-2">
              <p>
                📧 <strong>Email:</strong> privacy@aquatechia.com
              </p>
              <p>
                💬 <strong>Formulario de Contacto:</strong>{" "}
                https://aquatechia.com/contacto
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
