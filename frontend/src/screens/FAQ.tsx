'use client'

import React, { useState, useEffect } from 'react'
import Components from '../components'
import { Link } from '@/lib'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Package, 
  Truck, 
  CreditCard,
  Heart,
  Shield,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Star,
  Loader2
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { apiService } from '../lib/api'

interface FAQCategory {
  id: number
  name: string
  slug: string
  description: string
  is_active: boolean
  order: number
}

interface FAQItem {
  id: number
  question: string
  answer: string
  category: FAQCategory
  is_active: boolean
  is_featured: boolean
  order: number
  views: number
  helpful_votes: number
  unhelpful_votes: number
  helpful_percentage: number
  created_at: string
  updated_at: string
}

export default function FAQ() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openItems, setOpenItems] = useState<number[]>([])
  const [faqCategories, setFaqCategories] = useState<FAQCategory[]>([])
  const [faqItems, setFaqItems] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        setLoading(true)
        setError('')
        
        // Fetch categories and FAQs in parallel
        const [categoriesData, faqsData] = await Promise.all([
          apiService.getFAQCategories(),
          apiService.getFAQs()
        ])
        
        // Handle potential pagination structure
        const categoriesArray = Array.isArray(categoriesData) ? categoriesData : (categoriesData as any)?.results || []
        const faqsArray = Array.isArray(faqsData) ? faqsData : (faqsData as any)?.results || []
        
        // Validate that we have the expected data structure
        if (!Array.isArray(categoriesArray) || !Array.isArray(faqsArray)) {
          throw new Error('Invalid data structure received from API')
        }
        
        setFaqCategories(categoriesArray as FAQCategory[])
        setFaqItems(faqsArray as FAQItem[])
      } catch (error) {
        console.error('Failed to fetch FAQ data:', error)
        setError('Failed to load FAQ data')
      } finally {
        setLoading(false)
      }
    }

    fetchFAQData()
  }, [])

  // Add "All" category and calculate counts for each category
  const categoriesWithCounts = [
    { 
      id: 'all', 
      name: t('faq.categories.all'), 
      icon: HelpCircle, 
      count: Array.isArray(faqItems) ? faqItems.length : 0,
      slug: 'all'
    },
    ...(Array.isArray(faqCategories) ? faqCategories.map(category => ({
      id: category.id,
      name: category.name,
      icon: HelpCircle,
      count: Array.isArray(faqItems) ? faqItems.filter(item => item.category.slug === category.slug).length : 0,
      slug: category.slug
    })) : [])
  ]

  const filteredFAQs = Array.isArray(faqItems) ? faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || item.category.slug === selectedCategory
    
    return matchesSearch && matchesCategory
  }) : []

  const popularFAQs = Array.isArray(faqItems) ? faqItems.filter(item => item.is_featured) : []

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const isOpen = (id: number) => openItems.includes(id)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-amber-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <p className="text-amber-700 text-lg">{error}</p>
      </div>
    )
  }

  // Additional safety check to ensure data is loaded
  if (!Array.isArray(faqCategories) || !Array.isArray(faqItems)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-amber-700">Loading FAQ data...</p>
        </div>
      </div>
    )
  }

  // Additional check to ensure we have data
  if (faqCategories.length === 0 || faqItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <HelpCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <p className="text-amber-700">No FAQ data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Components.Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            {t('faq.title')}
          </h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto mb-8">
            {t('faq.subtitle')}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-600" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('faq.searchPlaceholder')}
                className="pl-10 bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card className="border-amber-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-amber-900 mb-4">{t('faq.browseByCategory')}</h3>
                <div className="space-y-2">
                  {categoriesWithCounts.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`w-full text-left px-3 py-3 rounded-md text-sm transition-colors flex items-center space-x-3 ${
                        selectedCategory === category.slug
                          ? 'bg-amber-100 text-amber-900 font-medium'
                          : 'text-amber-700 hover:bg-amber-50'
                      }`}
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span className="flex-1">{category.name}</span>
                      <Badge variant="secondary" className="bg-amber-200 text-amber-800 text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Questions */}
            <Card className="border-amber-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-amber-900 mb-4">{t('faq.popularQuestions')}</h3>
                <div className="space-y-3">
                  {popularFAQs.slice(0, 5).map((faq) => (
                    <button
                      key={faq.id}
                      onClick={() => {
                        setSelectedCategory('all')
                        setSearchQuery('')
                        toggleItem(faq.id)
                      }}
                      className="w-full text-left p-3 rounded-md text-sm text-amber-700 hover:bg-amber-50 transition-colors border border-amber-100"
                    >
                      <div className="flex items-start space-x-2">
                        <Star className="h-3 w-3 text-amber-500 mt-1 flex-shrink-0" />
                        <span className="leading-tight">{faq.question}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="border-amber-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-amber-900 mb-4">{t('faq.stillNeedHelp')}</h3>
                <p className="text-amber-700 text-sm mb-4">
                  {t('faq.customerServiceDescription')}
                </p>
                <div className="space-y-3">
                  <Link to="/Contact">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white cursor-pointer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {t('faq.contactSupport')}
                    </Button>
                  </Link>
                  <div className="text-center space-y-2 text-xs text-amber-600">
                    <div className="flex items-center justify-center space-x-2 mt-2.5">
                      <Phone className="h-3 w-3" />
                      <span>(555) 123-4567</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="h-3 w-3" />
                      <span>support@sacredcrafts.com</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>{t('faq.businessHours')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-amber-900">
                {filteredFAQs.length} {t('faq.questionsFound')}
              </h2>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-600">
                  {searchQuery && `for "${searchQuery}"`}
                </span>
              </div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="border-amber-200">
                  <Collapsible open={isOpen(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                    <CollapsibleTrigger className="w-full">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-4 text-left">
                            {faq.is_featured && (
                              <Star className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                            )}
                            <div>
                              <h3 className="font-semibold text-amber-900 text-lg leading-tight">
                                {faq.question}
                              </h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {/* Tags will be added later if available from API */}
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            {isOpen(faq.id) ? (
                              <ChevronUp className="h-5 w-5 text-amber-600" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-amber-600" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="px-6 pb-6 pt-0">
                        <div className="border-t border-amber-100 pt-4">
                          <p className="text-amber-700 leading-relaxed">
                            {faq.answer}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-xs text-amber-600">
                              {t('faq.wasThisHelpful')}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost" className="text-amber-600 hover:bg-amber-50 cursor-pointer">
                                👍 {t('faq.yes')}
                              </Button>
                              <Button size="sm" variant="ghost" className="text-amber-600 hover:bg-amber-50 cursor-pointer">
                                👎 {t('faq.no')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredFAQs.length === 0 && (
              <div className="text-center py-16">
                <HelpCircle className="h-16 w-16 text-amber-300 mx-auto mb-4" />
                <h3 className="text-2xl font-serif font-bold text-amber-900 mb-4">{t('faq.noQuestionsFound')}</h3>
                <p className="text-amber-700 mb-8 max-w-md mx-auto">
                  {t('faq.noQuestionsDescription')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 cursor-pointer"
                  >
                    {t('faq.viewAllQuestions')}
                  </Button>
                  <Link to="/Contact">
                    <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-3 cursor-pointer">
                      {t('faq.askAQuestion')}
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-amber-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Package className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-amber-900 mb-2">{t('faq.quickActions.trackOrder.title')}</h3>
                  <p className="text-amber-700 text-sm mb-4">
                    {t('faq.quickActions.trackOrder.description')}
                  </p>
                  <Link to="/OrderTracking">
                    <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer">
                      {t('faq.quickActions.trackOrder.button')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-amber-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-amber-900 mb-2">{t('faq.quickActions.careInstructions.title')}</h3>
                  <p className="text-amber-700 text-sm mb-4">
                    {t('faq.quickActions.careInstructions.description')}
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
                    onClick={() => {
                      setSelectedCategory('all') // Assuming 'care' category is not directly mapped to a slug
                      setSearchQuery('')
                    }}
                  >
                    {t('faq.quickActions.careInstructions.button')}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-amber-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-amber-900 mb-2">{t('faq.quickActions.customOrders.title')}</h3>
                  <p className="text-amber-700 text-sm mb-4">
                    {t('faq.quickActions.customOrders.description')}
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
                    onClick={() => {
                      setSelectedCategory('all') // Assuming 'custom' category is not directly mapped to a slug
                      setSearchQuery('')
                    }}
                  >
                    {t('faq.quickActions.customOrders.button')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Components.Footer />
    </div>
  )
}