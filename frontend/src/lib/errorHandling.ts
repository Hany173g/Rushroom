// Error types
export class AppError extends Error {
  code: string
  statusCode?: number
  details?: Record<string, unknown>

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
  }
}

export class NetworkError extends AppError {
  constructor(message = 'حدث خطأ في الاتصال بالشبكة') {
    super(message, 'NETWORK_ERROR')
    this.name = 'NetworkError'
  }
}

export class AuthError extends AppError {
  constructor(message = 'جلسة العمل منتهية، يرجى تسجيل الدخول مرة أخرى') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthError'
  }
}

export class ProfileIncompleteError extends AppError {
  redirectUrl: string
  userId: string
  
  constructor(data: { userId: string; redirectUrl: string }) {
    super('يجب إكمال البروفايل أولاً', 'PROFILE_INCOMPLETE', 403)
    this.name = 'ProfileIncompleteError'
    this.redirectUrl = data.redirectUrl
    this.userId = data.userId
  }
}

export class ValidationError extends AppError {
  constructor(message = 'بيانات غير صالحة', details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'الصفحة غير موجودة') {
    super(message, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class ServerError extends AppError {
  constructor(message = 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً') {
    super(message, 'SERVER_ERROR', 500)
    this.name = 'ServerError'
  }
}

// Helper function to get user-friendly error message
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'حدث خطأ غير متوقع'
}

// Helper function to parse API errors
export async function parseApiError(response: Response): Promise<AppError> {
  try {
    const data = await response.json()
    const message = data.message || data.error || 'حدث خطأ غير معروف'
    
    // Handle profile incomplete error
    if (data.code === 'PROFILE_INCOMPLETE' && data.data) {
      return new ProfileIncompleteError({
        userId: data.data.userId,
        redirectUrl: data.data.redirectUrl
      })
    }
    
    switch (response.status) {
      case 400:
        return new ValidationError(message, data.details)
      case 401:
        return new AuthError(message)
      case 403:
        return new AppError(message, 'FORBIDDEN', 403)
      case 404:
        return new NotFoundError(message)
      case 500:
      case 502:
      case 503:
      case 504:
        return new ServerError(message)
      default:
        return new AppError(message, 'UNKNOWN_ERROR', response.status)
    }
  } catch {
    return new AppError(
      response.statusText || 'حدث خطأ في الاتصال',
      'PARSE_ERROR',
      response.status
    )
  }
}

// Async error wrapper for consistent error handling
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options?: {
    onError?: (error: AppError) => void
    fallbackValue?: T
    showToast?: (message: string, type: 'error') => void
  }
): Promise<T | undefined> {
  try {
    return await fn()
  } catch (error) {
    const appError = error instanceof AppError 
      ? error 
      : new AppError(getErrorMessage(error), 'UNKNOWN_ERROR')
    
    options?.onError?.(appError)
    
    if (options?.showToast) {
      options.showToast(appError.message, 'error')
    }
    
    if (options?.fallbackValue !== undefined) {
      return options.fallbackValue
    }
    
    throw appError
  }
}

// Error logging utility
export function logError(error: unknown, context?: string): void {
  // Don't log expected errors
  if (error instanceof ProfileIncompleteError) return
  
  if (import.meta.env.DEV) {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error)
  }
  
  // In production, you can send errors to a logging service
  // sendToErrorReportingService(error, context);
}

// Form validation helpers
export const validators = {
  required: (value: string) => {
    if (!value || value.trim() === '') {
      return 'هذا الحقل مطلوب'
    }
    return null
  },
  
  minLength: (value: string, min: number) => {
    if (value.length < min) {
      return `يجب أن يكون على الأقل ${min} أحرف`
    }
    return null
  },
  
  maxLength: (value: string, max: number) => {
    if (value.length > max) {
      return `يجب أن لا يتجاوز ${max} أحرف`
    }
    return null
  },
  
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'البريد الإلكتروني غير صالح'
    }
    return null
  }
}

// Safe localStorage operations
export const safeStorage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  
  set: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value)
      return true
    } catch {
      return false
    }
  },
  
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  }
}
