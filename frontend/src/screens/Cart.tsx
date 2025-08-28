'use client'

import React from 'react'
import Components from '../components'
import { Link } from '@/lib'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, Shield, Heart } from 'lucide-react'
import { useCart } from '../contexts/CartContext.js'
import { TAX_RATE, FREE_SHIPPING_THRESHOLD } from '../constants/index.js'
import { useTranslation } from 'react-i18next'

export default function Cart() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    getCartSavings 
  } = useCart()
  const { t } = useTranslation()

  const subtotal = getCartTotal()
  const savings = getCartSavings()
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99
  const tax = subtotal * TAX_RATE
  const total = subtotal + shipping + tax

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Components.Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-amber-300 mx-auto mb-6" />
            <h1 className="text-3xl font-serif font-bold text-amber-900 mb-4">{t('cart.empty.title')}</h1>
            <p className="text-amber-700 mb-8 text-lg">
              {t('cart.empty.description')}
            </p>
            <Link to="/Products">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg cursor-pointer">
                {t('cart.empty.button')}
              </Button>
            </Link>
          </div>
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
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {t('cart.title')}
            </h1>
            <p className="text-xl text-amber-100">
              {t('cart.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <Card key={item.id} className="border-amber-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative flex-shrink-0">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-amber-100 flex items-center justify-center text-amber-400 text-sm rounded-lg">
                            No Image
                          </div>
                        )}
                        {item.badge && (
                          <Badge className="absolute -top-2 -left-2 bg-amber-600 text-white">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-amber-900 text-lg mb-2">{item.name}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-amber-800">
                              ${item.price.toFixed(2)}
                            </span>
                            {item.originalPrice && (
                              <span className="text-amber-500 line-through">
                                ${item.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 p-0 border-amber-300 hover:bg-amber-50"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium text-amber-900">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0 border-amber-300 hover:bg-amber-50"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-amber-700">
                            Total: ${(item.price * item.quantity).toFixed(2)}
                          </span>
                                                     <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => removeFromCart(item.id)}
                             className="text-red-600 hover:text-red-700 hover:bg-red-50"
                           >
                             <Trash2 className="h-4 w-4 mr-1" />
                             Remove
                           </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="border-amber-200 sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-bold text-amber-900 mb-6">{t('cart.summary.title')}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-amber-700">
                      <span>{t('cart.summary.subtotal')} ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} {t('cart.summary.items')})</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {savings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>{t('cart.summary.savings')}</span>
                        <span>-${savings.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-amber-700">
                      <span>{t('cart.summary.shipping')}</span>
                      <span>{shipping === 0 ? t('cart.summary.freeShipping') : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    
                    <div className="flex justify-between text-amber-700">
                      <span>{t('cart.summary.tax')}</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    
                    <Separator className="bg-amber-200" />
                    
                    <div className="flex justify-between text-xl font-bold text-amber-900">
                      <span>{t('cart.summary.total')}</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <Link to="/Checkout">
                      <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold cursor-pointer">
                        {t('cart.summary.proceedToCheckout')}
                      </Button>
                    </Link>
                    
                    <Link to="/Products">
                      <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer py-3 text-lg font-semibold mt-2">
                        {t('cart.summary.continueShopping')}
                      </Button>
                    </Link>
                  </div>

                  {/* Shipping Info */}
                  {subtotal < FREE_SHIPPING_THRESHOLD && (
                    <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center space-x-2 text-amber-700">
                        <Truck className="h-4 w-4" />
                        <span className="text-sm">
                          {t('cart.shipping.freeShippingThreshold', { amount: (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2) })}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Guarantees */}
              <Card className="border-amber-200">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-amber-900 mb-4">{t('cart.shipping.guarantees.title')}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm text-amber-700">
                      <Shield className="h-4 w-4 text-amber-600" />
                      <span>{t('cart.shipping.guarantees.quality')}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-amber-700">
                      <Truck className="h-4 w-4 text-amber-600" />
                      <span>{t('cart.shipping.guarantees.packaging')}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-amber-700">
                      <Heart className="h-4 w-4 text-amber-600" />
                      <span>{t('cart.shipping.guarantees.blessed')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Components.Footer />
    </div>
  )
}