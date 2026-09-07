import type { Metadata } from "next";
import { WebPageStructuredData } from "@/components/seo/StructuredData";
import { AuthoritativeReferences } from "@/components/seo/AuthoritativeReferences";

export const metadata: Metadata = {
  title: "Términos de Servicio | AquatechIA",
  description: "Términos y condiciones de uso legal y licenciamiento de la plataforma y herramientas de AquatechIA",
  robots: "index, follow",
};

export default function TermsPage() {
  return (
    <>
      <WebPageStructuredData
        title="Términos de Servicio | Aquatech IA"
        description="Términos y condiciones de uso legal y licenciamiento de la plataforma y herramientas de AquatechIA"
        url="https://www.aquatechia.com/ia/terms"
        datePublished="2024-06-01"
        dateModified="2026-09-06"
      />
      <div className="bg-[#000000] text-white min-h-screen">
        <div className="max-w-4xl mx-auto py-12 px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#00EFFF]">
              Términos de Servicio
            </h1>
            <p className="text-[#E2E8F0] text-base md:text-lg leading-relaxed mt-4 max-w-3xl">
              Los presentes Términos de Servicio regulan las condiciones de acceso, uso, derechos de propiedad intelectual y responsabilidades legales aplicables a las plataformas tecnológicas y herramientas de análisis de Aquatech IA.
            </p>
            <div className="text-[#94A3B8] text-sm mt-3 flex items-center gap-2">
              <span>Fecha de última actualización:</span>
              <time dateTime="2026-09-06" className="font-medium text-slate-300">6 de septiembre de 2026</time>
            </div>
          </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              1. Aceptación de Términos
            </h2>
            <p className="text-[#CCCCCC]">
              Al acceder y usar AquatechIA, aceptas estar vinculado por estos
              Términos de Servicio. Si no aceptas estos términos, no debes usar
              nuestros servicios.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              2. Descripción del Servicio
            </h2>
            <p className="text-[#CCCCCC] mb-4">AquatechIA proporciona:</p>
            <ul className="space-y-2 text-[#CCCCCC] ml-4">
              <li>✓ Plataforma educativa sobre Inteligencia Artificial</li>
              <li>✓ Herramientas de gestión y análisis ambiental</li>
              <li>✓ Recursos de aprendizaje interactivos</li>
              <li>✓ Servicios relacionados que podamos añadir en el futuro</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              3. Cuenta de Usuario
            </h2>
            <div className="space-y-4 text-[#CCCCCC]">
              <p>
                Para usar ciertos servicios, debes crear una cuenta
                proporcionando información precisa. Eres responsable de:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• Mantener la confidencialidad de tu contraseña</li>
                <li>• Notificarnos de acceso no autorizado</li>
                <li>• Toda actividad en tu cuenta</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              4. Uso Aceptable
            </h2>
            <p className="text-[#CCCCCC] mb-4">No debes:</p>
            <ul className="space-y-2 text-[#CCCCCC] ml-4">
              <li>🚫 Usar la plataforma para actividades ilegales</li>
              <li>🚫 Acosar, amenazar o discriminar a otros usuarios</li>
              <li>
                🚫 Compartir contenido obsceno, violento o discriminatorio
              </li>
              <li>🚫 Intenta hackear o comprometer la seguridad</li>
              <li>🚫 Copiar o distribuir contenido sin autorización</li>
              <li>🚫 Enviar spam o malware</li>
              <li>🚫 Violar derechos de propiedad intelectual</li>
              <li>🚫 Hacer scraping automatizado sin permiso</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              5. Derechos de Propiedad Intelectual
            </h2>
            <p className="text-[#CCCCCC] mb-4">
              Todos los contenidos de AquatechIA (texto, gráficos, logos,
              imágenes, código) son propiedad de AquatechIA o sus licenciantes y
              están protegidos por derechos de autor.
            </p>
            <p className="text-[#CCCCCC]">
              Se te otorga una licencia limitada para usar el contenido para
              fines educativos personales. No puedes reproducir, distribuir o
              transmitir contenido sin autorización explícita.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              6. Contenido del Usuario
            </h2>
            <p className="text-[#CCCCCC] mb-4">
              Al cargar contenido en AquatechIA, otorgas a AquatechIA una
              licencia mundial, no exclusiva, libre de regalías para usar ese
              contenido.
            </p>
            <p className="text-[#CCCCCC]">Garantizas que tu contenido:</p>
            <ul className="space-y-2 text-[#CCCCCC] ml-4 mt-2">
              <li>✓ No infringe derechos de terceros</li>
              <li>✓ No contiene malware o código malicioso</li>
              <li>✓ Cumple con todas las leyes aplicables</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              7. Limitación de Responsabilidad
            </h2>
            <p className="text-[#CCCCCC] mb-4">
              <strong>DESCARGO DE RESPONSABILIDAD:</strong> La plataforma se
              proporciona "tal cual" sin garantías de ningún tipo.
            </p>
            <p className="text-[#CCCCCC] mb-4">
              En la máxima medida permitida por la ley, AquatechIA no es
              responsable por:
            </p>
            <ul className="space-y-2 text-[#CCCCCC] ml-4">
              <li>• Daños directos, indirectos o consecuentes</li>
              <li>• Pérdida de datos o ingresos</li>
              <li>• Interrupciones del servicio</li>
              <li>• Errores o inexactitudes en el contenido</li>
              <li>• Acceso no autorizado a tus datos</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              8. Indemnización
            </h2>
            <p className="text-[#CCCCCC]">
              Aceptas indemnizar y eximir a AquatechIA de cualquier reclamo,
              pérdida o gasto (incluyendo honorarios legales) resultantes de:
            </p>
            <ul className="space-y-2 text-[#CCCCCC] ml-4 mt-2">
              <li>• Tu incumplimiento de estos términos</li>
              <li>• Tu uso de la plataforma</li>
              <li>• Tu contenido violando derechos de terceros</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              9. Modificación de Servicios
            </h2>
            <p className="text-[#CCCCCC]">
              AquatechIA se reserva el derecho a modificar o discontinuar
              servicios en cualquier momento. Te notificaremos de cambios
              significativos con antelación razonable.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              10. Terminación
            </h2>
            <p className="text-[#CCCCCC]">
              AquatechIA puede terminar tu cuenta si:
            </p>
            <ul className="space-y-2 text-[#CCCCCC] ml-4 mt-2">
              <li>• Incumples estos términos</li>
              <li>• Tu conducta es dañina para otros usuarios</li>
              <li>• Participas en actividades ilegales</li>
            </ul>
            <p className="text-[#CCCCCC] mt-4">
              Puedes cancelar tu cuenta en cualquier momento desde tu perfil.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              11. Ley Aplicable
            </h2>
            <p className="text-[#CCCCCC]">
              Estos términos se rigen por las leyes de Colombia, sin considerar
              conflictos de leyes. Cualquier litigio se resolverá en los
              juzgados de Bogotá.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#0095FF]">
              12. Contacto
            </h2>
            <p className="text-[#CCCCCC] mb-4">
              Para preguntas sobre estos términos:
            </p>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <p className="text-[#CCCCCC]">
                📧 <strong>Email:</strong> legal@aquatechia.com
              </p>
              <p className="text-[#CCCCCC] mt-3">
                🌐 <strong>Sitio web:</strong> https://aquatechia.com
              </p>
              <p className="text-[#CCCCCC] mt-3">
                📍 <strong>Ubicación:</strong> Bogotá, Colombia
              </p>
            </div>
          </section>

          {/* Authoritative References GEO/SEO */}
          <section className="mt-12 pt-8 border-t border-gray-800">
            <AuthoritativeReferences theme="dark" />
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
