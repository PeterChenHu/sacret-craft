'use client'

import React, { useState, useEffect } from 'react'
import Components from '../components'
import { Link } from '@/lib'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Heart, ArrowRight, Sparkles } from 'lucide-react'
import { useCart } from '../contexts/CartContext.js'
import { useWishlist } from '../contexts/WishlistContext.js'
import { useUser } from '../contexts/UserContext.js'
import { useNavigate } from '@/lib'
import RatingStars from '../components/RatingStars.js'
import { useTranslation } from 'react-i18next'
import { apiService } from '../lib/api.js'

export default function ProductCategories() {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { isAuthenticated } = useUser()
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  // Data state
  const [categories, setCategories] = useState<any[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Wishlist state
  const [wishlistLoading, setWishlistLoading] = useState<number | null>(null)

  // Fetch categories and featured products from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch categories
        const categoriesData = await apiService.getCategories() as any
        setCategories(categoriesData.results || categoriesData || [])
        
        // Fetch featured products (first 6 products as featured)
        const productsData = await apiService.getProducts({ page: 1 }) as any
        const featured = (productsData.results || productsData || []).slice(0, 6)
        setFeaturedProducts(featured)
        
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load categories and products')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddToCart = async (product: any) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/Login')
      return
    }
    
    try {
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
    }
  }

  const handleWishlistToggle = async (product: any) => {
    if (!isAuthenticated) {
      navigate('/Login')
      return
    }

    try {
      setWishlistLoading(product.id)
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id)
      } else {
        await addToWishlist(product.id)
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error)
    } finally {
      setWishlistLoading(null)
    }
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
            <h1 className="text-2xl font-bold text-amber-900 mb-4">Error Loading Categories</h1>
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
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            Sacred Art Categories
          </h1>
          <p className="text-xl md:text-2xl text-amber-100 mb-8 max-w-3xl mx-auto">
            Explore our carefully curated collections of blessed religious artifacts, organized by spiritual significance and craftsmanship
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-amber-900 mb-4">Browse by Category</h2>
            <p className="text-amber-700 text-lg">Discover sacred artifacts organized by their spiritual significance</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={category.id} to={`/Products?category=${category.id}`} className="block">
                <Card className="group hover:shadow-xl transition-all duration-300 border-amber-200 hover:border-amber-300 cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={category.image || category.images?.[0] || ''} 
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold text-xl mb-2">{category.name}</h3>
                        {category.description && (
                          <p className="text-amber-100 text-sm line-clamp-2">{category.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-700">
                          {category.products_count || 0} product{(category.products_count || 0) !== 1 ? 's' : ''}
                        </span>
                        <ArrowRight className="h-5 w-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="h-8 w-8 text-amber-600" />
                <h2 className="text-3xl font-serif font-bold text-amber-900">Featured Sacred Artifacts</h2>
                <Sparkles className="h-8 w-8 text-amber-600" />
              </div>
              <p className="text-amber-700 text-lg">Handpicked pieces that exemplify our commitment to spiritual craftsmanship</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-amber-200 hover:border-amber-300">
                  <CardContent className="p-0">
                    <Link to={`/ProductDetails/${product.id}`} className="block">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img 
                          src={product.images?.[0] || product.image || ''} 
                          alt={product.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.badge && (
                          <Badge className="absolute top-4 left-4 bg-amber-600 text-white">
                            {product.badge}
                          </Badge>
                        )}
                        {product.original_price && (
                          <Badge className="absolute top-4 right-4 bg-red-600 text-white">
                            Sale
                          </Badge>
                        )}
                      </div>
                    </Link>
                    <div className="p-6">
                      <Link to={`/ProductDetails/${product.id}`}>
                        <h3 className="font-semibold text-amber-900 mb-2 text-lg group-hover:text-amber-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center mb-3">
                        <div className="flex items-center space-x-1">
                          <RatingStars rating={product.rating || 0} />
                        </div>
                        <span className="text-sm text-amber-600 ml-2">({product.reviews_count || 0} reviews)</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-amber-800">${product.price}</span>
                          {product.original_price && (
                            <span className="text-lg text-gray-500 line-through">${product.original_price}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          Add to Cart
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleWishlistToggle(product)}
                          disabled={wishlistLoading === product.id}
                          className={`border-amber-600 hover:bg-amber-50 px-3 transition-colors ${
                            isInWishlist(product.id) 
                              ? 'bg-amber-600 text-white border-amber-600' 
                              : 'text-amber-600'
                          }`}
                        >
                          {wishlistLoading === product.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                          ) : (
                            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/Products">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                  View All Products
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Begin Your Sacred Collection</h2>
          <p className="text-xl text-amber-100 mb-8">
            Each piece in our collection is more than just an artifact—it's a bridge to the divine, 
            crafted with devotion and blessed with spiritual significance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/Products">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-800">
                Browse All Products
              </Button>
            </Link>
            <Link to="/About">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-800">
                Learn About Our Mission
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Components.Footer />
    </div>
  )
}