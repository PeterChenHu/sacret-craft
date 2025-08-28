'use client'

import React, { useState } from 'react'
import Components from '../components'
import { Link, useNavigate } from '@/lib'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Download, 
  Printer, 
  Mail, 
  ArrowLeft,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail as MailIcon,
  CreditCard,
  Truck,
  CheckCircle
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Invoice() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isPrinting, setIsPrinting] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isEmailing, setIsEmailing] = useState(false)

  // Mock invoice data
  const invoice = {
    number: 'INV-2024-001',
    date: '2024-01-28',
    dueDate: '2024-02-28',
    status: 'Paid',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      address: {
        street: '123 Faith Street',
        city: 'Artisan City',
        state: 'CA',
        zip: '90210',
        country: 'USA'
      }
    },
    items: [
      {
        id: 1,
        name: 'Handcrafted Wooden Crucifix',
        description: 'Beautiful handcrafted crucifix made from premium oak',
        quantity: 1,
        unitPrice: 89.99,
        total: 89.99
      },
      {
        id: 2,
        name: 'Carved Wooden Rosary',
        description: 'Traditional rosary with wooden beads',
        quantity: 2,
        unitPrice: 45.99,
        total: 91.98
      }
    ],
    subtotal: 181.97,
    tax: 18.20,
    shipping: 12.99,
    total: 213.16,
    paymentMethod: 'Credit Card (**** **** **** 1234)',
    shippingMethod: 'Standard Shipping (3-5 business days)',
    notes: 'Thank you for your order. Each piece is crafted with prayer and devotion.'
  }

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 1000)
  }

  const handleDownload = () => {
    setIsDownloading(true)
    setTimeout(() => {
      // Simulate PDF download
      const link = document.createElement('a')
      link.href = '#'
      link.download = `invoice-${invoice.number}.pdf`
      link.click()
      setIsDownloading(false)
    }, 2000)
  }

  const handleEmail = () => {
    setIsEmailing(true)
    setTimeout(() => {
      // Simulate email sending
      setIsEmailing(false)
    }, 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Components.Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h1 className="text-3xl font-serif font-bold text-white">
                  {t('invoice.title')}
                </h1>
                <p className="text-amber-100">
                  {t('invoice.subtitle')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="border-white text-white hover:bg-white hover:text-amber-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('invoice.back')}
              </Button>
              
              <Button
                onClick={handlePrint}
                disabled={isPrinting}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-600"
              >
                <Printer className="h-4 w-4 mr-2" />
                {isPrinting ? t('invoice.printing') : t('invoice.print')}
              </Button>
              
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-600"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? t('invoice.downloading') : t('invoice.download')}
              </Button>
              
              <Button
                onClick={handleEmail}
                disabled={isEmailing}
                className="bg-white text-amber-600 hover:bg-amber-50"
              >
                <Mail className="h-4 w-4 mr-2" />
                {isEmailing ? t('invoice.sending') : t('invoice.email')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Invoice Header */}
        <Card className="mb-8 border-amber-200">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-amber-900">
                      {t('invoice.invoice')} #{invoice.number}
                    </h2>
                    <p className="text-amber-600">
                      {t('invoice.sacredCrafts')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-amber-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t('invoice.date')}: {formatDate(invoice.date)}
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t('invoice.status')}: <Badge className="ml-2 bg-green-100 text-green-800">{invoice.status}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-amber-900 mb-2">
                  {formatCurrency(invoice.total)}
                </div>
                <p className="text-amber-600 text-sm">
                  {t('invoice.totalAmount')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bill To */}
              <div>
                <h3 className="font-semibold text-amber-900 mb-4">{t('invoice.billTo')}</h3>
                <div className="space-y-2 text-amber-700">
                  <p className="font-medium">{invoice.customer.name}</p>
                  <div className="flex items-center">
                    <MailIcon className="h-4 w-4 mr-2 text-amber-600" />
                    {invoice.customer.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-amber-600" />
                    {invoice.customer.phone}
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-amber-600" />
                    <div>
                      <p>{invoice.customer.address.street}</p>
                      <p>{invoice.customer.address.city}, {invoice.customer.address.state} {invoice.customer.address.zip}</p>
                      <p>{invoice.customer.address.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment & Shipping */}
              <div>
                <h3 className="font-semibold text-amber-900 mb-4">{t('invoice.paymentShipping')}</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <CreditCard className="h-4 w-4 mr-2 text-amber-600" />
                      <span className="font-medium text-amber-900">{t('invoice.paymentMethod')}</span>
                    </div>
                    <p className="text-amber-700 text-sm">{invoice.paymentMethod}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <Truck className="h-4 w-4 mr-2 text-amber-600" />
                      <span className="font-medium text-amber-900">{t('invoice.shippingMethod')}</span>
                    </div>
                    <p className="text-amber-700 text-sm">{invoice.shippingMethod}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card className="mb-8 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">{t('invoice.items')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-amber-200">
                    <th className="text-left py-3 px-4 font-semibold text-amber-900">{t('invoice.item')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-amber-900">{t('invoice.description')}</th>
                    <th className="text-right py-3 px-4 font-semibold text-amber-900">{t('invoice.quantity')}</th>
                    <th className="text-right py-3 px-4 font-semibold text-amber-900">{t('invoice.unitPrice')}</th>
                    <th className="text-right py-3 px-4 font-semibold text-amber-900">{t('invoice.total')}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-amber-100">
                      <td className="py-4 px-4">
                        <div className="font-medium text-amber-900">{item.name}</div>
                      </td>
                      <td className="py-4 px-4 text-amber-700 text-sm">
                        {item.description}
                      </td>
                      <td className="py-4 px-4 text-right text-amber-900">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-4 text-right text-amber-900">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-amber-900">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Summary */}
        <Card className="mb-8 border-amber-200">
          <CardContent className="p-8">
            <div className="flex justify-end">
              <div className="w-80">
                <div className="space-y-3">
                  <div className="flex justify-between text-amber-700">
                    <span>{t('invoice.subtotal')}</span>
                    <span>{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>{t('invoice.tax')}</span>
                    <span>{formatCurrency(invoice.tax)}</span>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>{t('invoice.shipping')}</span>
                    <span>{formatCurrency(invoice.shipping)}</span>
                  </div>
                  <Separator className="bg-amber-200" />
                  <div className="flex justify-between text-lg font-bold text-amber-900">
                    <span>{t('invoice.total')}</span>
                    <span>{formatCurrency(invoice.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {invoice.notes && (
          <Card className="mb-8 border-amber-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-amber-900 mb-3">{t('invoice.notes')}</h3>
              <p className="text-amber-700 leading-relaxed">
                {invoice.notes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handlePrint}
            disabled={isPrinting}
            variant="outline"
            className="border-amber-600 text-amber-600 hover:bg-amber-50"
          >
            <Printer className="h-4 w-4 mr-2" />
            {isPrinting ? t('invoice.printing') : t('invoice.print')}
          </Button>
          
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            variant="outline"
            className="border-amber-600 text-amber-600 hover:bg-amber-50"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? t('invoice.downloading') : t('invoice.download')}
          </Button>
          
          <Button
            onClick={handleEmail}
            disabled={isEmailing}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Mail className="h-4 w-4 mr-2" />
            {isEmailing ? t('invoice.sending') : t('invoice.email')}
          </Button>
        </div>
      </div>

      <Components.Footer />
    </div>
  )
} 