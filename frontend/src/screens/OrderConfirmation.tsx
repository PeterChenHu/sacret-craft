'use client'

import React from 'react'
import Components from '../components'
import { Link } from '@/lib'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Mail, 
  Download, 
  Heart,
  ArrowRight,
  Calendar,
  MapPin
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function OrderConfirmation() {
  const { t } = useTranslation()
  const orderDetails = {
    orderNumber: 'SC-2024-001',
    orderDate: 'January 30, 2024',
    estimatedDelivery: 'February 5-7, 2024',
    status: 'Processing',
    email: 'maria.santos@email.com',
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
    },
    {
      id: 3,
      name: "Virgin Mary Statue",
      price: 124.99,
      quantity: 1,
      image: "/placeholder-image.jpg"
    }
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 0 // Free shipping
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const recommendedProducts = [
    {
      id: 4,
      name: "Sacred Heart Plaque",
      price: 78.99,
      image: "/placeholder-image.jpg"
    },
    {
      id: 5,
      name: "Angel Guardian Statue",
      price: 145.99,
      image: "/placeholder-image.jpg"
    },
    {
      id: 6,
      name: "Prayer Beads Set",
      price: 32.99,
      image: "/placeholder-image.jpg"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Components.Header />
      
      {/* Success Header */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            {t('orderConfirmation.title')}
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Thank you for your order. Your sacred art pieces will be carefully crafted and shipped with love and prayer.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Information */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Order Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Order Number</h3>
                    <p className="text-amber-700 font-mono text-lg">{orderDetails.orderNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Order Date</h3>
                    <p className="text-amber-700">{orderDetails.orderDate}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Status</h3>
                    <Badge className="bg-amber-600 text-white">
                      <Package className="h-3 w-3 mr-1" />
                      {orderDetails.status}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Estimated Delivery</h3>
                    <p className="text-amber-700 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {orderDetails.estimatedDelivery}
                    </p>
                  </div>
                </div>

                <Separator className="bg-amber-200" />

                <div>
                  <h3 className="font-semibold text-amber-900 mb-3">Shipping Address</h3>
                  <div className="text-amber-700 flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{orderDetails.shippingAddress.name}</p>
                      <p>{orderDetails.shippingAddress.address}</p>
                      <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer">
                    <Truck className="h-4 w-4 mr-2" />
                    Track Your Order
                  </Button>
                  <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Items Ordered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-amber-100 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-900">{item.name}</h4>
                        <p className="text-amber-700">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-900">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-amber-700">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What's Next */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900">Order Confirmation Email</h4>
                      <p className="text-amber-700 text-sm">
                        We've sent a confirmation email to {orderDetails.email} with your order details and receipt.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900">Handcrafting Process</h4>
                      <p className="text-amber-700 text-sm">
                        Our skilled artisans will carefully craft your pieces with prayer and devotion. This process typically takes 2-3 business days.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900">Shipping & Delivery</h4>
                      <p className="text-amber-700 text-sm">
                        Once ready, your order will be carefully packaged and shipped. You'll receive tracking information via email.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Recommendations */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-amber-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-amber-200" />
                  <div className="flex justify-between text-xl font-bold text-amber-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Benefits */}
            <Card className="border-amber-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <Heart className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-amber-900 mb-2">Create an Account</h3>
                  <p className="text-amber-700 text-sm mb-4">
                    Save your preferences, track orders, and get exclusive offers on future purchases.
                  </p>
                  <Link to="/Register">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white cursor-pointer">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Products */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">You Might Also Like</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedProducts.map((product) => (
                    <div key={product.id} className="flex items-center space-x-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-amber-900 text-sm">{product.name}</h4>
                        <p className="text-amber-700 text-sm font-bold">${product.price}</p>
                      </div>
                      <Link to="/ProductDetails">
                        <Button size="sm" variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer">
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Link to="/Products">
                    <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer">
                      Browse All Products
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link to="/Products">
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 cursor-pointer">
                Continue Shopping
              </Button>
            </Link>
            <Link to="/Landing">
              <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-3 cursor-pointer">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Components.Footer />
    </div>
  )
}