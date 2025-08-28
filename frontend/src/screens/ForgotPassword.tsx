'use client'

import React, { useState } from 'react'
import Components from '../components'
import { Link, useNavigate } from '@/lib'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // Simulate password reset request
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demo purposes, we'll simulate success
      // In a real app, this would make an API call
      setIsSubmitted(true)
    } catch (error) {
      setError(t('auth.forgotPassword.errorMessage'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/Login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Components.Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {t('auth.forgotPassword.title')}
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              {t('auth.forgotPassword.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Reset Password Form */}
      <section className="py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-amber-200 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">✝</span>
              </div>
              <CardTitle className="text-2xl font-serif text-amber-900">
                {isSubmitted ? t('auth.forgotPassword.successTitle') : t('auth.forgotPassword.formTitle')}
              </CardTitle>
              <CardDescription className="text-amber-700">
                {isSubmitted 
                  ? t('auth.forgotPassword.successSubtitle')
                  : t('auth.forgotPassword.formSubtitle')
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!isSubmitted ? (
                <>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-amber-900 font-medium">
                        {t('auth.forgotPassword.email')}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                        <Input
                          id="email"
                          type="email"
                          placeholder={t('auth.forgotPassword.emailPlaceholder')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold"
                      disabled={isLoading || !email}
                    >
                      {isLoading ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.sendButton')}
                    </Button>
                    
                    {error && (
                      <div className="flex items-center space-x-2 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    )}
                  </form>

                  <div className="text-center pt-4">
                    <Button
                      variant="ghost"
                      onClick={handleBackToLogin}
                      className="text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t('auth.forgotPassword.backToLogin')}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-amber-900">
                      Reset Link Sent!
                    </h3>
                    <p className="text-amber-700 text-sm">
                      {t('auth.forgotPassword.successMessage')} <strong>{email}</strong>
                    </p>
                    <p className="text-amber-600 text-xs">
                      {t('auth.forgotPassword.successInstructions')}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button
                      onClick={handleSubmit}
                      variant="outline"
                      className="w-full border-amber-200 text-amber-600 hover:bg-amber-50"
                    >
                      {t('auth.forgotPassword.resendEmail')}
                    </Button>
                    
                    <Button
                      onClick={handleBackToLogin}
                      variant="ghost"
                      className="w-full text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                    >
                      {t('auth.forgotPassword.backToLogin')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-amber-600 mb-4">
              {t('auth.forgotPassword.needHelp')}
            </p>
            <div className="flex justify-center space-x-6 text-sm text-amber-700">
              <Link to="/Help" className="hover:text-amber-900 hover:underline">
                {t('auth.forgotPassword.helpCenter')}
              </Link>
              <Link to="/Contact" className="hover:text-amber-900 hover:underline">
                {t('auth.forgotPassword.contactSupport')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Components.Footer />
    </div>
  )
} 