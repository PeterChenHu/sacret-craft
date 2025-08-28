// App Configuration
export const APP_CONFIG = {
  name: 'Sacred Crafts',
  description: 'Handcrafted Religious Art',
  version: '1.0.0',
  url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
} as const

// Theme Colors
export const COLORS = {
  primary: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
} as const

// Product Categories
export const PRODUCT_CATEGORIES = [
  'Crucifixes',
  'Rosaries',
  'Statues',
  'Crosses',
  'Prayer Cards',
  'Candles',
  'Books',
  'Gifts',
] as const

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

// Payment Methods
export const PAYMENT_METHODS = [
  'credit_card',
  'paypal',
  'wechat_pay',
  'bank_transfer',
] as const

// Shipping Options
export const SHIPPING_OPTIONS = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    price: 9.99,
    estimatedDays: '5-7 business days',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    price: 19.99,
    estimatedDays: '2-3 business days',
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    price: 29.99,
    estimatedDays: '1 business day',
  },
] as const

// Free Shipping Threshold
export const FREE_SHIPPING_THRESHOLD = 75

// Tax Rate (8%)
export const TAX_RATE = 0.08

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
} as const

// Form Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 254,
  NAME_MAX_LENGTH: 100,
  PHONE_MAX_LENGTH: 20,
  ADDRESS_MAX_LENGTH: 200,
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  CART: 'cart',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: '/products/:id',
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear',
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: '/orders/:id',
    UPDATE: '/orders/:id',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/profile',
    PASSWORD: '/user/password',
  },
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in.',
  REGISTER: 'Account created successfully.',
  LOGOUT: 'Successfully logged out.',
  PROFILE_UPDATE: 'Profile updated successfully.',
  PASSWORD_UPDATE: 'Password updated successfully.',
  CART_ADD: 'Item added to cart.',
  CART_REMOVE: 'Item removed from cart.',
  ORDER_CREATE: 'Order placed successfully.',
} as const 