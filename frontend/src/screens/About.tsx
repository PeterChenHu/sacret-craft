'use client'

import React, { useState, useEffect } from 'react'
import Components from '../components'
import { Link } from '@/lib'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Users, Award, Hammer, Church, Star, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function About() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [activeMilestone, setActiveMilestone] = useState(0)
  
  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Auto-rotate milestones
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMilestone((prev) => (prev + 1) % 5)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const artisans = [
    {
      name: t('about.artisans.antonio.name'),
      role: t('about.artisans.antonio.role'),
      experience: t('about.artisans.antonio.experience'),
      specialty: t('about.artisans.antonio.specialty'),
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description: t('about.artisans.antonio.description')
    },
    {
      name: t('about.artisans.maria.name'),
      role: t('about.artisans.maria.role'),
      experience: t('about.artisans.maria.experience'),
      specialty: t('about.artisans.maria.specialty'),
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      description: t('about.artisans.maria.description')
    },
    {
      name: t('about.artisans.michael.name'),
      role: t('about.artisans.michael.role'),
      experience: t('about.artisans.michael.experience'),
      specialty: t('about.artisans.michael.specialty'),
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      description: t('about.artisans.michael.description')
    }
  ]

  const values = [
    {
      icon: Heart,
      title: t('about.values.faith.title'),
      description: t('about.values.faith.description')
    },
    {
      icon: Hammer,
      title: t('about.values.craftsmanship.title'),
      description: t('about.values.craftsmanship.description')
    },
    {
      icon: Award,
      title: t('about.values.quality.title'),
      description: t('about.values.quality.description')
    },
    {
      icon: Users,
      title: t('about.values.community.title'),
      description: t('about.values.community.description')
    }
  ]

  const milestones = [
    {
      year: "1985",
      title: t('about.journey.milestones.1985.title'),
      description: t('about.journey.milestones.1985.description')
    },
    {
      year: "1995",
      title: t('about.journey.milestones.1995.title'),
      description: t('about.journey.milestones.1995.description')
    },
    {
      year: "2005",
      title: t('about.journey.milestones.2005.title'),
      description: t('about.journey.milestones.2005.description')
    },
    {
      year: "2015",
      title: t('about.journey.milestones.2015.title'),
      description: t('about.journey.milestones.2015.description')
    },
    {
      year: "2024",
      title: t('about.journey.milestones.2024.title'),
      description: t('about.journey.milestones.2024.description')
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-amber-700 font-medium">{t('about.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Components.Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/placeholder-image.jpg')`
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              {t('about.hero.title')}
              <span className="block text-2xl md:text-3xl font-normal text-amber-200 mt-2">
                {t('about.hero.subtitle')}
              </span>
            </h1>
            <p className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('about.hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Church className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-6">{t('about.mission.title')}</h2>
          <p className="text-xl text-amber-700 leading-relaxed mb-8">
            {t('about.mission.description')}
          </p>
          <div className="flex justify-center">
            <Link to="/Products">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg cursor-pointer">
                {t('about.mission.button')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-4">{t('about.values.title')}</h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-amber-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-amber-900 mb-3 text-lg">{value.title}</h3>
                  <p className="text-amber-700 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-4">{t('about.journey.title')}</h2>
            <p className="text-xl text-black max-w-2xl mx-auto">
              {t('about.journey.subtitle')}
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-amber-300"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'} transition-all duration-500 ${
                    index === activeMilestone ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
                  }`}
                  onClick={() => setActiveMilestone(index)}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow-lg z-10 transition-all duration-300 ${
                    index === activeMilestone ? 'bg-amber-600 scale-125' : 'bg-amber-400'
                  }`}></div>
                  
                  {/* Content Card */}
                  <Card className={`w-full max-w-md border-amber-200 cursor-pointer transition-all duration-300 ${
                    index % 2 === 0 ? 'mr-auto pr-8' : 'ml-auto pl-8'
                  } ${index === activeMilestone ? 'shadow-xl border-amber-400' : 'hover:shadow-lg'}`}>
                    <CardContent className="p-6">
                      <Badge className="bg-amber-600 text-white mb-3">{milestone.year}</Badge>
                      <h3 className="font-semibold text-black mb-2 text-lg">{milestone.title}</h3>
                      <p className="text-black text-sm leading-relaxed">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Artisans */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-4">{t('about.artisans.title')}</h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">
              {t('about.artisans.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {artisans.map((artisan, index) => (
              <Card key={index} className="border-amber-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={artisan.image} 
                      alt={artisan.name}
                      className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <Badge className="bg-amber-600 text-white mb-2">{artisan.experience}</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-amber-900 mb-1 text-xl">{artisan.name}</h3>
                    <p className="text-amber-600 font-medium mb-2">{artisan.role}</p>
                    <p className="text-sm text-amber-800 font-medium mb-3">Specialty: {artisan.specialty}</p>
                    <p className="text-amber-700 text-sm leading-relaxed">{artisan.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                {t('about.quality.title')}
              </h2>
              <div className="space-y-4 text-amber-100">
                <div className="flex items-start space-x-3">
                  <Star className="h-6 w-6 text-amber-200 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{t('about.quality.materials.title')}</h3>
                    <p>{t('about.quality.materials.description')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="h-6 w-6 text-amber-200 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{t('about.quality.techniques.title')}</h3>
                    <p>{t('about.quality.techniques.description')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="h-6 w-6 text-amber-200 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{t('about.quality.blessed.title')}</h3>
                    <p>{t('about.quality.blessed.description')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="h-6 w-6 text-amber-200 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{t('about.quality.guarantee.title')}</h3>
                    <p>{t('about.quality.guarantee.description')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop" 
                alt="Artisan at work"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-6">
            {t('about.cta.title')}
          </h2>
          <p className="text-xl text-amber-700 mb-8 leading-relaxed">
            {t('about.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/Products">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg cursor-pointer">
                {t('about.cta.shopButton')}
              </Button>
            </Link>
            <Link to="/Contact">
              <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-3 text-lg cursor-pointer">
                {t('about.cta.contactButton')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Components.Footer />
    </div>
  )
}