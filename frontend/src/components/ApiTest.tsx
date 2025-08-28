import React, { useState, useEffect } from 'react'
import { apiService } from '../lib'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export const ApiTest: React.FC = () => {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  console.log('ApiTest component rendered')

  const testApiConnection = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Test products endpoint
      const productsData = await apiService.getProducts()
      setProducts(productsData.results || productsData)
      
      // Test categories endpoint
      const categoriesData = await apiService.getCategories()
      setCategories(categoriesData.results || categoriesData)
      
      console.log('API Connection successful!')
    } catch (err) {
      console.error('API Connection failed:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testApiConnection()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testApiConnection} 
            disabled={loading}
            className="mb-4"
          >
            {loading ? 'Testing...' : 'Test API Connection'}
          </Button>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}

          {categories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Categories ({categories.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="p-3 bg-gray-50 rounded">
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {products.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Products ({products.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="p-3 bg-gray-50 rounded">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">${product.price}</p>
                    <p className="text-xs text-gray-500">{product.short_description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 