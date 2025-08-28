'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { apiService } from '../lib/api'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
}

interface UserContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Omit<User, 'id'> & { password: string; password_confirm: string; phone?: string }) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Call the real API service
      const response = await apiService.login(email, password)
      
      // Get the actual user profile from the API
      const userProfile = await apiService.getCurrentUser()
      
      // Create user object from API response
      const userData: User = {
        id: userProfile.id.toString(),
        firstName: userProfile.first_name || email.split('@')[0],
        lastName: userProfile.last_name || 'User',
        email: userProfile.email || email,
        avatar: userProfile.avatar || undefined
      }
      
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (userData: Omit<User, 'id'> & { password: string; password_confirm: string; phone?: string }) => {
    try {
      // Call the real API service
      await apiService.register({
        email: userData.email,
        username: userData.email.split('@')[0],
        password: userData.password || '',
        password_confirm: userData.password || '',
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone || ''
      })
      
      // After successful registration, log the user in
      return await login(userData.email, userData.password || '')
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
    // Clear the API token
    apiService.clearToken()
  }

  const refreshUser = async () => {
    if (!isAuthenticated) return
    
    try {
      const userProfile = await apiService.getCurrentUser()
      const userData: User = {
        id: userProfile.id.toString(),
        firstName: userProfile.first_name || 'User',
        lastName: userProfile.last_name || '',
        email: userProfile.email || '',
        avatar: userProfile.avatar || undefined
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      console.error('Failed to refresh user profile:', error)
      // If refresh fails, user might be logged out
      logout()
    }
  }

  // Check for existing user and token on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user')
        const hasToken = apiService.hasToken()
        
        if (savedUser && hasToken) {
          console.log('Found saved user and token, validating...')
          try {
            // Validate the token with the backend
            const isValid = await apiService.validateToken()
            console.log('Token validation result:', isValid)
            
            if (isValid) {
              try {
                // Get fresh user data from API
                const userProfile = await apiService.getCurrentUser()
                const userData: User = {
                  id: userProfile.id.toString(),
                  firstName: userProfile.first_name || 'User',
                  lastName: userProfile.last_name || '',
                  email: userProfile.email || '',
                  avatar: userProfile.avatar || undefined
                }
                setUser(userData)
                setIsAuthenticated(true)
                // Update localStorage with fresh data
                localStorage.setItem('user', JSON.stringify(userData))
              } catch (error) {
                console.error('Failed to get user profile:', error)
                // Fall back to saved user data if token is valid
                const userData = JSON.parse(savedUser)
                setUser(userData)
                setIsAuthenticated(true)
              }
            } else {
              // Token is invalid, clear everything
              console.log('Token validation failed, clearing auth state')
              localStorage.removeItem('user')
              apiService.clearToken()
              setUser(null)
              setIsAuthenticated(false)
            }
          } catch (error) {
            console.error('Failed to validate token:', error)
            // On network errors, keep the user logged in if we have saved data
            // This prevents logout on temporary network issues
            if (savedUser) {
              const userData = JSON.parse(savedUser)
              setUser(userData)
              setIsAuthenticated(true)
            } else {
              localStorage.removeItem('user')
              apiService.clearToken()
              setUser(null)
              setIsAuthenticated(false)
            }
          }
        } else {
          // No saved user or token, clear any invalid state
          if (savedUser) localStorage.removeItem('user')
          if (hasToken) apiService.clearToken()
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Unexpected error in checkAuth:', error)
        // On unexpected errors, clear everything to be safe
        localStorage.removeItem('user')
        apiService.clearToken()
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  const value: UserContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 