'use client'

import React, { useState } from 'react'
import Components from '../components'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  HelpCircle,
  Send,
  CheckCircle,
  Facebook,
  Instagram,
  Heart
} from 'lucide-react'

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const faqItems = [
    {
      question: "How long does it take to craft and ship my order?",
      answer: "Each piece is handcrafted with care and prayer. Crafting typically takes 2-3 business days, followed by 3-5 business days for shipping. Rush orders may be available upon request."
    },
    {
      question: "What materials are used in your wooden art pieces?",
      answer: "We use premium hardwoods including oak, walnut, and cherry. All wood is sustainably sourced and treated with natural, non-toxic finishes that are safe for homes and families."
    },
    {
      question: "Can I request custom designs or personalization?",
      answer: "Yes! We offer custom engraving and personalization services. Contact us with your specific requirements, and our artisans will work with you to create a unique piece."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we ship within the United States and Canada. International shipping may be available for special orders - please contact us for details."
    },
    {
      question: "What is your return and exchange policy?",
      answer: "We offer a 30-day return policy for unused items in original condition. Due to the handcrafted nature of our pieces, custom orders are final sale unless there's a defect."
    },
    {
      question: "Are your pieces blessed or consecrated?",
      answer: "Yes, each piece is crafted with prayer and blessed by our team before shipping. We believe this adds spiritual significance to every creation."
    }
  ]

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@sacredcrafts.com",
      availability: "24/7 - We respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our team",
      contact: "(555) 123-4567",
      availability: "Mon-Fri: 9AM-6PM EST"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with us in real-time",
      contact: "Available on website",
      availability: "Mon-Fri: 9AM-6PM EST"
    }
  ]

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Components.Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-amber-900 mb-4">Message Sent!</h1>
            <p className="text-amber-700 mb-6 text-lg">
              Thank you for contacting Sacred Crafts. We've received your message and will respond within 24 hours.
            </p>
            
            <Card className="border-amber-200 max-w-md mx-auto mb-8">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-amber-900 mb-2">What's Next?</h3>
                <p className="text-amber-700 text-sm mb-4">
                  Our customer service team will review your inquiry and get back to you with a personalized response.
                </p>
                <div className="text-amber-600 text-sm">
                  <p>Expected response time: Within 24 hours</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setFormSubmitted(false)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 cursor-pointer"
              >
                Send Another Message
              </Button>
              <Button 
                onClick={() => window.location.href = '/Products'}
                variant="outline" 
                className="border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-3 cursor-pointer"
              >
                Browse Products
              </Button>
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
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            We're here to help with any questions about our sacred art pieces or your order.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Send Us a Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-amber-900">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your full name"
                        className="mt-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-amber-900">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        className="mt-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="inquiryType" className="text-amber-900">Inquiry Type</Label>
                    <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange('inquiryType', value)}>
                      <SelectTrigger className="mt-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Question</SelectItem>
                        <SelectItem value="order">Order Support</SelectItem>
                        <SelectItem value="custom">Custom Order Request</SelectItem>
                        <SelectItem value="shipping">Shipping & Delivery</SelectItem>
                        <SelectItem value="return">Returns & Exchanges</SelectItem>
                        <SelectItem value="wholesale">Wholesale Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-amber-900">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Brief description of your inquiry"
                      className="mt-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-amber-900">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                      className="mt-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold cursor-pointer"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <method.icon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900">{method.title}</h3>
                      <p className="text-amber-700 text-sm mb-1">{method.description}</p>
                      <p className="font-medium text-amber-800">{method.contact}</p>
                      <p className="text-amber-600 text-xs">{method.availability}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Business Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-amber-700">Monday - Friday</span>
                    <span className="text-amber-900 font-medium">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Saturday</span>
                    <span className="text-amber-900 font-medium">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Sunday</span>
                    <span className="text-amber-900 font-medium">Closed</span>
                  </div>
                  <Separator className="bg-amber-200 my-3" />
                  <p className="text-amber-600 text-xs">
                    Email support is available 24/7 with responses within 24 hours.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Visit Our Workshop</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-amber-700">
                    <p className="font-medium text-amber-900">Sacred Crafts Workshop</p>
                    <p>123 Faith Street</p>
                    <p>Artisan City, CA 90210</p>
                  </div>
                  <p className="text-amber-600 text-sm">
                    Visits by appointment only. Contact us to schedule a tour of our workshop and see our artisans at work.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
                  >
                    Schedule a Visit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-amber-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="font-semibold text-amber-900 mb-3">Follow Our Journey</h3>
                  <p className="text-amber-700 text-sm mb-4">
                    See our latest creations and behind-the-scenes crafting process
                  </p>
                  <div className="flex justify-center space-x-4">
                    <a href="#" className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors">
                      <Facebook className="h-5 w-5 text-amber-600" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors">
                      <Instagram className="h-5 w-5 text-amber-600" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-amber-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-amber-700 text-lg max-w-2xl mx-auto">
              Find answers to common questions about our products, orders, and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((faq, index) => (
              <Card key={index} className="border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <HelpCircle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-2">{faq.question}</h3>
                      <p className="text-amber-700 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="border-amber-200 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Heart className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-bold text-amber-900 mb-4">
                Still Have Questions?
              </h3>
              <p className="text-amber-700 mb-6">
                Our dedicated customer service team is here to help you find the perfect sacred art piece for your home or as a meaningful gift.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 cursor-pointer">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us Now
                </Button>
                <Button 
                  variant="outline" 
                  className="border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-3 cursor-pointer"
                  onClick={() => document.getElementById('message')?.focus()}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Components.Footer />
    </div>
  )
}