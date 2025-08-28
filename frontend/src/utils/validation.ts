import { VALIDATION } from '@/constants'

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= VALIDATION.EMAIL_MAX_LENGTH
}

// Password validation
export const isValidPassword = (password: string): boolean => {
  return password.length >= VALIDATION.PASSWORD_MIN_LENGTH && 
         password.length <= VALIDATION.PASSWORD_MAX_LENGTH
}

// Phone validation
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, '')) && 
         phone.length <= VALIDATION.PHONE_MAX_LENGTH
}

// Name validation
export const isValidName = (name: string): boolean => {
  return name.trim().length > 0 && 
         name.length <= VALIDATION.NAME_MAX_LENGTH &&
         /^[a-zA-Z\s'-]+$/.test(name)
}

// Address validation
export const isValidAddress = (address: string): boolean => {
  return address.trim().length > 0 && 
         address.length <= VALIDATION.ADDRESS_MAX_LENGTH
}

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Price validation
export const isValidPrice = (price: number): boolean => {
  return price >= 0 && price <= 999999.99
}

// Quantity validation
export const isValidQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity >= 0 && quantity <= 999
}

// Form validation helpers
export const getFieldError = (field: string, value: string | number): string | null => {
  switch (field) {
    case 'email':
      return !isValidEmail(value as string) ? 'Please enter a valid email address' : null
    case 'password':
      return !isValidPassword(value as string) ? `Password must be ${VALIDATION.PASSWORD_MIN_LENGTH}-${VALIDATION.PASSWORD_MAX_LENGTH} characters` : null
    case 'confirmPassword':
      return value === '' ? 'Please confirm your password' : null
    case 'firstName':
    case 'lastName':
      return !isValidName(value as string) ? 'Please enter a valid name' : null
    case 'phone':
      return !isValidPhone(value as string) ? 'Please enter a valid phone number' : null
    case 'address':
      return !isValidAddress(value as string) ? 'Please enter a valid address' : null
    default:
      return null
  }
}

// Password strength checker
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const length = password.length

  const score = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length

  if (length < 8 || score < 2) return 'weak'
  if (length >= 8 && score >= 3) return 'strong'
  return 'medium'
}

// Sanitize input
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Format currency
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

// Validate form data
export const validateForm = (data: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {}

  Object.keys(data).forEach(key => {
    const error = getFieldError(key, data[key])
    if (error) {
      errors[key] = error
    }
  })

  return errors
} 