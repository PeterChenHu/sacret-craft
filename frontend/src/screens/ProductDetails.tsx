'use client'

import React, { useState, useEffect } from 'react'
import Components from '../components'
import { Link } from '@/lib'
import { useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, Award, CheckCircle } from 'lucide-react'
import { useCart } from '../contexts/CartContext.js'
import { useWishlist } from '../contexts/WishlistContext.js'
import { useUser } from '../contexts/UserContext.js'
import { useNavigate } from '@/lib'
import RatingStars from '../components/RatingStars.js'
import { useTranslation } from 'react-i18next'
import { apiService } from '../lib/api.js'

export default function ProductDetails() {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { isAuthenticated } = useUser()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const params = useParams()
  const productId = params.id
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)
  const [localWishlistItems, setLocalWishlistItems] = useState<number[]>([])
  
  // Data states for server-side data
  const [product, setProduct] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Local wishlist check as fallback
  const isInLocalWishlist = (productId: number): boolean => {
    return localWishlistItems.includes(productId)
  }

  // Combined wishlist check
  const isProductInWishlist = (productId: number): boolean => {
    try {
      return isInWishlist(productId) || isInLocalWishlist(productId)
    } catch (error) {
      // If context fails, fall back to local state
      return isInLocalWishlist(productId)
    }
  }

  // Fetch product data from server
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return
      
      try {
        setLoading(true)
        setError(null)
        
        // Fetch product details (includes reviews via prefetch_related)
        const productData = await apiService.getProduct(productId) as any
        setProduct(productData)
        
        // Extract reviews from product data if available
        if (productData.reviews) {
          setReviews(productData.reviews)
        } else {
          setReviews([])
        }
        
        // Fetch related products (same category)
        try {
          const relatedData = await apiService.getProducts({ 
            category: productData.category?.id || productData.category,
            page: 1
          }) as any
          const filteredRelated = (relatedData.results || relatedData || [])
            .filter((p: any) => p.id !== parseInt(productId))
            .slice(0, 3)
          setRelatedProducts(filteredRelated)
        } catch (error) {
          console.log('No related products available')
          setRelatedProducts([])
        }
        
      } catch (error) {
        console.error('Error fetching product data:', error)
        setError('Failed to load product data')
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [productId])

  const handleAddToCart = async () => {
    if (!product) return
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/Login')
      return
    }
    
    setIsAddingToCart(true)
    
    try {
      // Add item to cart via API
      await apiService.addToCart(product.id, quantity)
      
      // Also add to local cart context
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price.toString().replace('$', '')),
        image: product.images?.[0] || product.image || null
      })
      
      setShowSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      // Show error message to user
      alert('Failed to add item to cart. Please try again.')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlistToggle = async () => {
    if (!product) return
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/Login')
      return
    }

    try {
      setIsWishlistLoading(true)
      if (isProductInWishlist(product.id)) {
        try {
          await removeFromWishlist(product.id)
        } catch (apiError) {
          // Remove from local state as fallback
          setLocalWishlistItems(prev => prev.filter(id => id !== product.id))
        }
      } else {
        try {
          await addToWishlist(product.id)
        } catch (apiError) {
          // Add to local state as fallback
          setLocalWishlistItems(prev => [...prev, product.id])
        }
      }
    } catch (error) {
      // If backend fails, we can implement a local fallback
      // For now, just show the error
    } finally {
      setIsWishlistLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Components.Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Components.Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-amber-900 mb-4">Product Not Found</h1>
            <p className="text-amber-700 mb-6">{error || 'The requested product could not be found.'}</p>
            <Link to="/Products">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Components.Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-amber-700">
            <Link to="/Landing" className="hover:text-amber-900">{t('navigation.home')}</Link>
            <span>/</span>
            <Link to="/Products" className="hover:text-amber-900">{t('navigation.products')}</Link>
            <span>/</span>
            <span className="text-amber-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
                             <div className="relative aspect-square overflow-hidden rounded-lg bg-amber-50">
                 {(product.images?.[selectedImage] || product.image) ? (
                   <img 
                     src={product.images?.[selectedImage] || product.image} 
                     alt={product.name}
                     className="w-full h-full object-cover"
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-amber-400">
                     <span className="text-lg">No Image Available</span>
                   </div>
                 )}
                 {product.badge && (
                   <Badge className="absolute top-4 left-4 bg-amber-600 text-white">
                     {product.badge}
                   </Badge>
                 )}
                 {product.original_price && (
                   <Badge className="absolute top-4 right-4 bg-red-600 text-white">
                     {t('productDetails.save', { amount: (parseFloat(product.original_price.toString()) - parseFloat(product.price.toString())).toFixed(2) })}
                   </Badge>
                 )}
               </div>
              
                             {/* Thumbnail Images */}
               {product.images && product.images.length > 1 && (
                 <div className="flex space-x-2">
                   {product.images.map((image: string, index: number) => (
                     <button
                       key={index}
                       onClick={() => setSelectedImage(index)}
                       className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                         selectedImage === index ? 'border-amber-600' : 'border-amber-200 hover:border-amber-400'
                       }`}
                     >
                       {image ? (
                         <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full bg-amber-100 flex items-center justify-center text-amber-400 text-xs">
                           No Image
                         </div>
                       )}
                     </button>
                   ))}
                 </div>
               )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-serif font-bold text-amber-900 mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <RatingStars rating={product.rating || 0} />
                    <span className="text-sm text-amber-600 ml-2">({reviews.length} reviews)</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-4xl font-bold text-amber-800">${product.price}</span>
                  {product.original_price && (
                    <span className="text-2xl text-gray-500 line-through">${product.original_price}</span>
                  )}
                </div>
              </div>

              <p className="text-amber-700 leading-relaxed">{product.description}</p>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="font-semibold text-amber-900 mb-3">{t('productDetails.keyFeatures')}:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2 text-amber-700">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="font-medium text-amber-900">{t('productDetails.quantity')}:</label>
                  <div className="flex items-center border border-amber-200 rounded-md">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-amber-600 hover:bg-amber-50"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-amber-200">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-amber-600 hover:bg-amber-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold cursor-pointer"
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {t('productDetails.addingToCart')}
                      </>
                    ) : showSuccess ? (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        {t('productDetails.addedToCart')}
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {t('productDetails.addToCart')}
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleWishlistToggle}
                    disabled={isWishlistLoading}
                    className={`border-amber-600 hover:bg-amber-50 px-6 transition-colors ${
                      !isAuthenticated 
                        ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                        : isProductInWishlist(product.id) 
                          ? 'bg-amber-600 text-white border-amber-600' 
                          : 'text-amber-600'
                    }`}
                    title={!isAuthenticated ? 'Login to add to wishlist' : ''}
                  >
                    {isWishlistLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
                    ) : (
                      <Heart className={`h-5 w-5 ${isProductInWishlist(product.id) ? 'fill-current' : ''}`} />
                    )}
                  </Button>
                  <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 px-6">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-amber-200">
                <div className="flex items-center space-x-2 text-sm text-amber-700">
                  <Truck className="h-4 w-4 text-amber-600" />
                  <span>{t('productDetails.guarantees.freeShipping')}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-amber-700">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <span>{t('productDetails.guarantees.qualityGuaranteed')}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-amber-700">
                  <RotateCcw className="h-4 w-4 text-amber-600" />
                  <span>{t('productDetails.guarantees.returns')}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-amber-700">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span>{t('productDetails.guarantees.blessedCertified')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-amber-50">
              <TabsTrigger value="description" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">{t('productDetails.tabs.description')}</TabsTrigger>
              <TabsTrigger value="specifications" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">{t('productDetails.tabs.specifications')}</TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">{t('productDetails.tabs.reviews')} ({reviews.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-8">
              <div className="prose max-w-none text-amber-700">
                <p className="text-lg leading-relaxed mb-6">{product.description}</p>
                <h3 className="text-xl font-semibold text-amber-900 mb-4">Craftsmanship & Blessing</h3>
                <p className="leading-relaxed mb-4">
                  Each piece in our collection is meticulously handcrafted by skilled artisans who have dedicated their lives to creating sacred art. 
                  The process begins with carefully selected premium materials, chosen for their quality and spiritual significance.
                </p>
                <p className="leading-relaxed mb-4">
                  Our craftsmen spend hours creating intricate details, ensuring that every curve and line reflects the sacred nature of the piece. 
                  Once completed, each item is blessed by spiritual practitioners, adding spiritual significance to its physical beauty.
                </p>
                <p className="leading-relaxed">
                  We believe that sacred art should not only be beautiful but also meaningful. That's why every purchase includes a certificate 
                  of authenticity and blessing, making each piece a treasured addition to your spiritual life.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-8">
              {product.specifications ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-amber-100">
                      <span className="font-medium text-amber-900">{key}:</span>
                      <span className="text-amber-700">{value as string}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-amber-700">
                  <p>Specifications not available for this product.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <RatingStars rating={product.rating || 0} />
                    </div>
                    <span className="text-2xl font-bold text-amber-800">{product.rating || 0}</span>
                    <span className="text-amber-600">out of 5 ({reviews.length} reviews)</span>
                  </div>
                  <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                    Write a Review
                  </Button>
                </div>
                
                <Separator className="bg-amber-200" />
                
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-amber-900">{review.name || review.user?.name || 'Anonymous'}</span>
                            <div className="flex items-center space-x-1">
                              <RatingStars rating={review.rating} />
                            </div>
                          </div>
                          <span className="text-sm text-amber-600">{review.date || review.created_at}</span>
                        </div>
                        <p className="text-amber-700 leading-relaxed">{review.comment || review.content}</p>
                        <Separator className="bg-amber-100" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-amber-700 py-8">
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-amber-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-amber-900 mb-4">You May Also Like</h2>
              <p className="text-amber-700">Discover more beautiful pieces from our sacred collection</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} to={`/ProductDetails/${relatedProduct.id}`} className="block">
                  <Card className="group hover:shadow-xl transition-all duration-300 border-amber-200 hover:border-amber-300">
                    <CardContent className="p-0">
                                             <div className="relative overflow-hidden rounded-t-lg">
                         {(relatedProduct.image || relatedProduct.images?.[0]) ? (
                           <img 
                             src={relatedProduct.image || relatedProduct.images?.[0]} 
                             alt={relatedProduct.name}
                             className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                           />
                         ) : (
                           <div className="w-full h-64 bg-amber-100 flex items-center justify-center text-amber-400">
                             <span>No Image Available</span>
                           </div>
                         )}
                       </div>
                      <div className="p-6">
                        <h3 className="font-semibold text-amber-900 mb-2 text-lg">{relatedProduct.name}</h3>
                        <div className="flex items-center mb-3">
                          <div className="flex items-center space-x-1">
                            <RatingStars rating={relatedProduct.rating || 0} />
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-amber-800 mb-4">${relatedProduct.price}</p>
                        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Components.Footer />
    </div>
  )
}