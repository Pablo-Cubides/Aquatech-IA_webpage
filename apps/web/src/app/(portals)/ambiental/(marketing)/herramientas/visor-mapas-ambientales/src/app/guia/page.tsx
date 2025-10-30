'use client'

import Link from 'next/link'

export default function GuiaUsoPage() {
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const exampleGeoJSON = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-74.0721, 4.7110]
        },
        "properties": {
          "fecha": "2024-01-15",
          "pais": "Colombia",
          "departamento": "Cundinamarca",
          "ciudad": "Bogotá",
          "estacion": "EST-001",
          "DBO": 25.5,
          "DQO": 45.2,
          "pH": 7.2,
          "conductividad": 285,
          "solidos_totales": 180,
          "alcalinidad": 120,
          "dureza": 95
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-74.0821, 4.7210]
        },
        "properties": {
          "fecha": "2024-01-15",
          "pais": "Colombia",
          "departamento": "Cundinamarca",
          "ciudad": "Bogotá",
          "estacion": "EST-002",
          "DBO": 18.3,
          "DQO": 32.1,
          "pH": 6.9,
          "conductividad": 220,
          "solidos_totales": 140,
          "alcalinidad": 95,
          "dureza": 78
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-74.0621, 4.6910]
        },
        "properties": {
          "fecha": "2024-01-16",
          "pais": "Colombia",
          "departamento": "Cundinamarca",
          "ciudad": "Bogotá",
          "estacion": "EST-003",
          "DBO": 22.1,
          "DQO": 38.7,
          "pH": 7.1,
          "conductividad": 260,
          "solidos_totales": 165,
          "alcalinidad": 110,
          "dureza": 88
        }
      }
    ]
  }

  const exampleCSV = `latitud,longitud,fecha,pais,departamento,ciudad,estacion,DBO,DQO,pH,conductividad,solidos_totales,alcalinidad,dureza
4.7110,-74.0721,2024-01-15,Colombia,Cundinamarca,Bogotá,EST-001,25.5,45.2,7.2,285,180,120,95
4.7210,-74.0821,2024-01-15,Colombia,Cundinamarca,Bogotá,EST-002,18.3,32.1,6.9,220,140,95,78
4.6910,-74.0621,2024-01-16,Colombia,Cundinamarca,Bogotá,EST-003,22.1,38.7,7.1,260,165,110,88
4.7010,-74.0521,2024-01-16,Colombia,Cundinamarca,Bogotá,EST-004,19.8,35.4,7.0,245,152,105,82
4.7310,-74.0921,2024-01-17,Colombia,Cundinamarca,Bogotá,EST-005,27.2,48.9,7.3,295,188,125,98`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Mapa Ambiental</h1>
              <span className="text-gray-400">|</span>
              <h2 className="text-lg text-gray-600">Guía de uso</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="btn-secondary"
              >
                ← Volver al mapa
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="mb-12">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Guía completa de uso - Mapa Ambiental
          </h1>
          <p className="text-lg text-gray-600">
            Aprende cómo cargar, visualizar y gestionar tus datos ambientales de manera efectiva.
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">🚀 Inicio rápido</h2>
          <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 text-sm font-semibold text-white rounded-full bg-primary-600">1</span>
                <div>
                  <p className="font-medium text-gray-900">Inicia sesión</p>
                  <p className="text-gray-600">Usa cualquier email y contraseña para acceder (modo desarrollo)</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 text-sm font-semibold text-white rounded-full bg-primary-600">2</span>
                <div>
                  <p className="font-medium text-gray-900">Sube tus datos</p>
                  <p className="text-gray-600">Haz clic en &ldquo;+ Subir datos&rdquo; y sigue el asistente de 3 pasos</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 text-sm font-semibold text-white rounded-full bg-primary-600">3</span>
                <div>
                  <p className="font-medium text-gray-900">Explora en el mapa</p>
                  <p className="text-gray-600">Selecciona dataset, fecha y usa filtros para visualizar tus datos</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* File Formats */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">📁 Formatos de archivo soportados</h2>
          
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
            {/* GeoJSON */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <span className="mr-3 text-2xl">🗺️</span>
                <h3 className="text-lg font-semibold">GeoJSON</h3>
              </div>
              <p className="mb-4 text-gray-600">
                Formato estándar para datos geoespaciales. Perfecto si ya tienes coordenadas estructuradas.
              </p>
              <button
                onClick={() => downloadFile(JSON.stringify(exampleGeoJSON, null, 2), 'ejemplo_datos_ambientales.geojson', 'application/json')}
                className="w-full text-sm btn-primary"
              >
                📥 Descargar ejemplo
              </button>
            </div>

            {/* CSV */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <span className="mr-3 text-2xl">📊</span>
                <h3 className="text-lg font-semibold">CSV</h3>
              </div>
              <p className="mb-4 text-gray-600">
                Archivo de texto separado por comas. El más común y fácil de crear desde Excel o Google Sheets.
              </p>
              <button
                onClick={() => downloadFile(exampleCSV, 'ejemplo_datos_ambientales.csv', 'text/csv')}
                className="w-full text-sm btn-primary"
              >
                📥 Descargar ejemplo
              </button>
            </div>

            {/* Excel */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <span className="mr-3 text-2xl">📋</span>
                <h3 className="text-lg font-semibold">Excel (.xlsx)</h3>
              </div>
              <p className="mb-4 text-gray-600">
                Archivo de Microsoft Excel. Útil si trabajas con hojas de cálculo complejas.
              </p>
              <button
                onClick={() => alert('Para Excel, descarga el CSV y ábrelo en Excel, luego guárdalo como .xlsx')}
                className="w-full text-sm btn-secondary"
              >
                💡 Ver instrucciones
              </button>
            </div>
          </div>
        </section>

        {/* Required Fields */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">📋 Campos obligatorios</h2>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Campos requeridos</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 mr-3 bg-red-500 rounded-full"></span>
                    <div>
                      <strong>lat/latitud:</strong> Coordenada de latitud (ej: 4.7110)
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 mr-3 bg-red-500 rounded-full"></span>
                    <div>
                      <strong>lon/longitud:</strong> Coordenada de longitud (ej: -74.0721)
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 mr-3 bg-red-500 rounded-full"></span>
                    <div>
                      <strong>fecha:</strong> Fecha en formato YYYY-MM-DD (ej: 2024-01-15)
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 mr-3 bg-red-500 rounded-full"></span>
                    <div>
                      <strong>pais:</strong> Nombre del país (ej: Colombia)
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 mr-3 bg-red-500 rounded-full"></span>
                    <div>
                      <strong>departamento:</strong> Departamento/Estado (ej: Cundinamarca)
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 mr-3 bg-red-500 rounded-full"></span>
                    <div>
                      <strong>ciudad:</strong> Ciudad/Municipio (ej: Bogotá)
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Parámetros opcionales</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 mr-3 bg-green-500 rounded-full"></span>
                    <div>
                      <strong>DBO:</strong> Demanda Bioquímica de Oxígeno (mg/L)
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 mr-3 bg-green-500 rounded-full"></span>
                    <div>
                      <strong>DQO:</strong> Demanda Química de Oxígeno (mg/L)
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 mr-3 bg-green-500 rounded-full"></span>
                    <div>
                      <strong>pH:</strong> Potencial de hidrógeno (unidades)
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 mr-3 bg-green-500 rounded-full"></span>
                    <div>
                      <strong>conductividad:</strong> Conductividad eléctrica (μS/cm)
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 mr-3 bg-green-500 rounded-full"></span>
                    <div>
                      <strong>solidos_totales:</strong> Sólidos totales (mg/L)
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 mr-3 bg-green-500 rounded-full"></span>
                    <div>
                      <strong>alcalinidad:</strong> Alcalinidad total (mg/L)
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 mr-3 bg-green-500 rounded-full"></span>
                    <div>
                      <strong>dureza:</strong> Dureza del agua (mg/L)
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Wizard */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">🔧 Asistente de carga (paso a paso)</h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <span className="flex items-center justify-center w-10 h-10 mr-4 font-bold text-white rounded-full bg-primary-600">1</span>
                <h3 className="text-xl font-semibold">Selección de archivo</h3>
              </div>
              <ul className="space-y-2 text-gray-600 ml-14">
                <li>• Haz clic en &ldquo;Subir datos&rdquo; en la barra superior</li>
                <li>• Arrastra tu archivo o haz clic para seleccionarlo</li>
                <li>• Formatos aceptados: .geojson, .csv, .xlsx</li>
                <li>• Tamaño máximo: 10MB</li>
                <li>• El sistema validará automáticamente el formato</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <span className="flex items-center justify-center w-10 h-10 mr-4 font-bold text-white rounded-full bg-primary-600">2</span>
                <h3 className="text-xl font-semibold">Mapeo de columnas</h3>
              </div>
              <ul className="space-y-2 text-gray-600 ml-14">
                <li>• <strong>Solo para CSV/Excel:</strong> Los archivos GeoJSON saltan este paso</li>
                <li>• Mapea cada campo obligatorio a una columna de tu archivo</li>
                <li>• Selecciona parámetros opcionales que quieras incluir</li>
                <li>• Define las unidades para cada parámetro (ej: mg/L, μS/cm)</li>
                <li>• El sistema mostrará vista previa de los datos</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <span className="flex items-center justify-center w-10 h-10 mr-4 font-bold text-white rounded-full bg-primary-600">3</span>
                <h3 className="text-xl font-semibold">Configuración del dataset</h3>
              </div>
              <ul className="space-y-2 text-gray-600 ml-14">
                <li>• Asigna un nombre descriptivo a tu dataset</li>
                <li>• Añade una descripción opcional</li>
                <li>• Configura límite de puntos por día (opcional)</li>
                <li>• <strong>Acepta la advertencia:</strong> Los datos pueden ser eliminados por un administrador</li>
                <li>• Confirma para crear el dataset</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Map Features */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">🗺️ Funciones del mapa</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Clustering inteligente</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-6 h-6 mr-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Verde: 1-10 puntos</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-6 h-6 mr-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Azul: 10-50 puntos</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-6 h-6 mr-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Naranja: 50-100 puntos</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-6 h-6 mr-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Rojo: 100+ puntos</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Interacciones</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Clic en cluster:</strong> Hacer zoom para expandir</li>
                <li>• <strong>Clic en punto:</strong> Ver detalles en panel derecho</li>
                <li>• <strong>Zoom:</strong> Rueda del mouse o controles</li>
                <li>• <strong>Pan:</strong> Arrastrar el mapa</li>
                <li>• <strong>Filtros:</strong> Panel izquierdo</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">🎛️ Sistema de filtros</h2>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Filtros geográficos</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• <strong>País:</strong> Filtra por país específico</li>
                  <li>• <strong>Departamento:</strong> Se actualiza según país seleccionado</li>
                  <li>• <strong>Ciudad:</strong> Se actualiza según departamento</li>
                  <li>• Los filtros son cascada (dependientes entre sí)</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Filtros por parámetros</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Selecciona qué parámetros mostrar</li>
                  <li>• Solo aparecen los disponibles en el dataset</li>
                  <li>• Se muestran las unidades de cada parámetro</li>
                  <li>• Afecta la visualización en tiempo real</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">💡 Consejos y mejores prácticas</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-6 border border-green-200 rounded-lg bg-green-50">
              <h3 className="mb-3 text-lg font-semibold text-green-900">✅ Hacer</h3>
              <ul className="space-y-2 text-green-800">
                <li>• Usar fechas en formato ISO (YYYY-MM-DD)</li>
                <li>• Incluir coordenadas precisas (6+ decimales)</li>
                <li>• Nombrar datasets de forma descriptiva</li>
                <li>• Verificar datos antes de subir</li>
                <li>• Organizar datos por fechas separadas</li>
              </ul>
            </div>
            
            <div className="p-6 border border-red-200 rounded-lg bg-red-50">
              <h3 className="mb-3 text-lg font-semibold text-red-900">❌ Evitar</h3>
              <ul className="space-y-2 text-red-800">
                <li>• Mezclar diferentes formatos de fecha</li>
                <li>• Usar coordenadas con pocos decimales</li>
                <li>• Subir archivos muy grandes (&gt;10MB)</li>
                <li>• Dejar campos obligatorios vacíos</li>
                <li>• Usar caracteres especiales en nombres</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">❓ Preguntas frecuentes</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md">
              <details className="p-6">
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  ¿Qué formato de coordenadas debo usar?
                </summary>
                <p className="mt-3 text-gray-600">
                  Usa el sistema WGS84 (EPSG:4326) con coordenadas decimales. Por ejemplo: latitud 4.7110, longitud -74.0721. 
                  No uses grados, minutos, segundos.
                </p>
              </details>
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
              <details className="p-6">
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  ¿Puedo editar un dataset después de subirlo?
                </summary>
                <p className="mt-3 text-gray-600">
                  Actualmente no es posible editar datasets. Debes eliminar el dataset existente y subir uno nuevo con los cambios.
                </p>
              </details>
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
              <details className="p-6">
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  ¿Qué pasa si mis datos no tienen todos los parámetros?
                </summary>
                <p className="mt-3 text-gray-600">
                  No hay problema. Solo los campos geográficos y fecha son obligatorios. 
                  Los parámetros ambientales son opcionales y puedes incluir solo los que tengas.
                </p>
              </details>
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
              <details className="p-6">
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  ¿Por qué aparece el aviso de eliminación de datos?
                </summary>
                <p className="mt-3 text-gray-600">
                  Los administradores pueden eliminar datasets para mantener la calidad y espacio del sistema. 
                  Asegúrate de mantener copias de respaldo de tus datos originales.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <div className="p-6 border rounded-lg bg-primary-50 border-primary-200">
            <h2 className="mb-4 text-xl font-semibold text-primary-900">
              📞 ¿Necesitas ayuda adicional?
            </h2>
            <p className="mb-4 text-primary-800">
              Si tienes problemas técnicos o necesitas asistencia personalizada, contáctanos:
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 font-medium bg-white rounded-md text-primary-800">
                📧 soporte@mapa-ambiental.com
              </span>
              <span className="px-4 py-2 font-medium bg-white rounded-md text-primary-800">
                💬 Chat en vivo disponible
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed warning banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-2 text-sm text-center border-t bg-warning-100 border-warning-300 text-warning-800">
        ⚠️ Los datos podrán ser borrados si el administrador lo considera
      </div>
    </div>
  )
}
