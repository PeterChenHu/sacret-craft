'use client'

import React, { useState } from 'react'
import Components from '../components'
import { Link, useNavigate } from '@/lib'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock, User, Phone, Facebook, Chrome } from 'lucide-react'
import { useUser } from '../contexts/UserContext.js'
import { useTranslation } from 'react-i18next'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  })

  const { register } = useUser()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }
    
    // Validate terms agreement
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions')
      setIsLoading(false)
      return
    }
    
    try {
      const success = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirmPassword,
        phone: formData.phone,
        avatar: undefined
      })
      
      if (success) {
        navigate('/UserDashboard')
      } else {
        setError('Registration failed. Please try again.')
      }
    } catch (error) {
      setError('An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Components.Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {t('auth.register.title')}
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              {t('auth.register.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-amber-200 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">✝</span>
              </div>
              <CardTitle className="text-2xl font-serif text-amber-900">Create Account</CardTitle>
              <CardDescription className="text-amber-700">
                Join our community of faith and craftsmanship
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Social Registration Options */}
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-amber-200 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Sign up with Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-amber-200 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Sign up with Facebook
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-amber-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-amber-600">Or create account with email</span>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-amber-900 font-medium">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="pl-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-amber-900 font-medium">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="pl-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-amber-900 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-amber-900 font-medium">Phone Number (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-amber-900 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-amber-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-amber-600" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-amber-900 font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-amber-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-amber-600" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Terms and Newsletter */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked === true)}
                      className="border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 mt-1"
                      required
                    />
                    <Label htmlFor="terms" className="text-sm text-amber-700 cursor-pointer leading-relaxed">
                      I agree to the{' '}
                      <Link to="/Terms" className="text-amber-600 hover:text-amber-800 hover:underline">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link to="/Privacy" className="text-amber-600 hover:text-amber-800 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="newsletter" 
                      checked={formData.subscribeNewsletter}
                      onCheckedChange={(checked) => handleInputChange('subscribeNewsletter', checked === true)}
                      className="border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 mt-1"
                    />
                    <Label htmlFor="newsletter" className="text-sm text-amber-700 cursor-pointer leading-relaxed">
                      Subscribe to our newsletter for updates on new products and special offers
                    </Label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold"
                  disabled={!formData.agreeToTerms || isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
              </form>

              <div className="text-center pt-4">
                <p className="text-amber-700">
                  Already have an account?{' '}
                  <Link to="/Login" className="text-amber-600 hover:text-amber-800 font-semibold hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-amber-600 mb-4">
              Join thousands of faithful customers who trust Sacred Crafts for their religious art needs
            </p>
            <div className="flex justify-center space-x-6 text-sm text-amber-700">
              <Link to="/Help" className="hover:text-amber-900 hover:underline">Help Center</Link>
              <Link to="/Contact" className="hover:text-amber-900 hover:underline">Contact Support</Link>
            </div>
          </div>
        </div>
      </section>

      <Components.Footer />
    </div>
  )
}