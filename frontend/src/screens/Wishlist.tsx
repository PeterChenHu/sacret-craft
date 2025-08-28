'use client'

import React, { useState, useEffect } from 'react'
import Components from '../components'
import { Link } from '@/lib'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Heart, ShoppingCart, Trash2, Star, ArrowRight } from 'lucide-react'
import { useCart } from '../contexts/CartContext.js'
import { useWishlist } from '../contexts/WishlistContext.js'
import { useUser } from '../contexts/UserContext.js'
import { useNavigate } from '@/lib'
import RatingStars from '../components/RatingStars.js'
import { useTranslation } from 'react-i18next'
import { apiService } from '../lib/api.js'

export default function Wishlist() {
  const { addToCart } = useCart()
  const { removeFromWishlist } = useWishlist()
  const { isAuthenticated, isLoading } = useUser()
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  // Data state
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // UI state
  const [addingToCart, setAddingToCart] = useState<number | null>(null)
  const [removingFromWishlist, setRemovingFromWishlist] = useState<number | null>(null)

  // Fetch wishlist data from server
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        setError(null)
        
        const wishlistData = await apiService.getWishlist() as any
        setWishlistItems(wishlistData.results || wishlistData || [])
        
      } catch (error) {
        console.error('Error fetching wishlist:', error)
        setError('Failed to load wishlist')
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [isAuthenticated])

  const handleAddToCart = async (product: any) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/Login')
      return
    }
    
    try {
      setAddingToCart(product.id)
      
      // Add item to cart via API
      await apiService.addToCart(product.id, 1)
      
      // Also add to local cart context
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price.toString().replace('$', '')),
        image: product.images?.[0] || product.image || null
      })
      
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('Failed to add item to cart. Please try again.')
    } finally {
      setAddingToCart(null)
    }
  }

  const handleRemoveFromWishlist = async (product: any) => {
    try {
      setRemovingFromWishlist(product.id)
      
      // Remove from wishlist via API
      await apiService.removeFromWishlist(product.id)
      
      // Update local state
      setWishlistItems(prev => prev.filter(item => item.id !== product.id))
      
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    } finally {
      setRemovingFromWishlist(null)
    }
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Components.Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Components.Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Heart className="h-24 w-24 text-amber-600 mx-auto mb-6" />
            <h1 className="text-3xl font-serif font-bold text-amber-900 mb-4">Sign In to View Your Wishlist</h1>
            <p className="text-amber-700 mb-8 text-lg">
              Create an account or sign in to save your favorite sacred artifacts and track your spiritual journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/Login">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                  Sign In
                </Button>
              </Link>
              <Link to="/Register">
                <Button size="lg" variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Components.Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Components.Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-amber-900 mb-4">Error Loading Wishlist</h1>
            <p className="text-amber-700 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-amber-600 hover:bg-amber-700 text-white">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Components.Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-24 w-24 text-amber-200 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            Your Sacred Wishlist
          </h1>
          <p className="text-xl md:text-2xl text-amber-100 mb-8 max-w-3xl mx-auto">
            A collection of blessed artifacts that have touched your heart and soul
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/Products">
              <Button size="lg" variant="outline" className="border-white text-orange-600 hover:bg-white hover:text-amber-800">
                Continue Shopping
              </Button>
            </Link>
            <Link to="/ProductCategories">
              <Button size="lg" variant="outline" className="border-white text-orange-600 hover:bg-white hover:text-amber-800">
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-amber-800">{wishlistItems.length}</div>
                <div className="text-amber-600">Items in Wishlist</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-800">
                  ${wishlistItems.reduce((total, item) => total + parseFloat(item.price.toString().replace('$', '')), 0).toFixed(2)}
                </div>
                <div className="text-amber-600">Total Value</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-800">
                  {wishlistItems.filter(item => item.original_price).length}
                </div>
                <div className="text-amber-600">On Sale</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-800">
                  {wishlistItems.filter(item => item.badge).length}
                </div>
                <div className="text-amber-600">Featured Items</div>
              </div>
            </div>
          </div>

          {/* Wishlist Items */}
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-24 w-24 text-amber-300 mx-auto mb-6" />
              <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4">Your Wishlist is Empty</h2>
              <p className="text-amber-700 mb-8 text-lg">
                Start building your collection of sacred artifacts by browsing our products and adding items that speak to your soul.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/Products">
                  <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                    Browse Products
                  </Button>
                </Link>
                <Link to="/ProductCategories">
                  <Button size="lg" variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                    Explore Categories
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {wishlistItems.map((item) => (
                  <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 border-amber-200 hover:border-amber-300">
                    <CardContent className="p-0">
                      <div className="flex">
                        <Link to={`/ProductDetails/${item.id}`} className="block">
                          <div className="relative overflow-hidden rounded-l-lg">
                            {(item.images?.[0] || item.image) ? (
                              <img 
                                src={item.images?.[0] || item.image} 
                                alt={item.name}
                                className="w-48 h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-48 h-48 bg-amber-100 flex items-center justify-center text-amber-400">
                                <span>No Image</span>
                              </div>
                            )}
                            {item.badge && (
                              <Badge className="absolute top-2 left-2 bg-amber-600 text-white">
                                {item.badge}
                              </Badge>
                            )}
                            {item.original_price && (
                              <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                                Sale
                              </Badge>
                            )}
                          </div>
                        </Link>
                        <div className="flex-1 p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <Link to={`/ProductDetails/${item.id}`}>
                                <h3 className="font-semibold text-amber-900 mb-2 text-xl group-hover:text-amber-600 transition-colors">
                                  {item.name}
                                </h3>
                              </Link>
                              {item.description && (
                                <p className="text-amber-700 mb-4 line-clamp-2">{item.description}</p>
                              )}
                              <div className="flex items-center mb-4">
                                <div className="flex items-center space-x-1">
                                  <RatingStars rating={item.rating || 0} />
                                </div>
                                <span className="text-sm text-amber-600 ml-2">({item.reviews_count || 0} reviews)</span>
                              </div>
                              {item.category && (
                                <div className="mb-4">
                                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                                    {item.category.name}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className="text-right ml-6">
                              <div className="flex items-center space-x-2 mb-4">
                                <span className="text-3xl font-bold text-amber-800">${item.price}</span>
                                {item.original_price && (
                                  <span className="text-xl text-gray-500 line-through">${item.original_price}</span>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  onClick={() => handleAddToCart(item)}
                                  disabled={addingToCart === item.id}
                                  className="bg-amber-600 hover:bg-amber-700 text-white"
                                >
                                  {addingToCart === item.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      Adding...
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingCart className="h-4 w-4 mr-2" />
                                      Add to Cart
                                    </>
                                  )}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleRemoveFromWishlist(item)}
                                  disabled={removingFromWishlist === item.id}
                                  className="border-red-600 text-red-600 hover:bg-red-50 px-3"
                                >
                                  {removingFromWishlist === item.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-12 text-center">
                <Separator className="bg-amber-200 mb-8" />
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/Products">
                    <Button size="lg" variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                      <ArrowRight className="h-5 w-5 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                  <Link to="/Cart">
                    <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      View Cart
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Components.Footer />
    </div>
  )
}