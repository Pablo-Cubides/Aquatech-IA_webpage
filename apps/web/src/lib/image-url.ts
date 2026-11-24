/**
 * Version liviana de una imagen de Cloudinary.
 *
 * Las portadas de los articulos se suben en tamano original (300-450 KB cada una) y las tarjetas de la portada las pintan en
 * ~400 px de ancho. Cloudinary las reduce al vuelo: f_auto elige AVIF/WebP segun el navegador, q_auto ajusta la calidad y
 * w_ limita el ancho. Una portada de 451 KB queda en ~100 KB. Si la URL no es de Cloudinary o ya trae transformaciones
 * (el segmento despues de /upload/ no es la version vNNN), se devuelve igual.
 */
export function optimizedImageUrl(url: string, width: number): string {
  const match = url.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(v\d+\/.+)$/);
  if (!match) return url;
  return `${match[1]}f_auto,q_auto,w_${Math.round(width)}/${match[2]}`;
}
