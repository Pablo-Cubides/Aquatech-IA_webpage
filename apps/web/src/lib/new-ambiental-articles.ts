// Artículos del Portal Ambiental - 12 artículos nuevos
import type { BlogArticle } from "./blog-articles";

export const NEW_AMBIENTAL_ARTICLES: Record<string, BlogArticle> = {
  // Categoría: Tecnologías Ambientales (Artículos 13, 14, 15)
  "guia-sensores-ambientales-low-cost-arduino": {
    slug: "guia-sensores-ambientales-low-cost-arduino",
    title: "¿Qué sensores de bajo costo sirven realmente para medir agua y aire?",
    category: "Nuevas Tecnologías Ambientales",
    date: "2025-01-03",
    readTime: 14,
    excerpt: "¿Funcionan los sensores de pH de $20? Analizamos la precisión real de sensores low-cost (Arduino/ESP32) para calidad del agua y aire.",
    heroImage: "/images/Portal ambiental/blog/sensores-ambientales-arduino.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "Si buscas en Amazon o AliExpress \"sensor calidad de agua\", encontrarás opciones desde $10 hasta $5,000 USD. ¿Cuál es la diferencia? ¿Sirve un sensor barato para un proyecto de tesis o para monitorear el acueducto de tu vereda? La respuesta corta es: sirven para tendencias, no para certificación legal.",
      sections: [
        {
          id: "precision-low-cost",
          title: "La realidad de la precisión: \"Low-Cost\" no es \"Low-Quality\"",
          content: "Un sensor de pH industrial (marca Hach o YSI) cuesta $1,000 USD porque mantiene la calibración por meses. Un sensor genérico de $30 USD funciona, pero necesita calibración semanal.\n\n**Regla de oro:** Usa sensores low-cost para alertas tempranas (ej. \"el pH bajó de repente\"), no para reportes a la autoridad ambiental.",
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "kit-inicio-agua",
          title: "Lista de Compras: El Kit de Inicio para Agua",
          content: "**Temperatura (DS18B20):** Excelente. Digital, sumergible y preciso (±0.5°C). Costo: $3-8 USD.\n\n**Turbidez (SEN0189):** Bueno para detectar cambios bruscos. Costo: $10-15 USD.\n\n**TDS / Conductividad:** Muy útil para medir sales disueltas. Costo: $5-10 USD.\n\n**pH (Módulo pH-4502C):** El más difícil. Requiere calibración con soluciones buffer. Costo: $15-25 USD.",
          callout: {
            type: "warning",
            title: "Sensor de pH",
            content: "La sonda de pH es frágil y necesita mantenimiento. Solo úsalo si estás dispuesto a calibrar semanalmente.",
          },
        },
        {
          id: "sensores-aire",
          title: "Sensores para Aire: Midiendo lo invisible",
          content: "**El Rey: Plantower PMS5003 o PMS7003**\nUsa láser para contar partículas. Increíblemente preciso para su precio ($20-30 USD). Se usa en redes ciudadanas de monitoreo en Bogotá y Medellín.\n\n**Evita:** Los sensores MQ-135 para medir \"calidad de aire general\". Son muy inestables y reaccionan hasta con el perfume.",
        },
        {
          id: "esp32-cerebro",
          title: "El Cerebro: ¿Arduino o ESP32?",
          content: "Olvida el Arduino UNO clásico. Para 2025, usa el **ESP32**.\n\n**¿Por qué?** Tiene WiFi y Bluetooth integrados. Puedes enviar los datos de tus sensores directamente a internet sin cables extra. Y cuesta casi lo mismo ($5-8 USD).",
          image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "instalacion-campo",
          title: "Cómo instalarlo en campo",
          content: "**Protección (IP65):** Mete la electrónica en una caja eléctrica estanca. La humedad mata los circuitos en 2 días.\n\n**Energía:** Un PowerBank puede alimentar un ESP32 por 24 horas. Para autonomía total, necesitas panel solar (10W).\n\n**Conectividad:** Si no hay WiFi, busca módulos LoRaWAN. Permiten enviar datos a kilómetros de distancia.",
          callout: {
            type: "success",
            title: "Manos a la obra",
            content: "Compra un ESP32 y un sensor DS18B20. Si logras ver la temperatura en tu celular, ya eres parte del 1% de ingenieros que saben de IoT.",
          },
        },
      ],
      conclusion: "Los sensores low-cost son herramientas poderosas para monitoreo ambiental, siempre que entiendas sus limitaciones. Sirven para tendencias y alertas, no para certificación legal. Empieza con temperatura, domina ESP32, y escala desde ahí.",
    },
    tags: ["sensores", "IoT", "Arduino", "ESP32", "calidad del agua", "monitoreo ambiental", "low-cost"],
    nextArticle: {
      slug: "herramientas-software-gratuito-gestion-ambiental",
      title: "Herramientas digitales gratuitas para gestión ambiental",
    },
  },

  "herramientas-software-gratuito-gestion-ambiental": {
    slug: "herramientas-software-gratuito-gestion-ambiental",
    title: "Herramientas digitales gratuitas para gestionar datos ambientales",
    category: "Nuevas Tecnologías Ambientales",
    date: "2025-01-02",
    readTime: 12,
    excerpt: "Deja el Excel básico. Descubre QGIS, Grafana y Google Data Studio para visualizar datos de agua, aire y residuos como un experto.",
    heroImage: "/images/Portal ambiental/blog/software-gestion-ambiental.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "La gestión ambiental moderna produce demasiados datos. Laboratorios en PDF, excels de caudales, reportes de clima... Si sigues gestionando todo esto con archivos sueltos en \"Mis Documentos\", estás perdiendo tiempo valioso. Afortunadamente, las mejores herramientas de análisis de datos hoy en día son gratuitas (Open Source).",
      sections: [
        {
          id: "qgis",
          title: "QGIS: El rey de los mapas (Adiós licencias costosas)",
          content: "Si necesitas hacer un mapa de una cuenca, ubicar puntos de vertimiento o modelar una pluma de contaminación, no necesitas pagar licencias millonarias.\n\n**Qué hace:** Sistemas de Información Geográfica (SIG). Lee casi cualquier formato.\n\n**Caso de uso:** Cargar datos de calidad de agua y crear un \"Mapa de Calor\" para ver visualmente dónde está la contaminación crítica.\n\n**Descarga:** qgis.org",
          image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "grafana",
          title: "Grafana: Dashboards en tiempo real",
          content: "¿Tienes sensores enviando datos? Grafana hace que esos números se vean comprensibles.\n\n**Qué hace:** Visualización de series temporales.\n\n**Caso de uso:** Un tablero en la planta de tratamiento que muestra pH y Turbidez de la última hora, con zonas rojas si se pasan los límites.\n\n**Costo:** Gratis si lo instalas en tu PC/Servidor.",
        },
        {
          id: "looker-studio",
          title: "Google Looker Studio (Antes Data Studio)",
          content: "La forma más rápida de hacer reportes gerenciales automatizados.\n\n**Qué hace:** Conecta tus Google Sheets y las convierte en reportes PDF interactivos.\n\n**Caso de uso:** Google Sheet con caudales diarios → Reporte mensual automático con promedios y máximos listo para el gerente.",
          callout: {
            type: "info",
            title: "Ventaja clave",
            content: "Cualquier cambio en tu Google Sheet se refleja automáticamente en el reporte. Cero trabajo manual mensual.",
          },
        },
        {
          id: "python-pandas",
          title: "Python (Pandas y Matplotlib): Para análisis serio",
          content: "Cuando Excel se bloquea porque tienes 500,000 filas de datos, Python es la salvación.\n\n**Qué hace:** Limpieza de datos, estadística avanzada y automatización.\n\n**Caso de uso:** 10 años de datos del IDEAM con fechas en formatos raros y celdas vacías → Script de 10 líneas que limpia todo en segundos.",
        },
        {
          id: "flujo-recomendado",
          title: "El Flujo de Trabajo Recomendado",
          content: "No uses una sola herramienta. Intégralas:\n\n**1. Recolección:** Google Forms / KoboToolbox / Sensores → Google Sheets\n**2. Limpieza:** Python (si hay mucho dato) o el mismo Google Sheets\n**3. Visualización:** QGIS (para mapas) + Looker Studio (para reportes)",
          callout: {
            type: "success",
            title: "Tu primer Dashboard",
            content: "Toma cualquier Excel con datos ambientales. Súbelo a Google Sheets. Abre Looker Studio, conéctalo y arrastra un gráfico. Acabas de crear tu primer reporte automatizado.",
          },
        },
      ],
      conclusion: "Las herramientas Open Source han democratizado el análisis de datos ambientales. QGIS para mapas, Grafana para tiempo real, Looker Studio para reportes y Python para el análisis pesado. Todo gratis, todo profesional. Tu única inversión es el tiempo de aprender.",
    },
    tags: ["QGIS", "Grafana", "Looker Studio", "Python", "datos ambientales", "Open Source", "visualización"],
    nextArticle: {
      slug: "imagenes-satelitales-gratuitas-monitoreo-agua-bosques",
      title: "Cómo usar imágenes satelitales gratuitas para monitoreo ambiental",
    },
  },

  "imagenes-satelitales-gratuitas-monitoreo-agua-bosques": {
    slug: "imagenes-satelitales-gratuitas-monitoreo-agua-bosques",
    title: "Cómo usar imágenes satelitales gratuitas para evaluar cambios ambientales",
    category: "Nuevas Tecnologías Ambientales",
    date: "2025-01-01",
    readTime: 13,
    excerpt: "Guía de teledetección para no expertos. Aprende a usar Sentinel Hub y Google Earth Engine para ver sequías, deforestación y calidad del agua desde el espacio.",
    heroImage: "/images/Portal ambiental/blog/imagenes-satelitales-monitoreo.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "Antes, ver tu proyecto desde el espacio costaba una fortuna. Hoy, agencias espaciales como la NASA y la ESA regalan terabytes de imágenes cada día. ¿El problema? Pocos saben dónde buscarlas y cómo interpretarlas. Aprenderás a ser un \"detective satelital\" para monitorear cuerpos de agua, cultivos y bosques sin salir de tu oficina.",
      sections: [
        {
          id: "plataformas-gratuitas",
          title: "Las 3 Plataformas Gratuitas que debes conocer",
          content: "**EO Browser (Sentinel Hub):** La más fácil. Como Google Maps, pero con imágenes actualizadas cada 5 días. Puedes ver incendios activos e inundaciones en tiempo real.\n\n**Google Earth Engine (GEE):** La más potente. Requiere código (JavaScript/Python), pero procesa 40 años de historia en segundos.\n\n**Copernicus Data Space:** El repositorio oficial de satélites europeos Sentinel. La mejor calidad gratuita (10 metros por pixel).",
          image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "indices-magicos",
          title: "Índices Mágicos: Viendo lo invisible",
          content: "Los satélites ven más colores que el ojo humano. Usando matemáticas simples, podemos revelar cosas ocultas:\n\n**NDVI (Índice de Vegetación):** ¿Ese bosque está sano o estresado? Útil para reforestación o agricultura.\n\n**NDWI (Índice de Agua):** Para delimitar espejos de agua o mapear zonas inundadas.\n\n**Turbidez y Clorofila:** Sí, se puede estimar la calidad del agua desde el espacio.",
          callout: {
            type: "info",
            title: "El Falso Color",
            content: "Selecciona \"False Color\" en EO Browser. La vegetación se verá roja brillante y el agua negra o azul. ¡Acabas de hacer tu primer análisis de teledetección!",
          },
        },
        {
          id: "caso-humedal",
          title: "Caso de Uso: Monitoreo de un Humedal Urbano",
          content: "Imagina que quieres proteger un humedal en tu ciudad:\n\n1. Entras a EO Browser\n2. Buscas tu humedal\n3. Activas el modo \"NDWI\" (Índice de agua)\n4. Usas \"Time-lapse\" para los últimos 3 años\n\n**Resultado:** Prueba visual irrefutable de cómo la construcción ilegal ha ido rellenando el humedal mes a mes.",
        },
        {
          id: "limitaciones",
          title: "Limitaciones (Para ser realistas)",
          content: "**Nubes:** En el trópico, son el enemigo. Los satélites ópticos no ven a través de ellas. Para eso se usan satélites de Radar (Sentinel-1).\n\n**Resolución:** Gratis obtienes pixeles de 10x10 metros. No vas a ver un carro, pero sí un cultivo, un lago o una cantera.",
          callout: {
            type: "success",
            title: "Tu misión espacial",
            content: "Entra a EO Browser ahora mismo. Busca tu ciudad. Cambia la fecha a un día despejado y selecciona \"False Color\". ¡Acabas de realizar tu primer análisis de teledetección!",
          },
        },
      ],
      conclusion: "La teledetección satelital ya no es exclusiva de expertos. Con plataformas gratuitas como EO Browser y Google Earth Engine, cualquier profesional ambiental puede monitorear bosques, humedales y calidad del agua desde su escritorio. El espacio está a un clic de distancia.",
    },
    tags: ["teledetección", "satélites", "Sentinel Hub", "Google Earth Engine", "NDVI", "monitoreo", "imágenes satelitales"],
    nextArticle: {
      slug: "guia-control-contaminacion-talleres-lavaderos-pymes",
      title: "Control de contaminación para talleres y PYMES",
    },
  },

  // Categoría: Control de Contaminación (Artículos 16, 17, 18)
  "guia-control-contaminacion-talleres-lavaderos-pymes": {
    slug: "guia-control-contaminacion-talleres-lavaderos-pymes",
    title: "Medidas de bajo costo para reducir la contaminación en talleres y pequeñas industrias",
    category: "Control y Tratamiento de Contaminación",
    date: "2024-12-28",
    readTime: 11,
    excerpt: "Evita sanciones ambientales sin quebrar tu negocio. Guía práctica de trampas de grasa, aceites usados y control de vertimientos para talleres y lavaderos en Colombia.",
    heroImage: "/images/Portal ambiental/blog/control-contaminacion-talleres.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "La contaminación en talleres mecánicos, lavaderos de autos y pequeñas industrias es el \"talón de Aquiles\" del cumplimiento ambiental en Latinoamérica. Muchos dueños de negocio creen que tratar el agua cuesta una fortuna, pero aplicar medidas de control no tiene por qué ser costoso. Te mostramos soluciones de \"ingeniería de guerrilla\": baratas, efectivas y que cumplen con la norma.",
      sections: [
        {
          id: "por-que-contaminan",
          title: "¿Por qué los pequeños negocios contaminan tanto?",
          content: "El problema no es siempre la mala fe, es la falta de técnica. Los contaminantes principales son: **grasas, aceites, jabones y sólidos (lodo)**. Si viertes esto directo al alcantarillado, incumples la Resolución 0631 de 2015 y te expones a multas millonarias.",
          image: "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "trampas-grasa",
          title: "Trampas de Grasa: Tu primera línea de defensa",
          content: "No necesitas una planta importada. Una trampa de grasa bien dimensionada puede retener hasta el 70% de las grasas.\n\n**Clave de diseño:** El agua debe enfriarse y aquietarse para que la grasa flote.\n\n**Mantenimiento:** Debes limpiar la capa de grasa flotante cada 7 días. Si no lo haces, la trampa no sirve de nada.",
          callout: {
            type: "warning",
            title: "Error común",
            content: "Instalar la trampa y nunca limpiarla. Una trampa sin mantenimiento es peor que no tener ninguna.",
          },
        },
        {
          id: "limpieza-seco",
          title: "Limpieza en Seco: La técnica gratuita",
          content: "Antes de echar agua con la manguera, **barre**.\n\nRecoger el polvo, las virutas de metal y los derrames de aceite con aserrín o arena antes de lavar el piso reduce la carga contaminante de tu vertimiento en un 50%. Es gratis y ahorra agua.",
        },
        {
          id: "bandejas-retencion",
          title: "Bandejas de Retención (Diques)",
          content: "Nunca almacenes canecas de aceite o químicos directamente en el suelo. Usa bandejas o construye un pequeño muro de contención. Si hay un derrame, se queda en la bandeja y no se va al desagüe.",
        },
        {
          id: "aceite-usado",
          title: "Manejo de Aceite Usado (RESPEL)",
          content: "El aceite de motor quemado es un **Residuo Peligroso**. Nunca lo mezcles con agua, gasolina o basura.\n\n**Obligación:** Debes entregarlo a un gestor autorizado que te dé un certificado.\n\nConsulta el directorio oficial de gestores en la página de MinAmbiente.",
          callout: {
            type: "info",
            title: "Checklist del Taller Sostenible",
            content: "✅ Trampa de grasa instalada y limpia\n✅ Rejillas en desagües\n✅ Kit de derrames visible\n✅ Contrato con gestor de aceite usado\n✅ Jabones biodegradables",
          },
        },
      ],
      conclusion: "Cumplir la norma ambiental no requiere millones. Con trampas de grasa, limpieza en seco, bandejas de retención y manejo correcto de aceites usados, tu taller puede operar legalmente y proteger el ambiente. Revisa tu trampa de grasas hoy mismo.",
    },
    tags: ["talleres", "lavaderos", "PYMES", "trampas de grasa", "aceite usado", "RESPEL", "cumplimiento normativo"],
    nextArticle: {
      slug: "diseno-ptar-rural-colegios-veredas",
      title: "Diseño de sistemas de tratamiento para zonas rurales",
    },
  },

  "diseno-ptar-rural-colegios-veredas": {
    slug: "diseno-ptar-rural-colegios-veredas",
    title: "Cómo diseñar un sistema de tratamiento de aguas residuales para escuelas rurales",
    category: "Control y Tratamiento de Contaminación",
    date: "2024-12-26",
    readTime: 14,
    excerpt: "Guía de diseño de sistemas sépticos para zonas rurales. Aprende a dimensionar Tanque Séptico + Filtro Anaerobio + Humedal para escuelas y comunidades pequeñas.",
    heroImage: "/images/Portal ambiental/blog/ptar-rural-escuelas.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "Llevar saneamiento básico a una escuela rural o una vereda no requiere tecnología de la NASA. De hecho, los sistemas complejos suelen fallar en el campo por falta de electricidad o repuestos. La solución de oro es la biología pasiva: sistemas que funcionan por gravedad y casi sin mantenimiento.",
      sections: [
        {
          id: "esquema-ganador",
          title: "El Esquema Ganador: Tratamiento descentralizado",
          content: "El sistema se compone de tres etapas que imitan a la naturaleza:\n\n**1. Tanque Séptico (El Estómago):** Retiene sólidos y digiere materia orgánica.\n\n**2. Filtro Anaerobio (Los Pulmones):** Piedras donde viven bacterias que \"comen\" la contaminación.\n\n**3. Humedal Subsuperficial (Los Riñones):** Plantas que pulen el agua y remueven nutrientes.",
          image: "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "dimensionamiento",
          title: "Dimensionamiento del Tanque Séptico (Fórmula Rápida)",
          content: "Para un diseño preliminar rápido:\n\n**Fórmula:** Volumen (Litros) = Caudal Diario (Q) × 2 días\n\n**Ejemplo:** Escuela con 100 niños × 30 Litros/día = 3,000 L/día\nVolumen Tanque = 3,000 × 2 = 6,000 Litros (6 m³)\n\n*Nota: Para diseño legal en Colombia, usa la fórmula completa del RAS 2000 (Título J).*",
          callout: {
            type: "info",
            title: "Regla práctica",
            content: "La regla de \"2 días\" de retención es segura para estimaciones preliminares. Para el diseño final, incluye acumulación de lodos.",
          },
        },
        {
          id: "filtro-anaerobio",
          title: "Filtro Anaerobio de Flujo Ascendente (FAFA)",
          content: "Es un tanque lleno de grava o rosetones plásticos. El agua entra por abajo y sube.\n\n**Clave:** Usa grava de río lavada (piedra bola) de 2 a 3 pulgadas. No uses piedra picada con aristas porque se tapona más rápido.\n\n**Mantenimiento:** Lavar el material filtrante cada 1-2 años.",
        },
        {
          id: "humedal-artificial",
          title: "Humedal Artificial (Biofiltro)",
          content: "Una excavación impermeabilizada llena de gravilla donde siembras plantas macrófitas (Papiro o Enea).\n\n**Secreto:** El agua debe ir por debajo de la piedra (subsuperficial). Si el agua se ve arriba, tendrás mosquitos y malos olores.\n\n**Beneficio:** Deja el agua cristalina y se ve como un jardín.",
          image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "errores-fatales",
          title: "Errores que matan el sistema",
          content: "**Cloro en el inodoro:** Echar \"Clorox\" al baño mata las bacterias del tanque séptico. El sistema deja de funcionar y empieza a oler mal.\n\n**Agua lluvia:** Nunca conectes las canales del techo al tanque séptico. El exceso de agua lava las bacterias y colapsa el sistema.",
          callout: {
            type: "success",
            title: "¿Necesitas ayuda con el cálculo?",
            content: "Calcula: Usuarios × 30 Litros × 2 = Volumen mínimo del tanque. Con ese dato ya puedes cotizar un tanque prefabricado.",
          },
        },
      ],
      conclusion: "El saneamiento rural efectivo no requiere tecnología cara. Tanque Séptico + Filtro Anaerobio + Humedal es el combo probado que funciona sin electricidad y con mínimo mantenimiento. La clave está en el dimensionamiento correcto y evitar los errores clásicos.",
    },
    tags: ["PTAR rural", "tanque séptico", "humedal artificial", "saneamiento básico", "escuelas rurales", "filtro anaerobio"],
    nextArticle: {
      slug: "guia-seleccion-tecnologia-tratamiento-aguas-residuales",
      title: "Guía para elegir tecnología de tratamiento de aguas",
    },
  },

  "guia-seleccion-tecnologia-tratamiento-aguas-residuales": {
    slug: "guia-seleccion-tecnologia-tratamiento-aguas-residuales",
    title: "Guía práctica para elegir la tecnología adecuada de tratamiento de aguas residuales",
    category: "Control y Tratamiento de Contaminación",
    date: "2024-12-24",
    readTime: 12,
    excerpt: "¿Lodos activados, MBBR o Tanque Séptico? Descubre qué tecnología de tratamiento elegir según tu caudal, presupuesto y espacio disponible.",
    heroImage: "/images/Portal ambiental/blog/tecnologias-tratamiento-agua.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "Elegir una tecnología de tratamiento de aguas residuales es como comprar un vehículo: no necesitas un camión de carga para ir a la tienda. El error más común en ingeniería ambiental es \"sobre-diseñar\" (sistemas caros que nadie sabe operar) o \"sub-diseñar\" (sistemas baratos que no cumplen la norma). Esta matriz de decisión te ayudará a ubicarte.",
      sections: [
        {
          id: "nivel-1",
          title: "Nivel 1: Tecnologías de Bajo Costo (Caudales < 2 L/s)",
          content: "**Ideal para:** Fincas, Escuelas, Veredas, Hostales pequeños.\n\n**Tecnologías:** Tanque Séptico + Campo de Infiltración, Filtros Anaerobios, Humedales.\n\n**Ventajas:** Cero consumo de energía (funcionan por gravedad), operación simple.\n\n**Desventajas:** Requieren más área en tierra. La calidad del efluente es básica.",
          image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "nivel-2",
          title: "Nivel 2: Tecnologías Compactas (Caudales 2 - 20 L/s)",
          content: "**Ideal para:** Urbanizaciones, Hoteles grandes, Industrias PYME, Municipios pequeños.\n\n**Tecnologías:** Lodos Activados (Aireación extendida), Reactores MBBR, Filtros Percoladores.\n\n**Ventajas:** Ocupan poco espacio. Alta calidad de efluente (cumple Res. 0631 estricta).\n\n**Desventajas:** Consumen electricidad. Requieren operario capacitado.",
        },
        {
          id: "nivel-3",
          title: "Nivel 3: Tecnologías Avanzadas (Caudales > 20 L/s o Reuso)",
          content: "**Ideal para:** Industrias complejas, Municipios grandes, Proyectos de reuso.\n\n**Tecnologías:** MBR (Biorreactores de Membrana), Ósmosis Inversa, Oxidación Avanzada.\n\n**Ventajas:** Agua de calidad casi potable (reuso en riego). Máxima compacidad.\n\n**Desventajas:** CAPEX y OPEX muy altos. Requieren limpieza química y repuestos costosos.",
        },
        {
          id: "matriz-decision",
          title: "Matriz de Decisión Simplificada",
          content: "| Criterio | Mucho terreno | Poco terreno | Poco dinero | Reuso |\n|---|---|---|---|---|\n| **Mejor Opción** | Lagunas/Humedales | Lodos Activados/MBBR | Tanque Séptico | MBR/Membranas |",
          callout: {
            type: "warning",
            title: "El error del \"Copiar y Pegar\"",
            content: "No copies el diseño de la planta del vecino. Una fábrica de quesos tiene agua muy diferente a una de metalmecánica. La caracterización del agua lo es todo.",
          },
        },
        {
          id: "evalua-tu-caso",
          title: "Evalúa tu caso",
          content: "Antes de llamar a un proveedor, responde:\n\n1. **¿Cuál es mi caudal?** (Litros por segundo)\n2. **¿Qué espacio tengo?** (m² disponibles)\n3. **¿Quién va a operar la planta?** (un vigilante o un técnico)\n\nCon esas 3 respuestas, ya sabes en qué nivel de esta guía estás.",
          callout: {
            type: "success",
            title: "Regla de oro",
            content: "La mejor tecnología no es la más cara ni la más nueva. Es la que puedes operar y mantener con los recursos que tienes.",
          },
        },
      ],
      conclusion: "La selección de tecnología de tratamiento es una decisión técnica y económica. Analiza tu caudal, espacio disponible y capacidad operativa antes de invertir. Recuerda: la mejor planta es la que funciona, no la que está en el catálogo.",
    },
    tags: ["PTAR", "lodos activados", "MBBR", "MBR", "selección de tecnología", "tratamiento de aguas", "ingeniería sanitaria"],
    nextArticle: {
      slug: "guia-estructura-plan-manejo-ambiental-pma-ejemplo",
      title: "Cómo estructurar un Plan de Manejo Ambiental (PMA)",
    },
  },

  // Categoría: Gestión Ambiental (Artículos 19, 20, 21)
  "guia-estructura-plan-manejo-ambiental-pma-ejemplo": {
    slug: "guia-estructura-plan-manejo-ambiental-pma-ejemplo",
    title: "Cómo estructurar un Plan de Manejo Ambiental (PMA) paso a paso",
    category: "Gestión Ambiental Empresarial",
    date: "2024-12-22",
    readTime: 13,
    excerpt: "Guía práctica para elaborar un PMA en Colombia. Aprende a diseñar fichas de manejo, indicadores y cronogramas que apruebe la ANLA.",
    heroImage: "/images/Portal ambiental/blog/plan-manejo-ambiental.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "Un Plan de Manejo Ambiental (PMA) no es un requisito burocrático para llenar una carpeta; es el manual de instrucciones para que tu proyecto no destruya su entorno (y para que no te multen). El éxito de un PMA no está en la prosa, sino en la trazabilidad. Debe conectar cada impacto identificado con una medida, un responsable y un presupuesto.",
      sections: [
        {
          id: "que-es-pma",
          title: "¿Qué es realmente un PMA?",
          content: "Es el conjunto de actividades detalladas que, ordenadas en \"Fichas de Manejo\", buscan prevenir, mitigar, corregir o compensar los impactos ambientales de un proyecto.\n\n**La Regla de Oro:** Si no tiene doliente (responsable) y chequera (presupuesto), no es una medida, es un saludo a la bandera.",
          image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "estructura-anla",
          title: "La Estructura \"A prueba de balas\" (Metodología ANLA)",
          content: "Para que tu PMA sea aprobado por una autoridad (CAR o ANLA), debe seguir esta lógica:\n\n**Programa:** El tema macro (ej. \"Manejo de Agua\")\n**Proyecto:** La subcategoría (ej. \"Tratamiento de Vertimientos\")\n**Medida (La Ficha):** La acción específica",
        },
        {
          id: "ejemplo-ficha",
          title: "Ejemplo Práctico: Ficha de Control de Polvo en Obra",
          content: "Copia esta estructura para tus fichas:\n\n**Objetivo:** Reducir la emisión de material particulado por movimiento de tierras.\n\n**Impacto a controlar:** Alteración de la calidad del aire.\n\n**Tipo de Medida:** Prevención y Mitigación.\n\n**Acciones:**\n• Riego de vías destapadas con carrotanque 3 veces/día\n• Instalación de polisombra perimetral de 2.5 metros\n• Lavado de llantas de volquetas antes de salir\n\n**Indicador:** (# riegos ejecutados / # riegos programados) × 100\n\n**Registro:** Formato de control diario de carrotanque.",
          callout: {
            type: "info",
            title: "Formato de indicador",
            content: "Los indicadores deben ser numéricos y verificables. \"Mejorar el aire\" NO es un indicador. \"PM10 < 75 µg/m³\" SÍ lo es.",
          },
        },
        {
          id: "errores-devuelven",
          title: "Errores que devuelven expedientes",
          content: "**Verbos vagos:** Evita \"propender\", \"tratar de\", \"concientizar\". Usa verbos ejecutables: \"Instalar\", \"Construir\", \"Capacitar\".\n\n**Indicadores de papel:** Poner como indicador \"Calidad del aire mejorada\" es incorrecto.\n\n**Presupuesto global:** No digas \"Global: $10 millones\". Desglosa: \"Alquiler carrotanque: $X/hora\".",
          callout: {
            type: "success",
            title: "Tu primera ficha",
            content: "Toma el impacto más obvio de tu proyecto actual y redáctale 3 acciones concretas con costo unitario. Esa es la base de tu PMA.",
          },
        },
      ],
      conclusion: "Un PMA bien estructurado es tu mejor defensa ante la autoridad ambiental y tu guía operativa en campo. Cada ficha debe tener objetivo claro, acciones ejecutables, indicador numérico, responsable y presupuesto. Sin esos 5 elementos, no tienes un plan; tienes un documento.",
    },
    tags: ["PMA", "Plan de Manejo Ambiental", "ANLA", "licenciamiento", "fichas de manejo", "indicadores ambientales"],
    nextArticle: {
      slug: "programa-seguimiento-monitoreo-ambiental-indicadores",
      title: "Programa de seguimiento y monitoreo ambiental efectivo",
    },
  },

  "programa-seguimiento-monitoreo-ambiental-indicadores": {
    slug: "programa-seguimiento-monitoreo-ambiental-indicadores",
    title: "Qué debe incluir un programa de seguimiento y monitoreo ambiental efectivo",
    category: "Gestión Ambiental Empresarial",
    date: "2024-12-20",
    readTime: 11,
    excerpt: "¿Qué medir y cada cuánto? Guía de indicadores de calidad de agua, aire y ruido para programas de monitoreo según normativa colombiana.",
    heroImage: "/images/Portal ambiental/blog/monitoreo-ambiental-laboratorio.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "Un programa de seguimiento no es una tabla de datos para guardar en un cajón. Es el \"tablero de control\" de tu proyecto. Si el ingeniero civil mira el cronograma de obra, el ingeniero ambiental mira los resultados de laboratorio. Saber qué medir, con qué frecuencia y contra qué norma comparar es lo que diferencia a un profesional operativo de uno estratégico.",
      sections: [
        {
          id: "matriz-monitoreo",
          title: "La Matriz de Monitoreo Obligatoria",
          content: "Debes tener una matriz clara que responda: **¿Qué? ¿Dónde? ¿Cada cuánto?**",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "componente-agua",
          title: "Componente Agua (Vertimientos)",
          content: "**Norma:** Resolución 0631 de 2015.\n\n**Parámetros Clave:** pH, DQO, DBO5, Sólidos Suspendidos (SST), Grasas y Aceites.\n\n**Frecuencia Típica:** Mensual o Trimestral (según tu licencia ambiental).\n\n**Error Común:** Medir solo a la salida. *Tip: Mide también a la entrada (afluente) para calcular eficiencia de remoción.*",
        },
        {
          id: "componente-aire",
          title: "Componente Aire y Ruido",
          content: "**Norma:** Resolución 2254 de 2017 (Aire) y 0627 de 2006 (Ruido).\n\n**Parámetros:** PM10, PM2.5 (polvo fino) y Decibeles (dB).\n\n**Frecuencia:** En obras constructivas, suele ser trimestral. En industrias fijas, puede requerir monitoreo continuo (CEMS) o isocinético anual.",
          callout: {
            type: "warning",
            title: "Laboratorios acreditados",
            content: "Solo laboratorios acreditados por el IDEAM pueden hacer monitoreos válidos legalmente. Exige siempre el Acta de Toma de Muestra con cadena de custodia.",
          },
        },
        {
          id: "cadena-custodia",
          title: "La Cadena de Custodia: Tu seguro de vida",
          content: "El dato del laboratorio no vale nada si la muestra se tomó mal.\n\n**Regla:** Solo laboratorios acreditados por el IDEAM pueden hacer monitoreos válidos legalmente.\n\n**El Papelito Sagrado:** Exige siempre el \"Acta de Toma de Muestra\" con cadena de custodia. Si la autoridad cuestiona un resultado, ese papel demuestra que la muestra no fue alterada.",
        },
        {
          id: "informe-ica",
          title: "Cómo presentar un Informe de Cumplimiento Ambiental (ICA)",
          content: "Cuando envíes los datos a la autoridad:\n\n• **No mandes solo los PDFs del laboratorio**\n• Haz gráficas de tendencia (Excel). ¿El DBO está subiendo mes a mes? Explica por qué.\n• Calcula la **carga contaminante** (Caudal × Concentración). Es lo que se usa para pagar la Tasa Retributiva.",
          callout: {
            type: "success",
            title: "Revisa tu última caracterización",
            content: "Busca el último análisis de agua de tu empresa. Compara \"Grasas y Aceites\" con la Res. 0631. ¿Estás por encima? Revisa la trampa de grasas hoy.",
          },
        },
      ],
      conclusion: "El monitoreo ambiental es tu evidencia de cumplimiento. Una matriz clara, laboratorios acreditados, cadena de custodia y análisis de tendencias son los pilares de un programa efectivo. No esperes a que la autoridad te visite; monitorea proactivamente.",
    },
    tags: ["monitoreo ambiental", "ICA", "Resolución 0631", "laboratorio", "cadena de custodia", "IDEAM", "indicadores"],
    nextArticle: {
      slug: "guia-elaboracion-estudio-impacto-ambiental-eia-colombia",
      title: "Cómo elaborar un Estudio de Impacto Ambiental (EIA) sólido",
    },
  },

  "guia-elaboracion-estudio-impacto-ambiental-eia-colombia": {
    slug: "guia-elaboracion-estudio-impacto-ambiental-eia-colombia",
    title: "Cómo elaborar un Estudio de Impacto Ambiental (EIA) sólido: claves para la licencia",
    category: "Gestión Ambiental Empresarial",
    date: "2024-12-18",
    readTime: 15,
    excerpt: "Evita que la ANLA te devuelva el estudio. Claves para elaborar Línea Base, Zonificación y Evaluación de Impactos según la Metodología General 2018.",
    heroImage: "/images/Portal ambiental/blog/estudio-impacto-ambiental.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "El Estudio de Impacto Ambiental (EIA) es el documento técnico más complejo de la ingeniería ambiental. Es la llave que abre (o cierra) la puerta a grandes proyectos de infraestructura, minería o energía. Un buen EIA no se mide por su peso en kilos, sino por la coherencia entre la realidad del terreno y las medidas propuestas.",
      sections: [
        {
          id: "marco-legal",
          title: "El Marco Legal (La Biblia del EIA)",
          content: "En Colombia, no puedes improvisar. Debes seguir dos documentos sagrados:\n\n**Términos de Referencia (TdR):** Específicos para tu sector (ej. TdR para Vías, TdR para Minería). Descárgalos de la página de la ANLA.\n\n**Metodología General 2018:** Es el manual de \"cómo hacerlo\".",
          image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "linea-base",
          title: "Pilar 1: La Línea Base (La Foto Actual)",
          content: "Debes describir cómo está el territorio antes de que llegue el proyecto.\n\n**El error:** Copiar y pegar información secundaria de libros viejos.\n\n**La solución:** Tienes que ir a campo. Inventarios forestales reales al 100%, monitoreos de agua recientes y censo social puerta a puerta.",
        },
        {
          id: "evaluacion-impactos",
          title: "Pilar 2: La Evaluación de Impactos (La Predicción)",
          content: "¿Qué va a pasar cuando empiece la obra?\n\n• Usa metodologías reconocidas como **Conesa Simplificado** o **Leopold**\n• Evalúa: Intensidad, Extensión, Duración y Reversibilidad\n\n**Tip:** No subestimes los impactos. Si dices que talar 100 hectáreas tiene impacto \"bajo\", la autoridad desconfiará de todo el estudio.",
          callout: {
            type: "warning",
            title: "Error crítico",
            content: "Subestimar impactos para que \"se vea bien\" el proyecto. La autoridad detecta esto y pierde confianza en todo el EIA.",
          },
        },
        {
          id: "zonificacion",
          title: "Pilar 3: La Zonificación de Manejo (El Mapa Final)",
          content: "El resultado del EIA es un mapa de semáforo:\n\n**Áreas de Intervención (Verde):** Donde puedes construir.\n**Áreas de Restricción (Amarillo):** Puedes construir con condiciones especiales.\n**Áreas de Exclusión (Rojo):** NO puedes tocar (nacimientos de agua, zonas sagradas, bosques protegidos).",
        },
        {
          id: "por-que-devuelven",
          title: "¿Por qué devuelven los EIAs?",
          content: "La ANLA suele suspender trámites por:\n\n• Inconsistencia en el área de influencia (el mapa físico no coincide con el biótico)\n• Falta de participación ciudadana real (no socializaste bien con las comunidades)\n• Modelo de almacenamiento geográfico (GDB) con errores de topología",
          callout: {
            type: "success",
            title: "Diagnóstico Rápido",
            content: "Superpone tu trazado sobre el mapa de \"Ecosistemas Estratégicos\" del SIAC o el RUNAP. Si tocas un área roja, detente. Replantea el diseño antes de gastar en el EIA.",
          },
        },
      ],
      conclusion: "Un EIA sólido requiere trabajo de campo real, metodologías reconocidas y coherencia entre todos sus componentes. Los tres pilares —Línea Base, Evaluación de Impactos y Zonificación— deben contar una historia consistente. El atajo de copiar y pegar siempre termina en devolución.",
    },
    tags: ["EIA", "Estudio de Impacto Ambiental", "ANLA", "licencia ambiental", "línea base", "zonificación", "Metodología General"],
    nextArticle: {
      slug: "checklist-requisitos-licencias-permisos-ambientales",
      title: "Checklist de requisitos para licencias y permisos ambientales",
    },
  },

  // Categoría: Normatividad Ambiental (Artículos 22, 23, 24)
  "checklist-requisitos-licencias-permisos-ambientales": {
    slug: "checklist-requisitos-licencias-permisos-ambientales",
    title: "Requisitos ambientales clave para obtener licencias y permisos: checklist práctico 2025",
    category: "Normatividad Ambiental",
    date: "2024-12-16",
    readTime: 12,
    excerpt: "Checklist definitivo para trámites ambientales en Colombia. Qué estudios necesitas para Licencia Ambiental (ANLA/CAR), Permiso de Vertimientos y Concesión de Aguas.",
    heroImage: "/images/Portal ambiental/blog/licencias-permisos-ambientales.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "Enfrentarse a la ventanilla de la autoridad ambiental suele generar ansiedad. ¿Me falta un papel? ¿El estudio está completo? Los requisitos ambientales no son sugerencias; son obligaciones que bloquean o habilitan tu proyecto. Aquí convertimos la complejidad del Decreto 1076 de 2015 en una lista de chequeo operativa.",
      sections: [
        {
          id: "paso-0",
          title: "Paso 0: ¿Qué trámite necesito realmente?",
          content: "No gastes dinero en estudios que no te piden. Clasifica tu necesidad:\n\n**Licencia Ambiental:** Para proyectos grandes (minería, vías, rellenos sanitarios). Es integral (cubre todo).\n\n**Permisos Menores (Sectoriales):** Para proyectos de bajo impacto. Se piden por separado (agua, aire, suelo).",
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "checklist-licencia",
          title: "Checklist 1: Licencia Ambiental (El \"Grand Slam\")",
          content: "Si tu proyecto está listado en el Decreto 1076, necesitas:\n\n☐ **DAA** (Diagnóstico Ambiental de Alternativas): Solo si la autoridad lo exige para elegir trazados.\n☐ **EIA** (Estudio de Impacto Ambiental): El documento maestro. Metodología General 2018.\n☐ **Certificados de No Presencia:** MinInterior (Comunidades étnicas) e INCODER (Resguardos).\n☐ **Plan de Contingencia:** Aprobado por la autoridad de riesgos.\n☐ **Pago de Evaluación:** Autoliquidación en VITAL (ANLA) o ventanilla (CAR).",
          callout: {
            type: "info",
            title: "Fuente oficial",
            content: "Consulta todos los requisitos actualizados en: anla.gov.co/tramites-y-servicios/licencias-ambientales",
          },
        },
        {
          id: "checklist-vertimientos",
          title: "Checklist 2: Permiso de Vertimientos (Res. 0631)",
          content: "Para industrias, PTARs municipales o comercios que descargan agua:\n\n☐ **Caracterización de Vertimientos:** Análisis de laboratorio certificado (IDEAM).\n☐ **Memoria Técnica:** Planos y diseño de la planta de tratamiento (PTAR).\n☐ **Evaluación Ambiental del Vertimiento:** ¿El río aguanta tu descarga?\n☐ **Plan de Gestión del Riesgo:** ¿Qué pasa si la planta falla?",
        },
        {
          id: "checklist-aguas",
          title: "Checklist 3: Concesión de Aguas (Captación)",
          content: "Si tomas agua de río o pozo subterráneo:\n\n☐ **Censo de Usuarios:** ¿Quién más usa el agua aguas abajo?\n☐ **Aforo de la Fuente:** Medición de caudal en verano (estiaje).\n☐ **Programa de Uso Eficiente (PUEAA):** Obligatorio según Ley 373 de 1997.",
        },
        {
          id: "error-administrativo",
          title: "El Error Administrativo #1",
          content: "**Radicar sin verificar la competencia.**\n\n• ¿Tu proyecto es de > 10,000 barriles de petróleo? Va a la ANLA.\n• ¿Es una granja avícola local? Va a la CAR regional.\n\nSi radicas en la ventanilla equivocada, perderás 2 meses mientras trasladan el expediente.",
          callout: {
            type: "success",
            title: "Auditoría Express",
            content: "¿Tienes el Certificado de Libertad y Tradición del predio con menos de 3 meses de expedición? Si no, tu trámite será rechazado en la primera semana. Actualízalo hoy.",
          },
        },
      ],
      conclusion: "Los trámites ambientales son predecibles si conoces las reglas. Usa estos checklists para preparar tu radicación sin sorpresas. El papel que falta siempre es el que más tiempo toma conseguir; anticípate.",
    },
    tags: ["licencia ambiental", "permisos", "trámites", "ANLA", "CAR", "Decreto 1076", "checklist"],
    nextArticle: {
      slug: "errores-comunes-interpretacion-normatividad-ambiental-colombia",
      title: "Errores comunes al interpretar la normatividad ambiental",
    },
  },

  "errores-comunes-interpretacion-normatividad-ambiental-colombia": {
    slug: "errores-comunes-interpretacion-normatividad-ambiental-colombia",
    title: "Errores más comunes al interpretar la normatividad ambiental y cómo evitarlos",
    category: "Normatividad Ambiental",
    date: "2024-12-14",
    readTime: 10,
    excerpt: "No confundas agua potable con residual. Aprende a evitar los 5 errores de interpretación normativa más costosos en ingeniería ambiental.",
    heroImage: "/images/Portal ambiental/blog/errores-normatividad-ambiental.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "La ingeniería ambiental es 50% técnica y 50% legal. Un error de interpretación en una tabla de una resolución puede costarle a tu cliente una PTAR sobredimensionada o una multa impagable. Hemos recopilado los \"falsos amigos\" más comunes en la legislación colombiana para que no caigas en la trampa.",
      sections: [
        {
          id: "error-1",
          title: "Error 1: Confundir la Res. 2115 con la Res. 0631",
          content: "Este es el clásico error de novato.\n\n**El Error:** Usar los límites de agua potable (Res. 2115) para diseñar una planta de aguas residuales.\n\n**La Realidad:**\n• Res. 2115 (2007): Es para agua que vas a *beber* (límites muy estrictos).\n• Res. 0631 (2015): Es para agua que vas a *botar al río* (límites más laxos).\n\n**Consecuencia:** Si diseñas una PTAR para cumplir la 2115, gastarás 10 veces más dinero del necesario.",
          callout: {
            type: "warning",
            title: "Cuidado",
            content: "Turbiedad para agua potable: < 2 UNT\nSST para vertimiento: < 90 mg/L\n¡Son normas completamente diferentes!",
          },
        },
        {
          id: "error-2",
          title: "Error 2: \"Mi sector no aparece en la norma\"",
          content: "**El Error:** Buscar tu industria específica en la Res. 0631, no encontrarla, y pensar que no debes cumplir nada.\n\n**La Realidad:** Si tu actividad no está en los listados específicos (Art. 9 al 16), caes automáticamente en el **Artículo 17 (Otros sectores)**. Nadie se salva.",
        },
        {
          id: "error-3",
          title: "Error 3: Caudal Medio vs. Caudal Máximo",
          content: "**El Error:** Diseñar permisos con el caudal promedio del mes.\n\n**La Realidad:** Las autoridades suelen exigir el diseño basado en el **Caudal Máximo Horario (Qmh)** o diario.\n\n**Por qué:** La contaminación no pide permiso para salir promedio. Si tienes un pico a las 10 AM, tu planta y tu permiso deben cubrir ese pico.",
        },
        {
          id: "error-4",
          title: "Error 4: Ignorar los \"Parámetros de Análisis y Reporte\"",
          content: "En la Res. 0631, hay columnas de \"Límite Permisible\" y otras de \"Análisis y Reporte\".\n\n**El Error:** No medir los de \"Análisis y Reporte\" porque \"no tienen límite\".\n\n**La Realidad:** Es obligatorio medirlos. Si no los reportas en el ICA, la autoridad te sanciona por **ocultamiento de información**, aunque no tengan un tope numérico.",
        },
        {
          id: "error-5",
          title: "Error 5: Usar normas derogadas (El Decreto 1594)",
          content: "Aunque usted no lo crea, todavía llegan estudios citando el Decreto 1594 de 1984 para vertimientos.\n\n**Estado:** Derogado en un 90%.\n\n**Vigente:** Solo artículos puntuales sobre usos del agua. Para todo lo demás, usa el **Decreto 1076 de 2015**.",
          callout: {
            type: "success",
            title: "Revisa tus tablas",
            content: "Abre tu último informe de laboratorio. Verifica el encabezado de la norma de comparación. ¿Dice Resolución 0631 de 2015? Si dice otra cosa, llama al laboratorio.",
          },
        },
      ],
      conclusion: "La normatividad ambiental colombiana es extensa pero lógica. Los errores más costosos vienen de confundir normas (potable vs residual), ignorar artículos \"catch-all\" y usar documentos derogados. Verificar la fuente normativa correcta antes de diseñar te ahorra dinero y dolores de cabeza.",
    },
    tags: ["normatividad", "Resolución 0631", "Resolución 2115", "errores comunes", "interpretación legal", "Decreto 1076"],
    nextArticle: {
      slug: "guia-jerarquia-normativa-ambiental-colombia",
      title: "Cómo elegir la norma ambiental correcta para tu proyecto",
    },
  },

  "guia-jerarquia-normativa-ambiental-colombia": {
    slug: "guia-jerarquia-normativa-ambiental-colombia",
    title: "Cómo elegir la norma ambiental correcta para tu proyecto sin perderse en el laberinto legal",
    category: "Normatividad Ambiental",
    date: "2024-12-12",
    readTime: 11,
    excerpt: "¿Aplica la norma nacional o la distrital? Guía definitiva sobre jerarquía normativa ambiental en Colombia. Aprende cuándo prevalece la norma más estricta.",
    heroImage: "/images/Portal ambiental/blog/jerarquia-normativa-ambiental.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "En Colombia, puedes tener una norma nacional, una departamental y una municipal sobre el mismo tema (ej. Ruido). ¿Cuál aplicas? Si eliges la más laxa, te sancionan. Si eliges la más estricta sin necesidad, pierdes dinero. Aquí te enseñamos el criterio de \"Rigor Subsidiario\" para que siempre elijas la norma correcta.",
      sections: [
        {
          id: "piramide-kelsen",
          title: "La Pirámide de Kelsen Ambiental (Versión Ingeniero)",
          content: "El orden de mando es claro, pero tiene un truco llamado **Rigor Subsidiario**:\n\n**Nivel Nacional (MinAmbiente):** Fija los mínimos obligatorios para todo el país. (Ej. Res. 0631). Nadie puede ser más laxo.\n\n**Nivel Regional (CARs):** Pueden hacer la norma más estricta, nunca más laxa. (Ej. La CAR Cundinamarca puede exigir DBO < 50 mg/L, aunque la nacional diga 90 mg/L).\n\n**Nivel Local (Alcaldía/Secretaría):** Regulan temas urbanos (Ruido, RCD, Publicidad).",
          image: "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "regla-oro",
          title: "La Regla de Oro: \"Prevalece la más Restrictiva\"",
          content: "Si tienes dudas, aplica esta lógica:\n\nSi la Secretaría de Ambiente de Bogotá pide un límite de Grasas de **30 mg/L**, y la norma nacional pide **50 mg/L**... **Aplicas 30 mg/L**.\n\nLa autoridad local conoce la fragilidad de su ecosistema mejor que el Ministerio. Por ley, sus exigencias endurecidas tienen prioridad legal.",
          callout: {
            type: "info",
            title: "Rigor Subsidiario",
            content: "Las autoridades regionales y locales SOLO pueden ser más estrictas que la norma nacional, nunca más laxas. Esto se llama \"Rigor Subsidiario\".",
          },
        },
        {
          id: "casos-practicos",
          title: "Casos Prácticos por Recurso",
          content: "**1. Residuos de Construcción (RCD)**\n• Norma Nacional: Res. 0472 de 2017\n• Norma Bogotá: Res. 1115 de 2012 (Más estricta)\n→ Si construyes en Bogotá, debes cumplir la 1115 y registrarte en el aplicativo local.\n\n**2. Ruido Ambiental**\n• Norma Nacional: Res. 0627 de 2006\n• Muchos municipios tienen mapas de ruido que re-clasifican zonas. Un área \"Comercial\" en el mapa nacional podría ser \"Residencial Mixta\" en el POT local, bajando el límite de 70 dB a 65 dB.\n\n*Consejo: Revisa siempre el POT del municipio.*",
        },
        {
          id: "como-investigar",
          title: "Cómo investigar antes de diseñar",
          content: "No te quedes con Google.\n\n1. Entra a la página de la CAR de tu jurisdicción (ej. Cornare, CDMB, CVC)\n2. Busca la sección \"Normatividad\" o \"Determinantes Ambientales\"\n3. Busca **acuerdos del Consejo Directivo** sobre \"Objetivos de Calidad del Río\"\n\nEsos documentos escondidos suelen tener los límites reales que te van a exigir.",
          callout: {
            type: "success",
            title: "El ejercicio de los 5 minutos",
            content: "Busca en Google \"Objetivos de calidad del agua [nombre de tu cuenca]\". Si encuentras un Acuerdo de la CAR, descárgalo. Es probable que los límites ahí sean más estrictos que la Resolución 0631.",
          },
        },
      ],
      conclusion: "El laberinto normativo ambiental colombiano tiene lógica: la norma local más estricta siempre prevalece. Antes de diseñar o cotizar, investiga qué CAR tiene jurisdicción y busca sus acuerdos específicos. Esos 5 minutos de investigación pueden ahorrarte millones en rediseños.",
    },
    tags: ["jerarquía normativa", "rigor subsidiario", "CAR", "normatividad local", "POT", "derecho ambiental", "Colombia"],
    nextArticle: {
      slug: "desafio-agua-america-latina-rural-estadisticas",
      title: "El desafío del agua en la América Latina rural: estadísticas de una brecha urgente",
    },
  },

  // Categoría: Gestión Comunitaria del Agua (Artículos generados con IA - NotebookLM)
  "desafio-agua-america-latina-rural-estadisticas": {
    slug: "desafio-agua-america-latina-rural-estadisticas",
    title: "El Desafío del Agua en la América Latina Rural: Estadísticas de una Brecha Urgente",
    category: "Gestión Comunitaria del Agua",
    date: "2025-04-02",
    readTime: 10,
    excerpt:
      "161 millones de personas carecen de agua potable segura en Latinoamérica. Analizamos las cifras de la CEPAL que revelan la magnitud de una crisis hídrica que golpea desproporcionadamente a las zonas rurales y a los hogares más pobres.",
    heroImage:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction:
        "El agua no es una mercancía: es un bien público vital y un pilar fundamental de la soberanía sanitaria y productiva. El acceso al agua potable y al saneamiento es un derecho humano reconocido desde 2010; sin embargo, su cumplimiento efectivo sigue siendo una asignatura pendiente en América Latina y el Caribe. En una región que atraviesa una \"nueva década perdida\" (2014-2023) con un crecimiento económico exiguo del 0,9%, el agua emerge como un cuello de botella para el desarrollo inclusivo.",
      sections: [
        {
          id: "brecha-rural-cifras",
          title: "La Brecha Rural en Cifras: Millones que se Quedan Atrás",
          content:
            "Los datos revelan que el progreso hacia el ODS 6 (Agua limpia y saneamiento) es alarmantemente insuficiente, con una brecha que se ensancha drásticamente en las zonas rurales:\n\n**161 millones de personas** (25% de la población) carecen de acceso a agua potable gestionada de forma segura.\n\n**431 millones de personas** (66% de la población regional) no cuentan con saneamiento gestionado de forma segura.\n\n**24 millones de personas** en el ámbito rural carecen incluso de instalaciones básicas para el lavado de manos, una carencia crítica para la salud pública.",
          image:
            "https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?auto=format&fit=crop&w=1200&q=80",
          callout: {
            type: "warning",
            title: "Off-track en el ODS 6",
            content:
              "Al ritmo actual de avance, la región no logrará universalizar el acceso al agua segura antes de 2030. Se requiere una aceleración de inversiones sin precedentes.",
          },
        },
        {
          id: "inequidad-regresividad",
          title: "Inequidad y Regresividad: El Costo de la Pobreza Hídrica",
          content:
            "La gestión actual evidencia una alta **regresividad tarifaria**: los sectores de menores ingresos destinan una proporción significativamente mayor de sus recursos al abastecimiento de agua.\n\n**Quintil 1 (más pobre):** 25% menos de acceso a agua gestionada de forma segura y paga hasta **2 veces más** de su ingreso en el servicio.\n\n**Quintil 5 (más rico):** Cobertura significativamente superior con menor impacto relativo en el gasto del hogar.\n\nEsta inequidad profundiza el ciclo de pobreza: quienes menos tienen pagan más por un bien que debería ser garantizado por el Estado.",
        },
        {
          id: "infraestructura-contaminacion",
          title: "Infraestructura y Contaminación: Un Panorama Crítico",
          content:
            "La infraestructura hídrica regional padece un deterioro estructural que compromete la sostenibilidad del recurso:\n\n**Pérdidas del 60%:** Debido a redes deterioradas, más de la mitad del agua captada se pierde antes de llegar a los usuarios.\n\n**Bajo nivel de tratamiento:** Solo el **42% de las aguas residuales** domésticas son tratadas de manera segura, concentrándose en zonas urbanas y dejando las cuencas rurales expuestas a contaminación sistemática.\n\n**Conflictividad en aumento:** La escasez hídrica ha cuadruplicado los conflictos por el agua iniciados entre 2000 y 2019, comparado con la década de los 80.",
          callout: {
            type: "info",
            title: "El Nexo Agua-Energía-Alimentación",
            content:
              "El sector agrícola representa el 71% de la extracción de agua en la región, pero los niveles de eficiencia en ALC son inferiores al promedio mundial. La mala gestión hídrica impacta directamente la seguridad alimentaria rural.",
          },
        },
        {
          id: "cambio-climatico-agua-dulce",
          title: "El Impacto del Cambio Climático en los Ecosistemas de Agua Dulce",
          content:
            "El cambio climático amplifica las ineficiencias de gestión preexistentes con consecuencias ya visibles y cuantificables:\n\n**7,000 km²** de superficies de agua dulce desaparecidas en Sudamérica entre 2005 y 2018 — equivalente a cuatro veces el tamaño de São Paulo.\n\n**7,282 km²** de nieves permanentes y glaciares perdidos, reservas críticas de agua dulce para millones de personas en los Andes y regiones montañosas.\n\nEstas pérdidas no son proyecciones futuras: son la realidad presente que ya está afectando la disponibilidad del recurso para comunidades rurales en países como Perú, Bolivia, Colombia y Ecuador.",
          image:
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "propuesta-inversion",
          title: "Hacia una Transición Hídrica Inclusiva: La Propuesta de Inversión",
          content:
            "Para salir del estado de \"off track\" en el que se encuentra la región respecto a las metas del ODS 6, la CEPAL propone un impulso inversor estratégico:\n\n**Inversión requerida:** 1.3% del PIB regional anual durante 10 años para universalizar el acceso al agua y saneamiento gestionado de forma segura.\n\n**Retorno social:** 3.6 millones de empleos directos anuales, hasta 3.8 millones de empleos verdes, mayor resiliencia climática y reducción de la carga de cuidados en el hogar.\n\nEl instrumento clave propuesto es la **Red y Observatorio para la Sostenibilidad del Agua (ROSA)**, diseñada para proveer información oportuna, confiable y estandarizada para una gobernanza efectiva del recurso.",
          callout: {
            type: "success",
            title: "Agua como Motor Económico",
            content:
              "Invertir en agua no es un gasto social: es el motor de la recuperación económica. Cada peso invertido en agua segura retorna en productividad, salud pública y reducción del gasto sanitario.",
          },
        },
      ],
      conclusion:
        "Cerrar la brecha rural hídrica exige una transformación profunda de la gobernanza. Es imperativo fortalecer a los prestadores comunitarios (juntas de agua y cooperativas) y elevar la jerarquía política de las autoridades del agua. La Agenda Regional de Acción Hídrica, adoptada en 2023, traza el camino. El reto es la voluntad política y la inversión para recorrerlo.",
    },
    tags: [
      "agua rural",
      "ODS 6",
      "CEPAL",
      "saneamiento",
      "América Latina",
      "brecha hídrica",
      "cambio climático",
      "pobreza hídrica",
    ],
    nextArticle: {
      slug: "gestion-comunitaria-agua-rural-inclusiva-sostenible",
      title: "El Poder del Agua en Manos de la Comunidad: Gestión Rural Inclusiva",
    },
  },

  "gestion-comunitaria-agua-rural-inclusiva-sostenible": {
    slug: "gestion-comunitaria-agua-rural-inclusiva-sostenible",
    title:
      "El Poder del Agua en Manos de la Comunidad: Hacia una Gestión Rural Inclusiva y Sostenible",
    category: "Gestión Comunitaria del Agua",
    date: "2025-04-02",
    readTime: 12,
    excerpt:
      "Las juntas de agua y cooperativas rurales son la columna vertebral del acceso hídrico en Latinoamérica. Descubre cómo el capital social, la vigilancia activa comunitaria y las herramientas de bajo costo están democratizando la gestión del agua en zonas rurales.",
    heroImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction:
        "En el entorno rural latinoamericano, la integración de la comunidad en la gestión del agua no es opcional: es innegociable. Mientras las grandes empresas privadas se retiran ante los altos costos de transacción y las barreras geográficas, los prestadores comunitarios —Juntas de Agua, cooperativas y asociaciones de usuarios— operan con base en el Capital Social. Esta confianza local elimina las barreras de entrada que ni el mercado ni el Estado han podido superar.",
      sections: [
        {
          id: "comunidad-eje-central",
          title: "La Comunidad como Eje Central: Capital Social vs. Barreras del Mercado",
          content:
            "Los modelos de gestión comunitaria presentan ventajas estructurales frente a las alternativas privadas en entornos rurales:\n\n**Gobernanza Democrática:** Al democratizar la toma de decisiones, se reduce la conflictividad hídrica y se garantiza que las soluciones respondan a la realidad del territorio.\n\n**Resiliencia ante el Cambio Climático:** La comunidad es el primer sensor de las sequías y el retroceso de glaciares. Su capacidad de acción inmediata es la base de la adaptación local.\n\n**Eficiencia y Mantenimiento:** La autogestión garantiza que la infraestructura se mantenga operativa incluso cuando la presencia del Estado es dispersa o intermitente.\n\nLos Diálogos Regionales del Agua 2023 marcaron un hito al reconocer formalmente la gestión comunitaria dentro de los procesos políticos regionales.",
          image:
            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "modelos-gestion-region",
          title: "Modelos de Gestión en la Región: De la Teoría a la Realidad",
          content:
            "La diversidad de modelos en ALC demuestra que el éxito depende de adaptar la estructura al contexto socioeconómico y geográfico:\n\n**Modelo Comunitario (Bolivia):** Predominante en zonas rurales y áreas con barreras geográficas. Las Juntas de Agua gestionan sistemas completos con alta participación ciudadana.\n\n**Modelo Público (18 de los 20 países más grandes de ALC):** Dominante en zonas urbanas y periurbanas. Su eficiencia depende de la fortaleza institucional del Estado.\n\n**Modelo Privado (Chile):** Presente en zonas de altos ingresos con regulación específica. Requiere marcos regulatorios sólidos para evitar exclusiones.",
          callout: {
            type: "info",
            title: "Lección Clave",
            content:
              "No existe un modelo único. La clave es la adecuación al contexto. En Bolivia, el modelo comunitario es la norma. En Chile, la regulación del privado es el camino. El error es imponer un modelo sin considerar el territorio.",
          },
        },
        {
          id: "vigilancia-activa-comunitaria",
          title: "Vigilancia Activa: Metodología para Proteger las Fuentes de Agua",
          content:
            "La gestión comunitaria efectiva requiere pasar del reporte reactivo al monitoreo activo. El ciclo de Vigilancia Activa Comunitaria (V.A.C.) tiene 5 etapas:\n\n**Etapa 0:** Capacitación y empoderamiento de líderes comunitarios en el uso de herramientas como la Red ROSA.\n\n**Etapa 1:** Identificación de fuentes y puntos críticos. Mapeo de pozos y detección de \"super-contaminadores\" (letrinas mal ubicadas, vertimientos informales).\n\n**Etapa 2:** Evaluación de riesgo y exposición. Monitoreo sistemático de parámetros físicos y químicos.\n\n**Etapa 3:** Intervención y alerta temprana. Acciones de limpieza, desinfección y comunicación de emergencia.\n\n**Etapa 4:** Reporte y rendición de cuentas. Compartir datos en plataformas digitales para exigir apoyo institucional.",
          callout: {
            type: "warning",
            title: "El Peligro Oculto de la Turbidez",
            content:
              "Una alta turbidez no es solo un problema estético. Los sedimentos 'esconden' a los patógenos y neutralizan el efecto del cloro, impidiendo una desinfección efectiva. Monitorear la turbidez es monitorear el riesgo microbiológico real.",
          },
        },
        {
          id: "herramientas-bajo-costo",
          title: "Herramientas de Bajo Costo para Democratizar el Dato",
          content:
            "La falta de información en tiempo real ha sido históricamente el gran obstáculo. Hoy, herramientas como **EnviroDIY** y la plataforma **Monitor My Watershed** están cambiando esa realidad mediante sensores de bajo costo y código abierto.\n\n**Parámetros clave para el monitoreo comunitario:**\n\n**Turbidez (Claridad):** Indicador crítico de riesgo microbiológico. Alta turbidez = patógenos escondidos = cloración ineficaz.\n\n**Temperatura:** La \"variable maestra\" del ecosistema. Cambios bruscos alertan sobre descargas industriales o servidas calientes.\n\n**E. coli / Coliformes:** Dado que solo el 42% del agua residual en ALC recibe tratamiento, el riesgo de contaminación fecal es permanente, especialmente tras lluvias intensas.",
          image:
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "ruta-inversion-sostenible",
          title: "La Ruta de la Inversión Sostenible",
          content:
            "El camino hacia el ODS 6 en zonas rurales requiere superar la dispersión institucional y la falta de jerarquía política de las autoridades del agua. La propuesta de la CEPAL es concreta:\n\n**Inversión:** 1.3% del PIB regional anual para universalizar el acceso. No es un lujo; es la condición mínima para garantizar un derecho humano.\n\n**Retorno:** 3.8 millones de puestos de trabajo verdes anuales, mayor productividad agrícola, reducción del gasto sanitario y mayor equidad de género (las mujeres son las principales portadoras de agua en el mundo rural).\n\nLa **Red y Observatorio para la Sostenibilidad del Agua (Red ROSA)** es el instrumento técnico diseñado para proveer información estandarizada y confiable que respalde la toma de decisiones de las juntas comunitarias.",
          callout: {
            type: "success",
            title: "Punto de Partida Práctico",
            content:
              "¿Gestionas o colaboras con una junta de agua? Identifica los 3 puntos de tu sistema donde la turbidez varía más. Instalar incluso un turbidímetro básico en esos puntos te dará información para actuar antes de que llegue la crisis.",
          },
        },
      ],
      conclusion:
        "La transición hídrica en América Latina no seguirá el camino del modelo urbano privado. Seguirá el camino de las comunidades organizadas, las juntas de agua empoderadas y los datos generados localmente. La Red ROSA, la metodología de Vigilancia Activa Comunitaria y las herramientas de bajo costo son las piezas de ese rompecabezas. El agua es asunto de todos, y la gestión del agua es el asunto de quienes viven junto a ella.",
    },
    tags: [
      "gestión comunitaria",
      "juntas de agua",
      "agua rural",
      "ODS 6",
      "América Latina",
      "monitoreo participativo",
      "capital social",
      "saneamiento",
    ],
  },
};

export function getLatestArticles(count: number = 2): BlogArticle[] {
  return Object.values(NEW_AMBIENTAL_ARTICLES)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}
