'use client'

import React, { useState } from 'react'
import Components from '../components'
import { Link } from '@/lib'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Calendar,
  Phone,
  Mail,
  Search,
  Download,
  Share2,
  AlertCircle,
  ArrowRight
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function OrderTracking() {
  const { t } = useTranslation()
  const [trackingNumber, setTrackingNumber] = useState('SC-2024-001')
  const [isTracking, setIsTracking] = useState(true)

  const orderDetails = {
    orderNumber: 'SC-2024-001',
    trackingNumber: 'TRK789456123',
    orderDate: 'January 30, 2024',
    estimatedDelivery: 'February 5, 2024',
    actualDelivery: null,
    status: 'In Transit',
    carrier: 'FedEx',
    shippingMethod: 'Standard Shipping',
    shippingAddress: {
      name: 'Maria Santos',
      address: '123 Faith Street',
      city: 'Artisan City',
      state: 'CA',
      zip: '90210'
    }
  }

  const orderItems = [
    {
      id: 1,
      name: "Handcrafted Wooden Crucifix",
      price: 89.99,
      quantity: 1,
      image: "/placeholder-image.jpg"
    },
    {
      id: 2,
      name: "Carved Wooden Rosary",
      price: 45.99,
      quantity: 2,
      image: "/placeholder-image.jpg"
    }
  ]

  const trackingHistory = [
    {
      status: 'Order Placed',
      description: 'Your order has been received and is being prepared',
      date: 'January 30, 2024',
      time: '2:30 PM',
      location: 'Sacred Crafts Workshop, Artisan City, CA',
      completed: true
    },
    {
      status: 'Crafting in Progress',
      description: 'Our artisans are carefully handcrafting your pieces with prayer and devotion',
      date: 'January 31, 2024',
      time: '9:00 AM',
      location: 'Sacred Crafts Workshop, Artisan City, CA',
      completed: true
    },
    {
      status: 'Quality Check & Blessing',
      description: 'Items have been blessed and passed quality inspection',
      date: 'February 1, 2024',
      time: '3:45 PM',
      location: 'Sacred Crafts Workshop, Artisan City, CA',
      completed: true
    },
    {
      status: 'Shipped',
      description: 'Package has been carefully packaged and shipped via FedEx',
      date: 'February 2, 2024',
      time: '11:20 AM',
      location: 'FedEx Facility, Los Angeles, CA',
      completed: true
    },
    {
      status: 'In Transit',
      description: 'Package is on its way to your delivery address',
      date: 'February 3, 2024',
      time: '6:15 AM',
      location: 'FedEx Facility, Sacramento, CA',
      completed: true,
      current: true
    },
    {
      status: 'Out for Delivery',
      description: 'Package is out for delivery and will arrive today',
      date: 'February 5, 2024',
      time: 'Expected',
      location: 'Local Delivery Facility',
      completed: false
    },
    {
      status: 'Delivered',
      description: 'Package has been successfully delivered',
      date: 'February 5, 2024',
      time: 'Expected',
      location: orderDetails.shippingAddress.address,
      completed: false
    }
  ]

  const getStatusIcon = (status: string, completed: boolean, current: boolean = false) => {
    if (completed) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    } else if (current) {
      return <Clock className="h-5 w-5 text-amber-600" />
    } else {
      return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getProgressPercentage = () => {
    const completedSteps = trackingHistory.filter(step => step.completed).length
    return (completedSteps / trackingHistory.length) * 100
  }

  const handleTrackOrder = () => {
    setIsTracking(true)
  }

  if (!isTracking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Components.Header />
        
        {/* Page Header */}
        <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {t('orderTracking.title')}
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              {t('orderTracking.subtitle')}
            </p>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900 text-center">{t('orderTracking.enterTrackingInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="tracking" className="text-amber-900">{t('orderTracking.orderOrTrackingNumber')}</Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder={t('orderTracking.placeholder')}
                  className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              
              <Button 
                onClick={handleTrackOrder}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold cursor-pointer"
              >
                <Search className="h-4 w-4 mr-2" />
                {t('orderTracking.trackOrder')}
              </Button>
              
              <div className="text-center text-sm text-amber-600">
                <p>{t('orderTracking.needHelp')} <Link to="/Contact" className="underline hover:text-amber-800">{t('orderTracking.contactSupport')}</Link></p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Components.Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Components.Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
                {t('orderTracking.orderTracking')}
              </h1>
              <p className="text-xl text-amber-100">
                {t('orderTracking.orderNumber', { number: orderDetails.orderNumber })}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-600 text-white px-4 py-2 text-lg">
                <Truck className="h-4 w-4 mr-2" />
                {orderDetails.status}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Tracking Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">{t('orderTracking.deliveryProgress')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between text-sm text-amber-700">
                  <span>{t('orderTracking.orderPlaced')}</span>
                  <span>{t('orderTracking.delivered')}</span>
                </div>
                <Progress value={getProgressPercentage()} className="h-3" />
                <div className="text-center">
                  <p className="text-lg font-semibold text-amber-900">
                    {t('orderTracking.estimatedDelivery', { date: orderDetails.estimatedDelivery })}
                  </p>
                  <p className="text-amber-700">
                    {t('orderTracking.onTheWay')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Current Status */}
            <Card className="border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-amber-900 mb-2">
                      {t('orderTracking.packageInTransit')}
                    </h3>
                    <p className="text-amber-700 mb-4">
                      {t('orderTracking.inTransitDescription')}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-amber-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        Sacramento, CA
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {t('orderTracking.lastUpdated', { date: 'Feb 3, 6:15 AM' })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking History */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">{t('orderTracking.trackingHistory')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingHistory.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(step.status, step.completed, step.current)}
                        {index < trackingHistory.length - 1 && (
                          <div className={`w-px h-12 mt-2 ${
                            step.completed ? 'bg-green-600' : 'bg-gray-300'
                          }`} />
                        )}
                      </div>
                      
                      <div className={`flex-1 pb-6 ${step.current ? 'bg-amber-50 -mx-4 px-4 py-4 rounded-lg' : ''}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <h3 className={`font-semibold ${
                            step.completed ? 'text-green-900' : 
                            step.current ? 'text-amber-900' : 'text-gray-600'
                          }`}>
                            {step.status}
                          </h3>
                          <div className="text-sm text-amber-600">
                            {step.date} • {step.time}
                          </div>
                        </div>
                        <p className={`text-sm mb-2 ${
                          step.completed ? 'text-green-700' : 
                          step.current ? 'text-amber-700' : 'text-gray-500'
                        }`}>
                          {step.description}
                        </p>
                        <div className={`flex items-center text-xs ${
                          step.completed ? 'text-green-600' : 
                          step.current ? 'text-amber-600' : 'text-gray-400'
                        }`}>
                          <MapPin className="h-3 w-3 mr-1" />
                          {step.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Instructions */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>{t('orderTracking.deliveryInformation')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">{t('orderTracking.specialHandling')}</h4>
                  <p className="text-amber-700 text-sm">
                    {t('orderTracking.specialHandlingDescription')}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-semibold text-amber-900 mb-1">{t('orderTracking.deliveryAddress')}</h5>
                    <div className="text-amber-700">
                      <p>{orderDetails.shippingAddress.name}</p>
                      <p>{orderDetails.shippingAddress.address}</p>
                      <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip}</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-amber-900 mb-1">{t('orderTracking.carrierInformation')}</h5>
                    <div className="text-amber-700">
                      <p>{t('orderTracking.carrier')}: {orderDetails.carrier}</p>
                      <p>{t('orderTracking.service')}: {orderDetails.shippingMethod}</p>
                      <p>{t('orderTracking.tracking')}: {orderDetails.trackingNumber}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">{t('orderTracking.orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-amber-900 text-sm">{item.name}</h4>
                      <p className="text-amber-700 text-sm">{t('orderTracking.qty', { quantity: item.quantity })} • ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                
                <Separator className="bg-amber-200" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-amber-700">
                    <span>{t('orderTracking.subtotal')}</span>
                    <span>${orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>{t('orderTracking.shipping')}</span>
                    <span className="text-green-600">{t('orderTracking.free')}</span>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>{t('orderTracking.tax')}</span>
                    <span>${(orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator className="bg-amber-200" />
                  <div className="flex justify-between font-bold text-amber-900">
                    <span>{t('orderTracking.total')}</span>
                    <span>${(orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">{t('orderTracking.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('orderTracking.downloadInvoice')}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {t('orderTracking.shareTracking')}
                </Button>
                
                <Link to="/Contact">
                  <Button 
                    variant="outline" 
                    className="w-full border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {t('orderTracking.contactSupport')}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card className="border-amber-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="font-semibold text-amber-900 mb-3">{t('orderTracking.needHelp')}</h3>
                  <p className="text-amber-700 text-sm mb-4">
                    {t('orderTracking.customerServiceDescription')}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center space-x-2 text-amber-600">
                      <Phone className="h-4 w-4" />
                      <span>(555) 123-4567</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-amber-600">
                      <Mail className="h-4 w-4" />
                      <span>support@sacredcrafts.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Products */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">{t('orderTracking.completeCollection')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="/placeholder-image.jpg"
                      alt="Sacred Heart Plaque"
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-amber-900 text-sm">Sacred Heart Plaque</h4>
                      <p className="text-amber-700 text-sm">$78.99</p>
                    </div>
                    <Link to="/ProductDetails">
                      <Button size="sm" variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer">
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link to="/Products">
                    <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer">
                      {t('orderTracking.browseAllProducts')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Components.Footer />
    </div>
  )
}