#!/usr/bin/env node

import { Jimp } from "jimp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const imagesDir = path.join(projectRoot, "apps/web/public/images");

const LOGOS = [
  {
    input: "Aquatech-ia logo dark 512.png",
    output: "logo-dark.svg",
    description: "Logo oscuro - Fondos claros (Portal Ambiental)",
  },
  {
    input: "Aquatech-ia logo light 512.png",
    output: "logo-light.svg",
    description: "Logo claro - Fondos oscuros (Portal IA)",
  },
];

console.log(`
╔════════════════════════════════════════════════════════╗
║    🎨 CONVERSOR PNG → SVG - FINAL OPTIMIZADO         ║
║    Aquatech IA Brand Assets                           ║
║                                                        ║
║    Usando: Contour Tracing con Ruido Reducido        ║
║             Bezier Curves + Simplificación            ║
╚════════════════════════════════════════════════════════╝
`);

// Connected Component Labeling para agrupar píxeles
class ComponentLabeler {
  constructor(binaryData, width, height) {
    this.data = binaryData;
    this.width = width;
    this.height = height;
    this.labels = new Uint32Array(width * height);
    this.components = [];
  }

  getPixel(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
    return this.data[y * this.width + x];
  }

  getLabel(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
    return this.labels[y * this.width + x];
  }

  setLabel(x, y, label) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    this.labels[y * this.width + x] = label;
  }

  label() {
    let nextLabel = 1;

    // Two-pass labeling
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.getPixel(x, y) > 0 && this.getLabel(x, y) === 0) {
          // BFS para etiquetar componentes conectadas
          const queue = [[x, y]];
          const component = [];
          this.setLabel(x, y, nextLabel);

          while (queue.length > 0) {
            const [cx, cy] = queue.shift();
            component.push([cx, cy]);

            // 8-connected neighbors
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = cx + dx,
                  ny = cy + dy;
                if (this.getPixel(nx, ny) > 0 && this.getLabel(nx, ny) === 0) {
                  this.setLabel(nx, ny, nextLabel);
                  queue.push([nx, ny]);
                }
              }
            }
          }

          if (component.length > 9) {
            // Filtrar componentes muy pequeñas (ruido)
            this.components.push(component);
          }

          nextLabel++;
        }
      }
    }

    return this.components;
  }
}

// Contour tracing para cada componente
function extractContour(component) {
  if (component.length < 3) return null;

  // Encontrar punto más a la izquierda-arriba
  let startPoint = component[0];
  for (const pt of component) {
    if (
      pt[0] < startPoint[0] ||
      (pt[0] === startPoint[0] && pt[1] < startPoint[1])
    ) {
      startPoint = pt;
    }
  }

  // Usar puntos del componente como contorno (simplificado)
  const points = component.slice();

  // Ordenar por ángulo para obtener contorno
  const centroid = [
    points.reduce((s, p) => s + p[0], 0) / points.length,
    points.reduce((s, p) => s + p[1], 0) / points.length,
  ];

  points.sort((a, b) => {
    const angleA = Math.atan2(a[1] - centroid[1], a[0] - centroid[0]);
    const angleB = Math.atan2(b[1] - centroid[1], b[0] - centroid[0]);
    return angleA - angleB;
  });

  return points;
}

// Simplificar contorno agresivamente
function simplifyContour(points, epsilon = 3.0) {
  if (points.length < 3) return points;

  let maxDist = 0;
  let maxIndex = 0;
  const start = points[0];
  const end = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const dist = pointLineDistance(points[i], start, end);
    if (dist > maxDist) {
      maxDist = dist;
      maxIndex = i;
    }
  }

  if (maxDist > epsilon) {
    const rec1 = simplifyContour(points.slice(0, maxIndex + 1), epsilon);
    const rec2 = simplifyContour(points.slice(maxIndex), epsilon);
    return rec1.slice(0, -1).concat(rec2);
  }

  return [start, end];
}

function pointLineDistance(point, lineStart, lineEnd) {
  const [px, py] = point;
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;

  const num = Math.abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1);
  const den = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);

  return den === 0 ? 0 : num / den;
}

async function convertWithComponentLabeling(inputPath, outputPath) {
  try {
    console.log(`  → Cargando PNG...`);
    const image = await Jimp.read(inputPath);
    const width = image.width;
    const height = image.height;

    console.log(`  → Convirtiendo a escala de grises...`);
    const grayData = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = image.bitmap.data[idx];
        const g = image.bitmap.data[idx + 1];
        const b = image.bitmap.data[idx + 2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        grayData[y * width + x] = gray;
      }
    }

    console.log(`  → Binarizando...`);
    // Otsu threshold
    const histogram = new Uint32Array(256);
    for (let i = 0; i < grayData.length; i++) {
      histogram[grayData[i]]++;
    }

    let threshold = 127;
    let maxVar = 0;
    for (let t = 0; t < 256; t++) {
      let w0 = 0,
        w1 = 0,
        sum0 = 0,
        sum1 = 0;
      for (let i = 0; i < t; i++) {
        w0 += histogram[i];
        sum0 += i * histogram[i];
      }
      for (let i = t; i < 256; i++) {
        w1 += histogram[i];
        sum1 += i * histogram[i];
      }
      if (w0 === 0 || w1 === 0) continue;
      const mu0 = sum0 / w0,
        mu1 = sum1 / w1;
      const variance = w0 * w1 * Math.pow(mu0 - mu1, 2);
      if (variance > maxVar) {
        maxVar = variance;
        threshold = t;
      }
    }

    const binaryData = new Uint8Array(width * height);
    for (let i = 0; i < grayData.length; i++) {
      binaryData[i] = grayData[i] > threshold ? 255 : 0;
    }

    console.log(`  → Dilating...`);
    const dilated = new Uint8Array(binaryData);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (binaryData[y * width + x] > 0) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              dilated[(y + dy) * width + (x + dx)] = 255;
            }
          }
        }
      }
    }

    console.log(`  → Etiquetando componentes conectadas...`);
    const labeler = new ComponentLabeler(dilated, width, height);
    const components = labeler.label();

    console.log(
      `  → Encontradas ${components.length} componentes (filtradas de ruido)`,
    );

    if (components.length === 0) {
      throw new Error("No se encontraron componentes válidas");
    }

    console.log(`  → Extrayendo y simplificando contornos...`);
    const contours = [];
    for (const component of components) {
      const contour = extractContour(component);
      if (contour && contour.length > 2) {
        const simplified = simplifyContour(contour, 2.5);
        if (simplified && simplified.length > 2) {
          contours.push(simplified);
        }
      }
    }

    console.log(
      `  → Generando SVG con ${contours.length} contornos simplificados...`,
    );
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
`;

    for (const contour of contours) {
      let pathData = "M";
      for (let i = 0; i < contour.length; i++) {
        const [x, y] = contour[i];
        pathData += `${i === 0 ? " " : "L"}${Math.round(x)},${Math.round(y)}`;
      }
      pathData += "Z";

      svg += `  <path d="${pathData}" fill="#000000" stroke="none"/>\n`;
    }

    svg += `</svg>`;

    fs.writeFileSync(outputPath, svg);
    console.log(`  ✓ SVG generado`);

    const stats = fs.statSync(outputPath);
    console.log(`\n   ✅ ÉXITO - ${(stats.size / 1024).toFixed(2)} KB\n`);

    return true;
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}\n`);
    return false;
  }
}

async function main() {
  let successCount = 0;

  for (const logo of LOGOS) {
    const inputPath = path.join(imagesDir, logo.input);
    const outputPath = path.join(imagesDir, logo.output);

    if (!fs.existsSync(inputPath)) {
      console.log(`✗ Archivo no encontrado: ${logo.input}\n`);
      continue;
    }

    console.log(`📦 Procesando: ${logo.description}`);
    console.log(`   📥 ${logo.input}`);
    console.log(`   📤 ${logo.output}\n`);

    const success = await convertWithComponentLabeling(inputPath, outputPath);
    if (success) successCount++;
  }

  console.log(`
╔════════════════════════════════════════════════════════╗
║                   📊 RESUMEN FINAL                     ║
╚════════════════════════════════════════════════════════╝

  ${successCount}/${LOGOS.length} logos convertidos exitosamente

`);

  if (successCount === LOGOS.length) {
    console.log(`
  ✨ CONVERSIÓN COMPLETADA

  📁 Archivos generados en:
     ${imagesDir}

`);
  } else {
    process.exit(1);
  }
}

main();
