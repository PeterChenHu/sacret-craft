'use client'

import React, { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  keywords?: string[]
}

export function SEO({ 
  title = 'Sacred Crafts - Handcrafted Religious Art',
  description = 'Discover our collection of beautiful wooden religious art pieces, each lovingly crafted to inspire faith and bring peace to your home.',
  image = '/placeholder-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  keywords = ['religious art', 'wooden crucifix', 'rosary', 'sacred crafts', 'handcrafted', 'faith', 'devotion']
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    // Basic meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords.join(', '))
    updateMetaTag('author', 'Sacred Crafts')
    updateMetaTag('robots', 'index, follow')

    // Open Graph tags
    updatePropertyTag('og:title', title)
    updatePropertyTag('og:description', description)
    updatePropertyTag('og:image', image)
    updatePropertyTag('og:url', url)
    updatePropertyTag('og:type', type)
    updatePropertyTag('og:site_name', 'Sacred Crafts')

    // Twitter Card tags
    updatePropertyTag('twitter:card', 'summary_large_image')
    updatePropertyTag('twitter:title', title)
    updatePropertyTag('twitter:description', description)
    updatePropertyTag('twitter:image', image)

    // Additional meta tags
    updateMetaTag('viewport', 'width=device-width, initial-scale=1')
    updateMetaTag('theme-color', '#d97706') // Amber color
    updateMetaTag('msapplication-TileColor', '#d97706')

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url

  }, [title, description, image, url, type, keywords])

  return null // This component doesn't render anything
} 