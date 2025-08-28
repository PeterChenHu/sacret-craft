'use client'

import React from 'react'
import { Link } from '@/lib'
import { Separator } from '@/components/ui/separator'
import { Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-amber-50 border-t border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">✝</span>
              </div>
              <span className="text-xl font-serif font-bold text-amber-900">Sacred Crafts</span>
            </div>
            <p className="text-amber-700 text-sm leading-relaxed">
              Handcrafted wooden religious art pieces made with devotion and care. Each piece tells a story of faith and craftsmanship.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-amber-900">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/Landing" className="text-amber-700 hover:text-amber-900 text-sm transition-colors">
                Home
              </Link>
              <Link to="/Products" className="text-amber-700 hover:text-amber-900 text-sm transition-colors">
                Products
              </Link>
              <Link to="/About" className="text-amber-700 hover:text-amber-900 text-sm transition-colors">
                About Us
              </Link>
              <Link to="/Cart" className="text-amber-700 hover:text-amber-900 text-sm transition-colors">
                Shopping Cart
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-amber-900">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-amber-600" />
                <span className="text-amber-700 text-sm">info@sacredcrafts.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-amber-600" />
                <span className="text-amber-700 text-sm">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-amber-600" />
                <span className="text-amber-700 text-sm">123 Faith Street, Artisan City</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-amber-600 hover:text-amber-800 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-amber-600 hover:text-amber-800 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-amber-200" />
        
        <div className="text-center text-amber-700 text-sm">
          <p>&copy; {currentYear} Sacred Crafts. All rights reserved. Made with faith and dedication.</p>
        </div>
      </div>
    </footer>
  )
}