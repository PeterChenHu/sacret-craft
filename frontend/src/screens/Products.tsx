'use client'

import React, { useState, useEffect } from 'react'
import Components from '../components'
import { Link, useNavigate } from '@/lib'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Star, Grid3X3, List, Search, Filter } from 'lucide-react'
import { useCart } from '../contexts/CartContext.js'
import RatingStars from '../components/RatingStars.js'
import { useTranslation } from 'react-i18next'
import { apiService } from '../lib/api.js'
import { useUser } from '../contexts/UserContext.js'

interface Category {
  id: number
  name: string
  slug: string
  description?: string
}

interface ApiProduct {
  id: number
  name: string
  price: string
  original_price?: string
  description?: string
  image?: string
  images?: string[]
  badge?: string
  category?: { id: number; name: string }
  in_stock?: boolean
  rating?: number
  reviews_count?: number
}

export default function Products() {
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const { isAuthenticated } = useUser()
  const navigate = useNavigate()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPrevPage, setHasPrevPage] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')
        
        // Fetch categories and products in parallel
        const [categoriesData, productsData] = await Promise.all([
          apiService.getCategories(),
          apiService.getProducts({
            page: currentPage,
            search: searchTerm || undefined,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            ordering: sortBy
          })
        ])
        
        // Ensure categories is an array
        const categoriesArray = Array.isArray(categoriesData) ? categoriesData : 
                               (categoriesData as any)?.results || []
        setCategories(categoriesArray as Category[])
        
        if (productsData && (productsData as any).results) {
          setProducts((productsData as any).results as ApiProduct[])
          setHasNextPage(!!(productsData as any).next)
          setHasPrevPage(!!(productsData as any).previous)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setError('Failed to load products')
        // Set empty arrays as fallback to prevent crashes
        setCategories([])
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage, searchTerm, selectedCategory, sortBy])

  const handleAddToCart = async (product: ApiProduct) => {
    if (!isAuthenticated) {
      navigate('/Login')
      return
    }
    
    try {
      await apiService.addToCart(product.id, 1)
      // Convert API product to CartItem format
      const cartItem = {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price.replace('$', '')),
        originalPrice: product.original_price ? parseFloat(product.original_price.replace('$', '')) : undefined,
        image: product.images?.[0] || product.image || null,
        badge: product.badge
      }
      addToCart(cartItem)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('Failed to add item to cart. Please try again.')
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1) // Reset to first page when changing category
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setCurrentPage(1) // Reset to first page when sorting
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Components.Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            Sacred Art Collection
          </h1>
          <p className="text-xl md:text-2xl text-amber-100 mb-8 max-w-3xl mx-auto">
            Discover handcrafted religious artifacts, blessed by spiritual practitioners and crafted with devotion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ProductCategories">
              <Button size="lg" variant="outline" className="border-white text-orange-600 hover:bg-white hover:text-amber-800">
                Browse Categories
              </Button>
            </Link>
            <Link to="/About">
              <Button size="lg" variant="outline" className="border-white text-orange-600 hover:bg-white hover:text-amber-800">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-white border-b border-amber-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-4 w-4" />
              <Input
                placeholder="Search sacred artifacts..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 border-amber-200 focus:border-amber-600"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-40 border-amber-200">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Array.isArray(categories) && categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-40 border-amber-200">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="-name">Name Z-A</SelectItem>
                  <SelectItem value="price">Price Low-High</SelectItem>
                  <SelectItem value="-price">Price High-Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="-created_at">Newest First</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border border-amber-200 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-r-none ${viewMode === 'grid' ? 'bg-amber-600 text-white' : 'text-amber-600'}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`rounded-l-none ${viewMode === 'list' ? 'bg-amber-600 text-white' : 'text-amber-600'}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid/List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-amber-700">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory && Array.isArray(categories) && ` in ${categories.find(c => c.id.toString() === selectedCategory)?.name}`}
            </p>
          </div>

          {/* Products */}
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-amber-700 mb-4">No products found</p>
              <p className="text-amber-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-amber-200 hover:border-amber-300">
                      <CardContent className="p-0">
                        <Link to={`/ProductDetails/${product.id}`} className="block">
                          <div className="relative overflow-hidden rounded-t-lg">
                            <img 
                              src={product.images?.[0] || product.image || undefined} 
                              alt={product.name}
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {product.badge && (
                              <Badge className="absolute top-2 left-2 bg-amber-600 text-white">
                                {product.badge}
                              </Badge>
                            )}
                            {product.original_price && (
                              <Badge className="absolute top-2 right-2 bg-red-600 text-white">
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
                            <span className="text-sm text-amber-600 ml-2">({product.reviews_count || 0})</span>
                          </div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-amber-800">${product.price}</span>
                              {product.original_price && (
                                <span className="text-lg text-gray-500 line-through">${product.original_price}</span>
                              )}
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {products.map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-amber-200 hover:border-amber-300">
                      <CardContent className="p-0">
                        <div className="flex">
                          <Link to={`/ProductDetails/${product.id}`} className="block">
                            <div className="relative overflow-hidden rounded-l-lg">
                              <img 
                                src={product.images?.[0] || product.image || undefined} 
                                alt={product.name}
                                className="w-48 h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {product.badge && (
                                <Badge className="absolute top-2 left-2 bg-amber-600 text-white">
                                  {product.badge}
                                </Badge>
                              )}
                            </div>
                          </Link>
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <Link to={`/ProductDetails/${product.id}`}>
                                  <h3 className="font-semibold text-amber-900 mb-2 text-xl group-hover:text-amber-600 transition-colors">
                                    {product.name}
                                  </h3>
                                </Link>
                                <p className="text-amber-700 mb-4 line-clamp-2">{product.description}</p>
                                <div className="flex items-center mb-4">
                                  <div className="flex items-center space-x-1">
                                    <RatingStars rating={product.rating || 0} />
                                  </div>
                                  <span className="text-sm text-amber-600 ml-2">({product.reviews_count || 0} reviews)</span>
                                </div>
                              </div>
                              <div className="text-right ml-6">
                                <div className="flex items-center space-x-2 mb-4">
                                  <span className="text-3xl font-bold text-amber-800">${product.price}</span>
                                  {product.original_price && (
                                    <span className="text-xl text-gray-500 line-through">${product.original_price}</span>
                                  )}
                                </div>
                                <Button 
                                  onClick={() => handleAddToCart(product)}
                                  className="bg-amber-600 hover:bg-amber-700 text-white"
                                >
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {(hasNextPage || hasPrevPage) && (
                <div className="flex justify-center items-center space-x-4 mt-12">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
                    variant="outline"
                    className="border-amber-600 text-amber-600 hover:bg-amber-50 disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  <span className="text-amber-700">Page {currentPage}</span>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    variant="outline"
                    className="border-amber-600 text-amber-600 hover:bg-amber-50 disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Components.Footer />
    </div>
  )
}