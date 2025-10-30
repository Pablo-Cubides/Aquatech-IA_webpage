/**
 * Logger Estructurado
 * Sistema de logging centralizado para el proyecto Mapa Ambiental
 * En desarrollo: console output
 * En producción: preparado para integración con Sentry/Winston
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Log informativo
   * Usar para: operaciones exitosas, flujo normal de la aplicación
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  /**
   * Log de advertencia
   * Usar para: situaciones inusuales pero no críticas
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  /**
   * Log de error
   * Usar para: errores capturados que deben ser investigados
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    };
    this.log('error', message, errorContext);
  }

  /**
   * Log de debug
   * Usar para: información de debugging detallada
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };

    if (this.isDevelopment) {
      // En desarrollo: output colorido a consola
      this.consoleOutput(level, message, context);
    } else {
      // En producción: preparado para servicio de logging
      // La empresa integrará con Sentry, Winston, CloudWatch, etc.
      this.productionLog(logEntry);
    }
  }

  private consoleOutput(level: LogLevel, message: string, context?: LogContext): void {
    const styles = {
      info: 'color: #2196F3; font-weight: bold',
      warn: 'color: #FF9800; font-weight: bold',
      error: 'color: #F44336; font-weight: bold',
      debug: 'color: #9E9E9E; font-weight: bold',
    };

    console.log(
      `%c[${level.toUpperCase()}]`,
      styles[level],
      message,
      context ? context : ''
    );
  }

  private productionLog(logEntry: any): void {
    // En producción, la empresa configurará integración con:
    // - Sentry para error tracking
    // - Winston para logs estructurados
    // - CloudWatch/Datadog para monitoring
    
    // Por ahora, solo guardamos para no perder información crítica
    if (logEntry.level === 'error') {
      console.error(JSON.stringify(logEntry));
    }
  }
}

// Singleton instance
export const logger = new Logger();

/**
 * Ejemplo de uso:
 * 
 * import { logger } from '@/lib/logger'
 * 
 * // Info
 * logger.info('Dataset loaded successfully', { datasetId: '123', records: 1500 })
 * 
 * // Warning
 * logger.warn('Large file detected', { size: '15MB', limit: '10MB' })
 * 
 * // Error
 * try {
 *   await uploadData()
 * } catch (error) {
 *   logger.error('Failed to upload data', error, { userId: user.id })
 * }
 * 
 * // Debug (solo en development)
 * logger.debug('Filter state changed', { filters: currentFilters })
 */
