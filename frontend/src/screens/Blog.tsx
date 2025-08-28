'use client'

import React, { useState } from 'react'
import Components from '../components'
import { Link } from '@/lib'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Calendar, 
  User, 
  ArrowRight, 
  Clock,
  Heart,
  Share2,
  BookOpen,
  Tag
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Blog() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const blogPosts = [
    {
      id: 1,
      title: "The Sacred Art of Woodcarving: A Journey Through Faith",
      excerpt: "Discover the ancient tradition of religious woodcarving and how our artisans continue this sacred craft with prayer and devotion.",
      content: "For centuries, woodcarving has been a sacred art form used to express faith and devotion...",
      image: "https://wemxiqpkiyrwpffrdrgu.supabase.co/storage/v1/object/public/public-assets/projects/de6534b6-d3cc-4c7d-ae70-e0d5b1fc5ce3/559f20e7-5a83-4a2a-9405-0d0bed8abe02",
      author: "Brother Michael",
      date: "2024-01-28",
      readTime: "5 min read",
      category: "Craftsmanship",
      tags: ["woodcarving", "tradition", "faith", "artisans"],
      featured: true,
      likes: 42,
      comments: 8
    },
    {
      id: 2,
      title: "Creating Sacred Spaces: Home Altar Design Ideas",
      excerpt: "Transform a corner of your home into a peaceful sanctuary with these thoughtful design tips and sacred art pieces.",
      content: "A home altar serves as a focal point for prayer and meditation...",
      image: "https://wemxiqpkiyrwpffrdrgu.supabase.co/storage/v1/object/public/public-assets/projects/de6534b6-d3cc-4c7d-ae70-e0d5b1fc5ce3/991754a6-c11b-41ee-94bd-b6a8f02f9cf4",
      author: "Sister Catherine",
      date: "2024-01-25",
      readTime: "7 min read",
      category: "Home & Faith",
      tags: ["home altar", "sacred space", "design", "prayer"],
      featured: false,
      likes: 38,
      comments: 12
    },
    {
      id: 3,
      title: "The History and Symbolism of the Crucifix",
      excerpt: "Explore the rich history and deep symbolism behind the crucifix, Christianity's most recognizable symbol.",
      content: "The crucifix has been central to Christian faith for nearly two millennia...",
      image: "https://wemxiqpkiyrwpffrdrgu.supabase.co/storage/v1/object/public/public-assets/projects/de6534b6-d3cc-4c7d-ae70-e0d5b1fc5ce3/559f20e7-5a83-4a2a-9405-0d0bed8abe02",
      author: "Father Thomas",
      date: "2024-01-22",
      readTime: "6 min read",
      category: "Faith & Tradition",
      tags: ["crucifix", "symbolism", "history", "Christianity"],
      featured: true,
      likes: 56,
      comments: 15
    },
    {
      id: 4,
      title: "Behind the Scenes: A Day in Our Workshop",
      excerpt: "Take a glimpse into our sacred workshop where skilled artisans craft each piece with prayer and attention to detail.",
      content: "Every morning begins with prayer as our artisans prepare for another day of sacred work...",
      image: "https://wemxiqpkiyrwpffrdrgu.supabase.co/storage/v1/object/public/public-assets/projects/de6534b6-d3cc-4c7d-ae70-e0d5b1fc5ce3/4323f2ca-4314-491d-bdc1-70b1ca54009d",
      author: "Master Craftsman John",
      date: "2024-01-20",
      readTime: "4 min read",
      category: "Behind the Scenes",
      tags: ["workshop", "artisans", "crafting", "process"],
      featured: false,
      likes: 29,
      comments: 6
    },
    {
      id: 5,
      title: "The Power of Prayer Beads: A Guide to the Rosary",
      excerpt: "Learn about the spiritual significance of the rosary and how this ancient prayer practice can deepen your faith.",
      content: "The rosary is more than just a string of beads; it's a powerful tool for meditation and prayer...",
      image: "https://wemxiqpkiyrwpffrdrgu.supabase.co/storage/v1/object/public/public-assets/projects/de6534b6-d3cc-4c7d-ae70-e0d5b1fc5ce3/31d23d4f-fc61-4ab9-a1ed-7bb7760703ad",
      author: "Sister Mary",
      date: "2024-01-18",
      readTime: "8 min read",
      category: "Faith & Tradition",
      tags: ["rosary", "prayer", "meditation", "spirituality"],
      featured: false,
      likes: 44,
      comments: 18
    },
    {
      id: 6,
      title: "Sustainable Woodworking: Our Commitment to Creation",
      excerpt: "Discover how we honor God's creation through sustainable practices and responsible sourcing of our materials.",
      content: "As stewards of God's creation, we believe in using sustainable practices in all our work...",
      image: "https://wemxiqpkiyrwpffrdrgu.supabase.co/storage/v1/object/public/public-assets/projects/de6534b6-d3cc-4c7d-ae70-e0d5b1fc5ce3/991754a6-c11b-41ee-94bd-b6a8f02f9cf4",
      author: "Environmental Coordinator Sarah",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Sustainability",
      tags: ["sustainability", "environment", "woodworking", "stewardship"],
      featured: false,
      likes: 33,
      comments: 9
    }
  ]

  const categories = [
    { value: 'all', label: 'All Categories', count: blogPosts.length },
    { value: 'craftsmanship', label: 'Craftsmanship', count: blogPosts.filter(p => p.category === 'Craftsmanship').length },
    { value: 'faith-tradition', label: 'Faith & Tradition', count: blogPosts.filter(p => p.category === 'Faith & Tradition').length },
    { value: 'home-faith', label: 'Home & Faith', count: blogPosts.filter(p => p.category === 'Home & Faith').length },
    { value: 'behind-scenes', label: 'Behind the Scenes', count: blogPosts.filter(p => p.category === 'Behind the Scenes').length },
    { value: 'sustainability', label: 'Sustainability', count: blogPosts.filter(p => p.category === 'Sustainability').length }
  ]

  const popularTags = [
    'woodcarving', 'faith', 'prayer', 'tradition', 'craftsmanship', 
    'spirituality', 'home altar', 'rosary', 'crucifix', 'artisans'
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || 
                           post.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '') === selectedCategory.replace('-', '')
    
    return matchesSearch && matchesCategory
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'popular':
        return b.likes - a.likes
      case 'newest':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })

  const featuredPosts = blogPosts.filter(post => post.featured)
  const recentPosts = blogPosts.slice(0, 3)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Components.Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto mb-8">
            {t('blog.subtitle')}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-600" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('blog.searchPlaceholder')}
                className="pl-10 bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Posts */}
            {searchQuery === '' && selectedCategory === 'all' && (
              <div className="mb-12">
                <h2 className="text-2xl font-serif font-bold text-amber-900 mb-6">{t('blog.featuredArticles')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredPosts.slice(0, 2).map((post) => (
                    <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-amber-200 hover:border-amber-300">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <Badge className="absolute top-4 left-4 bg-amber-600 text-white">
                            {t('blog.featured')}
                          </Badge>
                        </div>
                        <div className="p-6">
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 mb-3">
                            {post.category}
                          </Badge>
                          <h3 className="font-semibold text-amber-900 mb-3 text-lg group-hover:text-amber-700 transition-colors leading-tight">
                            {post.title}
                          </h3>
                          <p className="text-amber-700 text-sm mb-4 leading-relaxed">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-amber-600 mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {post.author}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(post.date)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {post.readTime}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-amber-600">
                              <div className="flex items-center">
                                <Heart className="h-3 w-3 mr-1" />
                                {post.likes}
                              </div>
                              <div>{post.comments} {t('blog.comments')}</div>
                            </div>
                            <Button size="sm" variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer">
                              {t('blog.readMore')}
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-amber-900 mb-2">
                  {searchQuery || selectedCategory !== 'all' ? t('blog.searchResults') : t('blog.latestArticles')}
                </h2>
                <p className="text-amber-700">
                  {sortedPosts.length} {t('blog.articlesFound', { count: sortedPosts.length })}
                  {searchQuery && ` ${t('blog.forSearch', { query: searchQuery })}`}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 border-amber-200">
                    <SelectValue placeholder={t('blog.category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 border-amber-200">
                    <SelectValue placeholder={t('blog.sortBy')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t('blog.sortOptions.newest')}</SelectItem>
                    <SelectItem value="oldest">{t('blog.sortOptions.oldest')}</SelectItem>
                    <SelectItem value="popular">{t('blog.sortOptions.popular')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Blog Posts */}
            <div className="space-y-8">
              {sortedPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-amber-200 hover:border-amber-300">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-80 h-48 md:h-auto flex-shrink-0">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover md:rounded-l-lg md:rounded-tr-none rounded-t-lg"
                        />
                        {post.featured && (
                          <Badge className="absolute top-4 left-4 bg-amber-600 text-white">
                            {t('blog.featured')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            {post.category}
                          </Badge>
                          <div className="flex items-center space-x-4 text-xs text-amber-600">
                            <div className="flex items-center">
                              <Heart className="h-3 w-3 mr-1" />
                              {post.likes}
                            </div>
                            <div>{post.comments} {t('blog.comments')}</div>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-amber-900 mb-3 text-xl group-hover:text-amber-700 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-amber-700 mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="border-amber-300 text-amber-700 text-xs">
                              <Tag className="h-2 w-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="border-amber-300 text-amber-700 text-xs">
                              +{post.tags.length - 3} {t('blog.more')}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-amber-600">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {post.author}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(post.date)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {post.readTime}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="text-amber-600 hover:bg-amber-50 cursor-pointer">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer">
                              {t('blog.readMore')}
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {sortedPosts.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-amber-300 mx-auto mb-4" />
                <h3 className="text-2xl font-serif font-bold text-amber-900 mb-4">{t('blog.noArticlesFound')}</h3>
                <p className="text-amber-700 mb-8 max-w-md mx-auto">
                  {t('blog.noArticlesDescription')}
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 cursor-pointer"
                >
                  {t('blog.viewAllArticles')}
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Posts */}
            <Card className="border-amber-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-amber-900 mb-4">{t('blog.recentArticles')}</h3>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="flex space-x-3 group cursor-pointer">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-amber-900 text-sm group-hover:text-amber-700 transition-colors leading-tight mb-1">
                          {post.title}
                        </h4>
                        <div className="text-xs text-amber-600 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(post.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="border-amber-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-amber-900 mb-4">{t('blog.categories')}</h3>
                <div className="space-y-2">
                  {categories.filter(cat => cat.value !== 'all').map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category.value
                          ? 'bg-amber-100 text-amber-900 font-medium'
                          : 'text-amber-700 hover:bg-amber-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category.label}</span>
                        <Badge variant="secondary" className="bg-amber-200 text-amber-800 text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="border-amber-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-amber-900 mb-4">{t('blog.popularTags')}</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs hover:bg-amber-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="border-amber-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-amber-900 mb-4">{t('blog.stayUpdated')}</h3>
                <p className="text-amber-700 text-sm mb-4">
                  {t('blog.newsletterDescription')}
                </p>
                <div className="space-y-3">
                  <Input
                    placeholder={t('blog.emailPlaceholder')}
                    className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white cursor-pointer">
                    {t('blog.subscribe')}
                  </Button>
                </div>
                <p className="text-xs text-amber-600 mt-2">
                  {t('blog.privacyNotice')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Components.Footer />
    </div>
  )
}