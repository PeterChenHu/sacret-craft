'use client'

import React, { useState } from 'react'
import Components from '../components'
import { Link, useNavigate } from '@/lib'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Shield, CreditCard, Truck, ArrowLeft, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { useCart } from '../contexts/CartContext.js'
import { useTranslation } from 'react-i18next'

// WeChat Pay Icon Component
const WeChatPayIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.882-1.932 7.621-.896.273-2.042-.096-4.255-1.808-5.698C13.491 3.95 11.207 2.188 8.691 2.188zm-2.902 5.548c0-.488.4-.884.893-.884.494 0 .894.396.894.884 0 .488-.4.884-.894.884-.493 0-.893-.396-.893-.884zm5.812 0c0-.488.4-.884.894-.884.493 0 .893.396.893.884 0 .488-.4.884-.893.884-.494 0-.894-.396-.894-.884z"/>
    <path d="M19.287 12.503c-.276 0-.543.027-.811.05.857 2.578-.157 4.972-1.932 6.446-1.703 1.415-4.882 1.932-7.621.896-.273 2.042.096 4.255 1.808 5.698 2.17 1.86 4.454 3.622 6.97 3.622 4.8 0 8.691-3.288 8.691-7.342 0-2.212-1.17-4.203-3.002-5.55a.59.59 0 0 0-.213-.665l.39-1.48c.019-.07.048-.141.048-.213 0-.163-.13-.295-.29-.295a.326.326 0 0 0-.167.054l-1.903 1.114a.864.864 0 0 1-.717.098z"/>
  </svg>
)

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  const [step, setStep] = useState(1)
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [orderComplete, setOrderComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    termsAccepted: false
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Components.Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-12 w-12 text-amber-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-amber-900 mb-4">{t('cart.empty.title')}</h1>
            <p className="text-amber-700 mb-6 text-lg">
              {t('checkout.emptyCartMessage')}
            </p>
            <Link to="/Products">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 cursor-pointer">
                {t('cart.empty.button')}
              </Button>
            </Link>
          </div>
        </div>
        <Components.Footer />
      </div>
    )
  }

  const subtotal = getCartTotal()
  const shipping = subtotal >= 75 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    if (!formData.address) newErrors.address = 'Address is required'
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.state) newErrors.state = 'State is required'
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required'
    
    if (step >= 2 && paymentMethod === 'credit_card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required'
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required'
      if (!formData.cvv) newErrors.cvv = 'CVV is required'
      if (!formData.cardName) newErrors.cardName = 'Name on card is required'
    }
    
    // For WeChat Pay, PayPal, and Bank Transfer, no additional validation needed
    if (step >= 2 && (paymentMethod === 'wechat_pay' || paymentMethod === 'paypal' || paymentMethod === 'bank_transfer')) {
      // These payment methods handle their own authentication
    }
    
    if (step === 3 && !formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateForm()) {
      setStep(prev => prev + 1)
    }
  }

  const handleCompleteOrder = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Clear cart and show success
    clearCart()
    setOrderComplete(true)
    setIsSubmitting(false)
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Components.Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-amber-900 mb-4">{t('orderConfirmation.title')}</h1>
            <p className="text-amber-700 mb-6 text-lg">
              {t('orderConfirmation.subtitle')}
            </p>
            
            <Card className="border-amber-200 max-w-md mx-auto mb-8">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-amber-900 mb-2">{t('orderConfirmation.orderNumber')}</h3>
                <p className="text-amber-700 text-sm mb-4">
                  {t('orderConfirmation.emailSent')}
                </p>
                <Badge className="bg-amber-600 text-white">Processing</Badge>
              </CardContent>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/Products">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 cursor-pointer">
                  {t('orderConfirmation.continueShopping')}
                </Button>
              </Link>
              <Link to="/Landing">
                <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-3 cursor-pointer">
                  {t('orderConfirmation.returnHome')}
                </Button>
              </Link>
            </div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold text-white mb-2">{t('checkout.title')}</h1>
              <p className="text-xl text-amber-100">{t('checkout.subtitle')}</p>
            </div>
            <div className="flex items-center space-x-2 text-amber-100">
              <Shield className="h-6 w-6" />
              <span className="text-sm">{t('checkout.sslSecured')}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Steps */}
            <div className="flex items-center space-x-4 mb-8">
              <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-amber-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <span className="font-medium">{t('checkout.steps.shipping')}</span>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-amber-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span className="font-medium">{t('checkout.steps.payment')}</span>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-amber-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 3 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <span className="font-medium">{t('checkout.steps.review')}</span>
              </div>
            </div>

            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900 flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>{t('checkout.shipping.title')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t('checkout.form.firstName')}</Label>
                      <div className="mt-1">
                        <Input 
                          id="firstName" 
                          placeholder={t('checkout.form.firstNamePlaceholder')} 
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="border-amber-200"
                        />
                      </div>
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t('checkout.form.lastName')}</Label>
                      <div className="mt-1">
                        <Input 
                          id="lastName" 
                          placeholder={t('checkout.form.lastNamePlaceholder')} 
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="border-amber-200"
                        />
                      </div>
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">{t('checkout.form.email')}</Label>
                    <div className="mt-1">
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder={t('checkout.form.emailPlaceholder')} 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="border-amber-200"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">{t('checkout.form.phone')}</Label>
                    <div className="mt-1">
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder={t('checkout.form.phonePlaceholder')} 
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="border-amber-200"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="address">{t('checkout.form.address')}</Label>
                    <div className="mt-1">
                      <Input 
                        id="address" 
                        placeholder={t('checkout.form.addressPlaceholder')} 
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="border-amber-200"
                      />
                    </div>
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">{t('checkout.form.city')}</Label>
                      <div className="mt-1">
                        <Input 
                          id="city" 
                          placeholder={t('checkout.form.cityPlaceholder')} 
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="border-amber-200"
                        />
                      </div>
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state">{t('checkout.form.state')}</Label>
                      <div className="mt-1">
                        <Select 
                          onValueChange={(value) => handleInputChange('state', value)}
                          defaultValue={formData.state}
                        >
                          <SelectTrigger className="border-amber-200">
                            <SelectValue placeholder={t('checkout.form.statePlaceholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ny">New York</SelectItem>
                            <SelectItem value="ca">California</SelectItem>
                            <SelectItem value="tx">Texas</SelectItem>
                            <SelectItem value="fl">Florida</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <Label htmlFor="zip">{t('checkout.form.zipCode')}</Label>
                      <div className="mt-1">
                        <Input 
                          id="zip" 
                          placeholder={t('checkout.form.zipCodePlaceholder')} 
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className="border-amber-200"
                        />
                      </div>
                      {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">{t('checkout.form.notes')}</Label>
                    <div className="mt-1">
                      <Textarea 
                        id="notes" 
                        placeholder={t('checkout.form.notesPlaceholder')}
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        className="border-amber-200"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleNextStep}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('checkout.processing') : t('checkout.continueToPayment')}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Billing Address */}
                <Card className="border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-amber-900">{t('checkout.billing.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox 
                        id="sameAsShipping" 
                        checked={sameAsShipping}
                        onCheckedChange={(checked) => setSameAsShipping(checked === true)}
                      />
                      <Label htmlFor="sameAsShipping">{t('checkout.billing.sameAsShipping')}</Label>
                    </div>
                    
                    {!sameAsShipping && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billFirstName">First Name</Label>
                            <div className="mt-1">
                              <Input 
                                id="billFirstName" 
                                placeholder="John" 
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className="border-amber-200"
                              />
                            </div>
                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                          </div>
                          <div>
                            <Label htmlFor="billLastName">Last Name</Label>
                            <div className="mt-1">
                              <Input 
                                id="billLastName" 
                                placeholder="Doe" 
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className="border-amber-200"
                              />
                            </div>
                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="billAddress">Street Address</Label>
                          <div className="mt-1">
                            <Input 
                              id="billAddress" 
                              placeholder="123 Main Street" 
                              value={formData.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                              className="border-amber-200"
                            />
                          </div>
                          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="billCity">City</Label>
                            <div className="mt-1">
                              <Input 
                                id="billCity" 
                                placeholder="New York" 
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                className="border-amber-200"
                              />
                            </div>
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                          </div>
                          <div>
                            <Label htmlFor="billState">State</Label>
                            <div className="mt-1">
                              <Select 
                                onValueChange={(value) => handleInputChange('state', value)}
                                defaultValue={formData.state}
                              >
                                <SelectTrigger className="border-amber-200">
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ny">New York</SelectItem>
                                  <SelectItem value="ca">California</SelectItem>
                                  <SelectItem value="tx">Texas</SelectItem>
                                  <SelectItem value="fl">Florida</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                          </div>
                          <div>
                            <Label htmlFor="billZip">ZIP Code</Label>
                            <div className="mt-1">
                              <Input 
                                id="billZip" 
                                placeholder="10001" 
                                value={formData.zipCode}
                                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                className="border-amber-200"
                              />
                            </div>
                            {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-amber-900 flex items-center space-x-2">
                      <CreditCard className="h-5 w-5" />
                      <span>{t('checkout.payment.title')}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <Label htmlFor="credit_card" className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4 text-amber-600" />
                          <span>{t('checkout.payment.creditCard')}</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex items-center space-x-2">
                          <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.067 8.478c.492 0 .889.398.889.889 0 .491-.397.889-.889.889H18.93c-.491 0-.889-.398-.889-.889 0-.491.398-.889.889-.889h1.137zm-1.137 2.667c.491 0 .889.398.889.889 0 .491-.398.889-.889.889h-1.137c-.491 0-.889-.398-.889-.889 0-.491.398-.889.889-.889h1.137z"/>
                            <path d="M12.5 0C5.596 0 0 5.596 0 12.5S5.596 25 12.5 25 25 19.404 25 12.5 19.404 0 12.5 0zm0 23.214c-5.92 0-10.714-4.794-10.714-10.714S6.58 1.786 12.5 1.786 23.214 6.58 23.214 12.5 18.42 23.214 12.5 23.214z"/>
                          </svg>
                          <span>{t('checkout.payment.paypal')}</span>
                        </Label>
                      </div>
                      <div className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${paymentMethod === 'wechat_pay' ? 'bg-green-50 border border-green-200' : ''}`}>
                        <RadioGroupItem value="wechat_pay" id="wechat_pay" />
                        <Label htmlFor="wechat_pay" className="flex items-center space-x-2 cursor-pointer">
                          <WeChatPayIcon className="h-4 w-4 text-green-600" />
                          <span>{t('checkout.payment.wechatPay')}</span>
                          <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            {t('language.popular')}
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                        <Label htmlFor="bank_transfer" className="flex items-center space-x-2">
                          <svg className="h-4 w-4 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          <span>{t('checkout.payment.bankTransfer')}</span>
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {paymentMethod === 'credit_card' && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">{t('checkout.payment.cardNumber')}</Label>
                          <div className="mt-1">
                            <Input 
                              id="cardNumber" 
                              placeholder={t('checkout.payment.cardNumberPlaceholder')} 
                              value={formData.cardNumber}
                              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                              className="border-amber-200"
                            />
                          </div>
                          {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">{t('checkout.payment.expiryDate')}</Label>
                            <div className="mt-1">
                              <Input 
                                id="expiry" 
                                placeholder={t('checkout.payment.expiryDatePlaceholder')} 
                                value={formData.expiryDate}
                                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                className="border-amber-200"
                              />
                            </div>
                            {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                          </div>
                          <div>
                            <Label htmlFor="cvv">{t('checkout.payment.cvv')}</Label>
                            <div className="mt-1">
                              <Input 
                                id="cvv" 
                                placeholder={t('checkout.payment.cvvPlaceholder')} 
                                value={formData.cvv}
                                onChange={(e) => handleInputChange('cvv', e.target.value)}
                                className="border-amber-200"
                              />
                            </div>
                            {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cardName">{t('checkout.payment.nameOnCard')}</Label>
                          <div className="mt-1">
                            <Input 
                              id="cardName" 
                              placeholder={t('checkout.payment.nameOnCardPlaceholder')} 
                              value={formData.cardName}
                              onChange={(e) => handleInputChange('cardName', e.target.value)}
                              className="border-amber-200"
                            />
                          </div>
                          {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'wechat_pay' && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <WeChatPayIcon className="h-6 w-6 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-green-900 mb-2">{t('checkout.payment.wechatPay')}</h4>
                            <p className="text-sm text-green-700 mb-3">
                              {t('checkout.payment.wechatPayInfo')}
                            </p>
                            <div className="text-xs text-green-600">
                              <p>• {t('checkout.payment.secureProcessing')}</p>
                              <p>• {t('checkout.payment.instantConfirmation')}</p>
                              <p>• {t('checkout.payment.noAdditionalFees')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'paypal' && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <svg className="h-6 w-6 text-blue-600 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.067 8.478c.492 0 .889.398.889.889 0 .491-.397.889-.889.889H18.93c-.491 0-.889-.398-.889-.889 0-.491.398-.889.889-.889h1.137zm-1.137 2.667c.491 0 .889.398.889.889 0 .491-.398.889-.889.889h-1.137c-.491 0-.889-.398-.889-.889 0-.491.398-.889.889-.889h1.137z"/>
                            <path d="M12.5 0C5.596 0 0 5.596 0 12.5S5.596 25 12.5 25 25 19.404 25 12.5 19.404 0 12.5 0zm0 23.214c-5.92 0-10.714-4.794-10.714-10.714S6.58 1.786 12.5 1.786 23.214 6.58 23.214 12.5 18.42 23.214 12.5 23.214z"/>
                          </svg>
                          <div className="flex-1">
                            <h4 className="font-medium text-blue-900 mb-2">{t('checkout.payment.paypal')}</h4>
                            <p className="text-sm text-blue-700 mb-3">
                              {t('checkout.payment.paypalInfo')}
                            </p>
                            <div className="text-xs text-blue-600">
                              <p>• {t('checkout.payment.secureProcessing')}</p>
                              <p>• {t('checkout.payment.instantConfirmation')}</p>
                              <p>• {t('checkout.payment.buyerProtection')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'bank_transfer' && (
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <svg className="h-6 w-6 text-purple-600 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          <div className="flex-1">
                            <h4 className="font-medium text-purple-900 mb-2">{t('checkout.payment.bankTransfer')}</h4>
                            <p className="text-sm text-purple-700 mb-3">
                              {t('checkout.payment.bankTransferInfo')}
                            </p>
                            <div className="text-xs text-purple-600">
                              <p>• {t('checkout.payment.secureProcessing')}</p>
                              <p>• {t('checkout.payment.noAdditionalFees')}</p>
                              <p>• {t('checkout.payment.buyerProtection')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm text-amber-700">
                      <Lock className="h-4 w-4" />
                      <span>{t('checkout.payment.secureMessage')}</span>
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button 
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
                        disabled={isSubmitting}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('checkout.back')}
                      </Button>
                      <Button 
                        onClick={handleNextStep}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                        disabled={isSubmitting}
                      >
                        {t('checkout.reviewOrder')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Order Review */}
            {step === 3 && (
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900">{t('checkout.review.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-3">{t('checkout.review.shippingAddress')}</h3>
                    <div className="text-amber-700 text-sm">
                      <p>{formData.firstName} {formData.lastName}</p>
                      <p>{formData.address}</p>
                      <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                      <p>{formData.email}</p>
                      <p>{formData.phone}</p>
                    </div>
                  </div>
                  
                  <Separator className="bg-amber-200" />
                  
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-3">{t('checkout.payment.title')}</h3>
                                          <div className="text-amber-700 text-sm">
                        <p>
                          {paymentMethod === 'credit_card' 
                            ? `Credit Card ending in ${formData.cardNumber.slice(-4)}` 
                            : paymentMethod === 'paypal' 
                            ? 'PayPal' 
                            : paymentMethod === 'wechat_pay' 
                            ? 'WeChat Pay' 
                            : paymentMethod === 'bank_transfer'
                            ? 'Bank Transfer'
                            : 'Credit Card'
                          }
                        </p>
                      </div>
                  </div>
                  
                  <Separator className="bg-amber-200" />
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
                    />
                    <Label htmlFor="terms" className="text-sm text-amber-700">
                      {t('checkout.review.termsAgreement')} <Link to="/Terms" className="text-amber-600 hover:underline">{t('checkout.review.termsOfService')}</Link> {t('checkout.review.and')} <Link to="/Privacy" className="text-amber-600 hover:underline">{t('checkout.review.privacyPolicy')}</Link>
                    </Label>
                    {errors.termsAccepted && <p className="text-red-500 text-xs mt-1">{errors.termsAccepted}</p>}
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button 
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
                      disabled={isSubmitting}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleCompleteOrder}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t('checkout.completingOrder') : `${t('checkout.completeOrder')} - $${total.toFixed(2)}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border-amber-200 sticky top-24">
              <CardHeader>
                <CardTitle className="text-amber-900">{t('checkout.summary.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex space-x-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <Badge className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs">
                          {item.quantity}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-amber-900 text-sm">{item.name}</h4>
                        <p className="text-amber-700 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="bg-amber-200" />
                
                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-amber-700">
                    <span>{t('checkout.summary.subtotal')}</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>{t('checkout.summary.shipping')}</span>
                    <span>{shipping === 0 ? t('checkout.summary.free') : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>{t('checkout.summary.tax')}</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-amber-200" />
                  <div className="flex justify-between text-xl font-bold text-amber-900">
                    <span>{t('checkout.summary.total')}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Badge */}
            <Card className="border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 text-amber-700">
                  <Shield className="h-8 w-8 text-amber-600" />
                  <div>
                    <h4 className="font-semibold text-amber-900">{t('checkout.security.title')}</h4>
                    <p className="text-sm">{t('checkout.security.description')}</p>
                  </div>
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