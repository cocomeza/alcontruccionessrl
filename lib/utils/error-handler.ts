/**
 * Utilidades para manejo consistente de errores
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export function handleError(error: unknown): { message: string; code?: string } {
  if (error instanceof AppError) {
    return { message: error.message, code: error.code }
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: 'Ocurrió un error inesperado' }
}

export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    const prefix = context ? `[${context}]` : '[Error]'
    console.error(prefix, error)
  }
  // En producción, aquí podrías enviar a un servicio de logging como Sentry
}

