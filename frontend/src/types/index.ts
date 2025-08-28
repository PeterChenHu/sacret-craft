// User types
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  phone?: string
  joinDate?: string
}

// Product types
export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  description?: string
  image: string
  badge?: string
  category?: string
  inStock?: boolean
  rating?: number
  reviewCount?: number
}

// Cart types
export interface CartItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  quantity: number
  image: string | null
  badge?: string
}

// Order types
export interface Order {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
  shippingAddress: Address
  billingAddress: Address
}

// Address types
export interface Address {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

// Form types
export interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination types
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Filter types
export interface ProductFilters {
  category?: string
  priceRange?: [number, number]
  inStock?: boolean
  sortBy?: 'price' | 'name' | 'rating' | 'newest'
  sortOrder?: 'asc' | 'desc'
}

// Theme types
export interface Theme {
  mode: 'light' | 'dark'
  primaryColor: string
  secondaryColor: string
}

// Notification types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
} 