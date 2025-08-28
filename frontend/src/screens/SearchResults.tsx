'use client'

import React, { useState } from 'react'
import Components from '../components'
import { Link } from '@/lib'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  X, 
  Star,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react'
import { useCart } from '../contexts/CartContext.js'
import RatingStars from '../components/RatingStars.js'

export default function SearchResults() {
  const [searchQuery, setSearchQuery] = useState('wooden cross')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<string[]>([])

  const searchResults = [
    {
      id: 1,
      name: "Handcrafted Wooden Crucifix",
      price: 89.99,
      originalPrice: 109.99,
      image: "/placeholder-image.jpg",
      badge: "Bestseller",
      rating: 5,
      reviews: 24,
      category: "Crosses",
      description: "Beautiful handcrafted wooden crucifix made from premium oak wood with intricate detailing."
    },
    {
      id: 2,
      name: "Ornate Wall Cross",
      price: 67.99,
      image: "/placeholder-image.jpg",
      rating: 4.7,
      reviews: 15,
      category: "Crosses",
      description: "Elegant wall cross with ornate carved details, perfect for home or office display."
    },
    {
      id: 3,
      name: "Sacred Heart Cross Plaque",
      price: 78.99,
      image: "/placeholder-image.jpg",
      rating: 4.8,
      reviews: 21,
      category: "Crosses",
      description: "Sacred Heart themed cross plaque with beautiful carved details and blessed finish."
    },
    {
      id: 4,
      name: "Rustic Wooden Cross",
      price: 45.99,
      image: "/placeholder-image.jpg",
      badge: "New",
      rating: 4.6,
      reviews: 8,
      category: "Crosses",
      description: "Simple yet beautiful rustic wooden cross, handcrafted with natural wood grain."
    },
    {
      id: 5,
      name: "Celtic Cross Design",
      price: 95.99,
      image: "/placeholder-image.jpg",
      rating: 4.9,
      reviews: 18,
      category: "Crosses",
      description: "Traditional Celtic cross design with intricate knotwork patterns carved by skilled artisans."
    },
    {
      id: 6,
      name: "Miniature Cross Set",
      price: 32.99,
      image: "/placeholder-image.jpg",
      rating: 4.5,
      reviews: 12,
      category: "Crosses",
      description: "Set of three miniature wooden crosses, perfect for gifts or small spaces."
    }
  ]

  const categories = [
    { name: "Crosses", count: 6 },
    { name: "Statues", count: 8 },
    { name: "Rosaries", count: 4 },
    { name: "Plaques", count: 5 },
    { name: "Prayer Beads", count: 3 }
  ]

  const suggestedSearches = [
    "wooden crucifix",
    "sacred heart",
    "virgin mary statue",
    "rosary beads",
    "religious wall art",
    "prayer cross"
  ]

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category))
    }
  }

  const handleRatingChange = (rating: string, checked: boolean) => {
    if (checked) {
      setSelectedRatings([...selectedRatings, rating])
    } else {
      setSelectedRatings(selectedRatings.filter(r => r !== rating))
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedRatings([])
    setPriceRange({ min: '', max: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Components.Header />
      
      {/* Search Header */}
      <section className="bg-white border-b border-amber-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">
                Search Results for "{searchQuery}"
              </h1>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for sacred art..."
                    className="pl-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-amber-700">
              <p className="text-lg font-medium">{searchResults.length} results found</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="border-amber-200 sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-amber-900">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-amber-600 hover:bg-amber-50"
                  >
                    Clear All
                  </Button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-semibold text-amber-900 mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.name}
                          checked={selectedCategories.includes(category.name)}
                          onCheckedChange={(checked) => handleCategoryChange(category.name, checked === true)}
                        />
                        <label htmlFor={category.name} className="text-sm text-amber-700 flex-1 cursor-pointer">
                          {category.name}
                        </label>
                        <span className="text-xs text-amber-600">({category.count})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-amber-200 mb-6" />

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-semibold text-amber-900 mb-3">Price Range</h3>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="border-amber-200 text-sm"
                    />
                    <Input
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="border-amber-200 text-sm"
                    />
                  </div>
                </div>

                <Separator className="bg-amber-200 mb-6" />

                {/* Rating */}
                <div className="mb-6">
                  <h3 className="font-semibold text-amber-900 mb-3">Customer Rating</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox
                          id={`rating-${rating}`}
                          checked={selectedRatings.includes(rating.toString())}
                          onCheckedChange={(checked) => handleRatingChange(rating.toString(), checked === true)}
                        />
                        <label htmlFor={`rating-${rating}`} className="flex items-center space-x-1 cursor-pointer">
                          <div className="flex">
                            <RatingStars rating={rating} />
                          </div>
                          <span className="text-sm text-amber-700">& up</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden border-amber-600 text-amber-600 hover:bg-amber-50"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                <span className="text-amber-700">
                  Showing {searchResults.length} of {searchResults.length} results
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 border-amber-200">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
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
                    <Grid className="h-4 w-4" />
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

            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedRatings.length > 0 || priceRange.min || priceRange.max) && (
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-amber-700">Active filters:</span>
                  {selectedCategories.map((category) => (
                    <Badge key={category} variant="secondary" className="bg-amber-100 text-amber-800">
                      {category}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => handleCategoryChange(category, false)}
                      />
                    </Badge>
                  ))}
                  {selectedRatings.map((rating) => (
                    <Badge key={rating} variant="secondary" className="bg-amber-100 text-amber-800">
                      {rating}+ stars
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => handleRatingChange(rating, false)}
                      />
                    </Badge>
                  ))}
                  {(priceRange.min || priceRange.max) && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      ${priceRange.min || '0'} - ${priceRange.max || '∞'}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => setPriceRange({ min: '', max: '' })}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Search Results */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {searchResults.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-amber-200 hover:border-amber-300">
                  <CardContent className="p-0">
                    {viewMode === 'grid' ? (
                      <>
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.badge && (
                            <Badge 
                              className={`absolute top-4 left-4 ${
                                product.badge === 'Bestseller' ? 'bg-amber-600' : 
                                product.badge === 'New' ? 'bg-green-600' : 'bg-blue-600'
                              } text-white`}
                            >
                              {product.badge}
                            </Badge>
                          )}
                          {product.originalPrice && (
                            <Badge className="absolute top-4 right-4 bg-red-600 text-white">
                              Sale
                            </Badge>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="font-semibold text-amber-900 mb-2 text-lg group-hover:text-amber-700 transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center mb-3">
                            <div className="flex items-center mr-2">
                              <RatingStars rating={product.rating} />
                            </div>
                            <span className="text-sm text-amber-600">({product.reviews})</span>
                          </div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-amber-800">${product.price}</span>
                              {product.originalPrice && (
                                <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                              )}
                            </div>
                          </div>
                          <Link to="/ProductDetails">
                            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white cursor-pointer">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="flex p-6 gap-6">
                        <div className="relative w-48 h-48 flex-shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {product.badge && (
                            <Badge 
                              className={`absolute top-2 left-2 ${
                                product.badge === 'Bestseller' ? 'bg-amber-600' : 
                                product.badge === 'New' ? 'bg-green-600' : 'bg-blue-600'
                              } text-white`}
                            >
                              {product.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-amber-900 mb-2 text-xl">{product.name}</h3>
                          <div className="flex items-center mb-3">
                            <div className="flex items-center mr-2">
                              <RatingStars rating={product.rating} />
                            </div>
                            <span className="text-sm text-amber-600">({product.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl font-bold text-amber-800">${product.price}</span>
                            {product.originalPrice && (
                              <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                            )}
                          </div>
                          <p className="text-amber-700 mb-6 leading-relaxed">
                            {product.description}
                          </p>
                          <Link to="/ProductDetails">
                            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 cursor-pointer">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {searchResults.length === 0 && (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-amber-300 mx-auto mb-4" />
                <h3 className="text-2xl font-serif font-bold text-amber-900 mb-4">No results found</h3>
                <p className="text-amber-700 mb-8 max-w-md mx-auto">
                  We couldn't find any products matching your search. Try adjusting your filters or search terms.
                </p>
                
                <div className="mb-8">
                  <h4 className="font-semibold text-amber-900 mb-4">Suggested searches:</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {suggestedSearches.map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchQuery(suggestion)}
                        className="border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Link to="/Products">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 cursor-pointer">
                    Browse All Products
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <Components.Footer />
    </div>
  )
}