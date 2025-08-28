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
import { Eye, EyeOff, Mail, Lock, Facebook, Chrome } from 'lucide-react'
import { useUser } from '../contexts/UserContext.js'
import { useTranslation } from 'react-i18next'

export default function Login() {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useUser()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const success = await login(email, password)
      if (success) {
        navigate('/UserDashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (error) {
      setError('An error occurred during login')
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
              Welcome Back
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Sign in to your Sacred Crafts account to access your orders, wishlist, and personalized recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Login Form */}
      <section className="py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-amber-200 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">✝</span>
              </div>
              <CardTitle className="text-2xl font-serif text-amber-900">Sign In</CardTitle>
              <CardDescription className="text-amber-700">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Test User Section */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-amber-900 mb-2">🧪 Test User (Development Only)</h3>
                <div className="text-xs text-amber-700 space-y-1">
                  <p><strong>Email:</strong> test@example.com</p>
                  <p><strong>Password:</strong> password123</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
                    onClick={() => {
                      setEmail('test@example.com')
                      setPassword('password123')
                    }}
                  >
                    Fill Test Credentials
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
                    onClick={() => {
                      setEmail('test@example.com')
                      setPassword('password123')
                      handleSubmit(new Event('submit') as any)
                    }}
                  >
                    Auto Login
                  </Button>
                </div>
              </div>

              {/* Social Login Options */}
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-amber-200 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Continue with Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-amber-200 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Continue with Facebook
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-amber-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-amber-600">Or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-amber-900 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-amber-900 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                      className="border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                    />
                                          <Label htmlFor="remember" className="text-sm text-amber-700 cursor-pointer">
                        {t('auth.login.rememberMe')}
                      </Label>
                    </div>
                    <Link to="/ForgotPassword" className="text-sm text-amber-600 hover:text-amber-800 hover:underline">
                      {t('auth.login.forgotPassword')}
                    </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
              </form>

                              <div className="text-center pt-4">
                  <p className="text-amber-700">
                    {t('auth.login.noAccount')}{' '}
                    <Link to="/Register" className="text-amber-600 hover:text-amber-800 font-semibold hover:underline">
                      {t('auth.login.createAccount')}
                    </Link>
                  </p>
                </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-amber-600 mb-4">
              {t('termsOfServiceAndPrivacyPolicy')}
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