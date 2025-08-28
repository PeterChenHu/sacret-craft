'use client'

import React, { useState } from 'react'
import Components from '../components'
import { Link } from '@/lib'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  CheckCircle, 
  Eye, 
  EyeOff,
  Shield,
  AlertCircle
} from 'lucide-react'

export default function PasswordReset() {
  const [step, setStep] = useState(1) // 1: Email, 2: Email Sent, 3: Reset Password, 4: Success
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    if (!email) {
      setErrors({ email: 'Email address is required' })
      return
    }
    
    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' })
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
    }, 1500)
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    if (!newPassword) {
      setErrors({ password: 'New password is required' })
      return
    }
    
    if (!validatePassword(newPassword)) {
      setErrors({ password: 'Password must be at least 8 characters long' })
      return
    }
    
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' })
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep(4)
    }, 1500)
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    if (strength <= 2) return { level: 'Weak', color: 'bg-red-500', width: '33%' }
    if (strength <= 3) return { level: 'Medium', color: 'bg-amber-500', width: '66%' }
    return { level: 'Strong', color: 'bg-green-500', width: '100%' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Components.Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Reset Your Password
          </h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            {step === 1 && "Enter your email address and we'll send you a link to reset your password."}
            {step === 2 && "Check your email for password reset instructions."}
            {step === 3 && "Create a new secure password for your account."}
            {step === 4 && "Your password has been successfully reset."}
          </p>
        </div>
      </section>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Step 1: Enter Email */}
        {step === 1 && (
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900 text-center">
                Forgot Your Password?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-amber-900">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className={`pl-10 mt-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <div className="text-center">
                  <Link to="/Login" className="text-amber-600 hover:text-amber-800 text-sm">
                    <ArrowLeft className="h-4 w-4 inline mr-1" />
                    Back to Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Email Sent */}
        {step === 2 && (
          <Card className="border-amber-200">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4">
                Check Your Email
              </h2>
              
              <p className="text-amber-700 mb-6">
                We've sent a password reset link to <strong>{email}</strong>. 
                Click the link in the email to reset your password.
              </p>

              <Alert className="border-amber-200 bg-amber-50 mb-6">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-700">
                  Didn't receive the email? Check your spam folder or wait a few minutes for it to arrive.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <Button 
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="w-full border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
                >
                  Try Different Email
                </Button>
                
                <Button 
                  onClick={handleEmailSubmit}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? 'Resending...' : 'Resend Email'}
                </Button>
              </div>

              <div className="mt-6 text-center">
                <Link to="/Login" className="text-amber-600 hover:text-amber-800 text-sm">
                  <ArrowLeft className="h-4 w-4 inline mr-1" />
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900 text-center">
                Create New Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                  <Label htmlFor="newPassword" className="text-amber-900">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className={`pl-10 pr-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500 ${
                        errors.password ? 'border-red-500' : ''
                      }`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                  )}
                  
                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-amber-700 mb-1">
                        <span>Password Strength</span>
                        <span>{getPasswordStrength(newPassword).level}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrength(newPassword).color}`}
                          style={{ width: getPasswordStrength(newPassword).width }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-amber-900">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className={`pl-10 pr-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500 ${
                        errors.confirmPassword ? 'border-red-500' : ''
                      }`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <Alert className="border-amber-200 bg-amber-50">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-700">
                    <strong>Password Requirements:</strong>
                    <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                      <li>At least 8 characters long</li>
                      <li>Include uppercase and lowercase letters</li>
                      <li>Include at least one number</li>
                      <li>Include at least one special character</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <Button 
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating Password...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <Card className="border-amber-200">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4">
                Password Reset Successful!
              </h2>
              
              <p className="text-amber-700 mb-8">
                Your password has been successfully updated. You can now log in with your new password.
              </p>

              <div className="space-y-4">
                <Link to="/Login">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 cursor-pointer">
                    Continue to Login
                  </Button>
                </Link>
                
                <Link to="/Landing">
                  <Button 
                    variant="outline"
                    className="w-full border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
                  >
                    Return to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <Alert className="border-amber-200 bg-amber-50">
            <Shield className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700 text-sm">
              <strong>Security Notice:</strong> For your protection, password reset links expire after 1 hour. 
              If you didn't request this reset, please contact our support team immediately.
            </AlertDescription>
          </Alert>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-amber-700 text-sm mb-2">Need help?</p>
          <Link to="/Contact" className="text-amber-600 hover:text-amber-800 text-sm font-medium">
            Contact our support team
          </Link>
        </div>
      </div>

      <Components.Footer />
    </div>
  )
}