/**
 * File Upload Validation & Security
 * Protects against malicious file uploads
 */

export type FileValidationConfig = {
  maxSizeBytes?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  checkMagicBytes?: boolean;
};

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileValidationError";
  }
}

/**
 * Default configuration for spreadsheet files
 */
export const SPREADSHEET_CONFIG: FileValidationConfig = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: [
    "text/csv",
    "text/plain", // For CSV files with wrong MIME type
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.macro.sheet", // xlsm
  ],
  allowedExtensions: [".csv", ".xls", ".xlsx", ".xlsm"],
  checkMagicBytes: true,
};

/**
 * Default configuration for image files
 */
export const IMAGE_CONFIG: FileValidationConfig = {
  maxSizeBytes: 2 * 1024 * 1024, // 2MB
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
  checkMagicBytes: true,
};

/**
 * Default configuration for JSON files
 */
export const JSON_CONFIG: FileValidationConfig = {
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ["application/json", "text/plain"],
  allowedExtensions: [".json"],
  checkMagicBytes: false,
};

/**
 * Validate file size
 */
function validateFileSize(file: File, maxSizeBytes: number): void {
  if (file.size > maxSizeBytes) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    const maxMB = (maxSizeBytes / 1024 / 1024).toFixed(2);
    throw new FileValidationError(
      `Archivo muy grande. Máximo: ${maxMB}MB, recibido: ${sizeMB}MB`,
    );
  }
}

/**
 * Validate MIME type
 */
function validateMimeType(file: File, allowedMimeTypes: string[]): void {
  if (!allowedMimeTypes.includes(file.type)) {
    throw new FileValidationError(
      `Tipo de archivo no permitido. Permitidos: ${allowedMimeTypes.join(", ")}`,
    );
  }
}

/**
 * Validate file extension
 */
function validateExtension(
  fileName: string,
  allowedExtensions: string[],
): void {
  const ext = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    throw new FileValidationError(
      `Extensión de archivo no válida. Permitidas: ${allowedExtensions.join(", ")}`,
    );
  }
}

/**
 * Check magic bytes (file signature) to prevent MIME type spoofing
 */
async function validateMagicBytes(file: File, mimeType: string): Promise<void> {
  const header = await file.slice(0, 8).arrayBuffer();
  const view = new Uint8Array(header);

  // CSV files start with text characters
  if (mimeType === "text/csv" || mimeType === "text/plain") {
    // CSV should be readable text
    const firstBytes = new TextDecoder().decode(view.slice(0, 4));
    if (/[\x00\x01\x02\x03\x04\x05\x06\x07\x08]/.test(firstBytes)) {
      throw new FileValidationError("Archivo CSV corrupto o inválido");
    }
  }

  // XLS file signature: 0xD0 0xCF 0x11 0xE0
  if (mimeType === "application/vnd.ms-excel") {
    if (view[0] !== 0xd0 || view[1] !== 0xcf) {
      throw new FileValidationError(
        "Firma XLS no detectada. Archivo podría estar corrupto",
      );
    }
  }

  // XLSX/XLSM file signature: 0x50 0x4B (PK - ZIP format)
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.macro.sheet"
  ) {
    if (view[0] !== 0x50 || view[1] !== 0x4b) {
      throw new FileValidationError(
        "Firma XLSX no detectada. Archivo podría estar corrupto",
      );
    }
  }

  // JSON files should start with { or [
  if (mimeType === "application/json") {
    const firstChar = String.fromCharCode(view[0]);
    if (firstChar !== "{" && firstChar !== "[") {
      throw new FileValidationError("Archivo JSON inválido");
    }
  }

  // PNG signature: 0x89 0x50 0x4E 0x47
  if (mimeType === "image/png") {
    if (
      view[0] !== 0x89 ||
      view[1] !== 0x50 ||
      view[2] !== 0x4e ||
      view[3] !== 0x47
    ) {
      throw new FileValidationError("Firma PNG no detectada");
    }
  }

  // JPEG signature: 0xFF 0xD8
  if (mimeType === "image/jpeg") {
    if (view[0] !== 0xff || view[1] !== 0xd8) {
      throw new FileValidationError("Firma JPEG no detectada");
    }
  }
}

/**
 * Complete file validation
 */
export async function validateFile(
  file: File,
  config: FileValidationConfig = SPREADSHEET_CONFIG,
): Promise<boolean> {
  const {
    maxSizeBytes = 5 * 1024 * 1024,
    allowedMimeTypes = [],
    allowedExtensions = [],
    checkMagicBytes = true,
  } = config;

  try {
    // 1. Validate file exists
    if (!file || !(file instanceof File)) {
      throw new FileValidationError("Archivo no válido");
    }

    // 2. Validate file size
    validateFileSize(file, maxSizeBytes);

    // 3. Validate MIME type
    if (allowedMimeTypes.length > 0) {
      validateMimeType(file, allowedMimeTypes);
    }

    // 4. Validate extension
    if (allowedExtensions.length > 0) {
      validateExtension(file.name, allowedExtensions);
    }

    // 5. Check magic bytes
    if (checkMagicBytes && allowedMimeTypes.length > 0) {
      await validateMagicBytes(file, file.type);
    }

    return true;
  } catch (error) {
    if (error instanceof FileValidationError) {
      throw error;
    }
    throw new FileValidationError(`Error al validar archivo: ${String(error)}`);
  }
}

/**
 * Validate multiple files
 */
export async function validateFiles(
  files: File[],
  config?: FileValidationConfig,
): Promise<boolean> {
  for (const file of files) {
    await validateFile(file, config);
  }
  return true;
}

/**
 * Sanitize file name to prevent path traversal attacks
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/\.\.\//g, "") // Remove ../
    .replace(/\\/g, "") // Remove backslashes
    .replace(/[/\\]/g, "_") // Replace slashes with underscores
    .replace(/[^\w\s.-]/g, "") // Remove special characters
    .slice(0, 255); // Limit length
}

/**
 * Generate safe file name with timestamp
 */
export function generateSafeFileName(originalName: string): string {
  const timestamp = Date.now();
  const ext = originalName.substring(originalName.lastIndexOf(".")) || "";
  const baseName = sanitizeFileName(originalName.replace(ext, ""));
  return `${baseName}-${timestamp}${ext}`;
}
