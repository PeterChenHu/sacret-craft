'use client'

import React, { useState, useEffect } from 'react'
import Components from '../components'
import { Link } from '@/lib'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Heart, Shield, Truck, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { apiService } from '../lib/api'

interface Product {
  id: number
  name: string
  price: string
  original_price?: string
  image?: string
  images?: string[]
  rating?: number
  category?: string
  badge?: string
}

export default function Landing() {
  const { t } = useTranslation()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        setError('')
        
        // Fetch products and randomly select 3 for display
        const productsData = await apiService.getProducts({ page: 1 }) as any
        
        if (productsData && productsData.results && productsData.results.length > 0) {
          // Randomly shuffle and pick 3 products
          const shuffled = [...productsData.results].sort(() => 0.5 - Math.random())
          const randomProducts = shuffled.slice(0, 3).map((product: any) => ({
            id: product.id,
            name: product.name,
            price: `$${product.price}`,
            original_price: product.original_price ? `$${product.original_price}` : undefined,
            image: product.images && product.images.length > 0 ? product.images[0] : product.image,
            rating: product.rating || 0,
            category: product.category?.name,
            badge: product.category?.name === 'Crucifixes' ? 'Bestseller' : 
                   product.category?.name === 'Rosaries' ? 'New' : 'Featured'
          }))
          
          setFeaturedProducts(randomProducts)
        } else {
          // Fallback to some default products if API fails
          setFeaturedProducts([
            {
              id: 1,
              name: "Handcrafted Wooden Crucifix",
              price: "$89.99",
              image: "https://wemxiqpkiyrwpffrdrgu.supabase.co/storage/v1/object/public/public-assets/projects/de6534b6-d3cc-4c7d-ae70-e0d5b1fc5ce3/559f20e7-5a83-4a2a-9405-0bed8abe02.jpeg",
              rating: 4.8,
              badge: "Bestseller"
            },
            {
              id: 2,
              name: "Carved Wooden Rosary",
              price: "$45.99",
              image: "https://wemxiqpkiyrwpffrdrgu.supabase.co/storage/v1/object/public/public-assets/projects/de6534b6-d3cc-4c7d-ae70-e0d5b1fc5ce3/31d23d4f-fc61-4ab9-a1ed-7bb7760703ad.jpeg",
              rating: 4.6,
              badge: "New"
            },
            {
              id: 3,
              name: "Virgin Mary Statue",
              price: "$124.99",
              image: "https://wemxiqpkiyrwpffrdrgu.supabase.co/storage/v1/object/public/public-assets/projects/de6534b6-d3cc-4c7d-ae70-e0d5b1fc5ce3/60e2f205-6330-443b-a38d-0e5750b80d3a.jpeg",
              rating: 4.9,
              badge: "Featured"
            }
          ])
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
        setError('Failed to load featured products')
        
        // Fallback to default products
        setFeaturedProducts([
          {
            id: 1,
            name: "Handcrafted Wooden Crucifix",
            price: "$89.99",
            image: "https://wemxiqpkiyrwpffrdrgu.supabase.co/storage/v1/object/public/public-assets/projects/de6534b6-d3cc-4c7d-ae70-e0d5b1fc5ce3/559f20e7-5a83-4a2a-9405-0bed8abe02.jpeg",
            rating: 4.8,
            badge: "Bestseller"
          },
          {
            id: 2,
            name: "Carved Wooden Rosary",
            price: "$45.99",
            image: "https://wemxiqpkiyrwpffrdrgu.supabase.co/storage/v1/object/public/public-assets/projects/de6534b6-d3cc-4c7d-ae70-e0d5b1fc5ce3/31d23d4f-fc61-4ab9-a1ed-7bb7760703ad.jpeg",
            rating: 4.6,
            badge: "New"
          },
          {
            id: 3,
            name: "Virgin Mary Statue",
            price: "$124.99",
            image: "https://wemxiqpkiyrwpffrdrgu.supabase.co/storage/v1/object/public/public-assets/projects/de6534b6-d3cc-4c7d-ae70-e0d5b1fc5ce3/60e2f205-6330-443b-a38d-0e5750b80d3a.jpeg",
            rating: 4.9,
            badge: "Featured"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Components.Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/placeholder-image.jpg')`
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              {t('landing.hero.title')}
              <span className="block text-2xl md:text-3xl font-normal text-amber-200 mt-2">
                {t('landing.hero.subtitle')}
              </span>
            </h1>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              {t('landing.hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/Products">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
                  {t('landing.hero.shopButton')}
                </Button>
              </Link>
              <Link to="/About">
                <Button variant="outline" size="lg" className="border-white text-orange-600 hover:bg-white hover:text-amber-900 px-8 py-3 text-lg font-semibold transition-all duration-200 cursor-pointer">
                  {t('landing.hero.storyButton')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-amber-900 mb-2">{t('landing.features.handcrafted.title')}</h3>
              <p className="text-amber-700 text-sm">{t('landing.features.handcrafted.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-amber-900 mb-2">{t('landing.features.quality.title')}</h3>
              <p className="text-amber-700 text-sm">{t('landing.features.quality.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-amber-900 mb-2">{t('landing.features.blessed.title')}</h3>
              <p className="text-amber-700 text-sm">{t('landing.features.blessed.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-amber-900 mb-2">{t('landing.features.delivery.title')}</h3>
              <p className="text-amber-700 text-sm">{t('landing.features.delivery.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-4">
              {t('landing.featured.title')}
            </h2>
            <p className="text-amber-700 text-lg max-w-2xl mx-auto">
              {t('landing.featured.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <Loader2 className="h-12 w-12 text-amber-600 animate-spin mx-auto" />
                <p className="mt-4 text-amber-700">Loading featured products...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12 text-amber-700">
                {error}
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-amber-700">
                No featured products found.
              </div>
            ) : (
              featuredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-amber-200 hover:border-amber-300">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge 
                        className={`absolute top-4 left-4 ${
                          product.badge === 'Bestseller' ? 'bg-amber-600' : 
                          product.badge === 'New' ? 'bg-green-600' : 'bg-blue-600'
                        } text-white`}
                      >
                        {product.badge}
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-amber-900 mb-2 text-lg">{product.name}</h3>
                      <p className="text-2xl font-bold text-amber-800 mb-4">{product.price}</p>
                      <Link to={`/ProductDetails/${product.id}`}>
                        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white cursor-pointer">
                          {t('landing.featured.viewDetails')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/Products">
              <Button variant="outline" size="lg" className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-3 cursor-pointer">
                {t('landing.featured.viewAll')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-amber-100 mb-8 leading-relaxed">
            {t('landing.cta.description')}
          </p>
          <Link to="/Products">
            <Button size="lg" variant="secondary" className="bg-white text-amber-800 hover:bg-amber-50 px-8 py-3 text-lg font-semibold cursor-pointer">
              {t('landing.cta.button')}
            </Button>
          </Link>
        </div>
      </section>

      <Components.Footer />
    </div>
  )
}