'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService } from '../lib/api'

export interface WishlistItem {
  id: number
  product: {
    id: number
    name: string
    price: number
    original_price?: number
    image: string
    rating: number
    reviews: number
    in_stock: boolean
    category: string
  }
  created_at: string
}

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  isLoading: boolean
  error: string | null
  addToWishlist: (productId: number) => Promise<void>
  removeFromWishlist: (productId: number) => Promise<void>
  isInWishlist: (productId: number) => boolean
  refreshWishlist: () => Promise<void>
  clearError: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load wishlist on mount
  useEffect(() => {
    refreshWishlist()
  }, [])

  const refreshWishlist = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiService.getWishlist()
      setWishlistItems(response.results || response || [])
    } catch (err) {
      console.error('Failed to fetch wishlist:', err)
      setError('Failed to load wishlist')
    } finally {
      setIsLoading(false)
    }
  }

  const addToWishlist = async (productId: number) => {
    try {
      setError(null)
      await apiService.addToWishlist(productId)
      await refreshWishlist()
    } catch (err) {
      console.error('Failed to add to wishlist:', err)
      setError('Failed to add item to wishlist')
      throw err
    }
  }

  const removeFromWishlist = async (productId: number) => {
    try {
      setError(null)
      await apiService.removeFromWishlist(productId)
      await refreshWishlist()
    } catch (err) {
      console.error('Failed to remove from wishlist:', err)
      setError('Failed to remove item from wishlist')
      throw err
    }
  }

  const isInWishlist = (productId: number): boolean => {
    return wishlistItems.some(item => item.product.id === productId)
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isLoading,
        error,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist,
        clearError,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
