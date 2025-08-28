'use client'

import React, { useState, useEffect } from 'react'
import Components from '../components'
import { Link, useNavigate } from '@/lib'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Settings, 
  Edit, 
  Truck, 
  CheckCircle, 
  Clock,
  Eye,
  Download,
  Plus,
  LogOut
} from 'lucide-react'
import { useUser } from '../contexts/UserContext.js'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'
import { apiService } from '../lib/api'

export default function UserDashboard() {
  const { t } = useTranslation()
  const { user, isAuthenticated, logout, isLoading: authLoading } = useUser()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState({
    firstName: user?.firstName || 'Test',
    lastName: user?.lastName || 'User',
    email: user?.email || 'test@example.com',
    phone: '(555) 123-4567',
    joinDate: 'March 2024'
  })
  
  // Real data state
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Redirect if not authenticated (but only after loading is complete)
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/Login')
    }
  }, [isAuthenticated, isLoading, navigate])

  // Update user profile when user context changes
  React.useEffect(() => {
    if (user) {
      setUserProfile(prev => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }))
    }
  }, [user])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated || authLoading) return
      
      try {
        setIsLoading(true)
        
        // Fetch orders
        try {
          const ordersResponse = await apiService.getUserOrders() as any
          setRecentOrders(ordersResponse.results || ordersResponse || [])
        } catch (error) {
          console.error('Failed to fetch orders:', error)
          setRecentOrders([])
        }
        
        // Fetch addresses
        try {
          const addressesResponse = await apiService.getUserAddresses() as any
          setSavedAddresses(addressesResponse.results || addressesResponse || [])
        } catch (error) {
          console.error('Failed to fetch addresses:', error)
          setSavedAddresses([])
        }
        
        // Fetch wishlist
        try {
          const wishlistResponse = await apiService.getWishlist() as any
          setWishlistItems(wishlistResponse.results || wishlistResponse || [])
        } catch (error) {
          console.error('Failed to fetch wishlist:', error)
          setWishlistItems([])
        }
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [isAuthenticated, authLoading])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSaveProfile = () => {
    // In a real app, this would make an API call
    setIsEditing(false)
    // Show success message
  }

  const handleChangePassword = async () => {
    // Reset error
    setPasswordError('')
    
    // Validate form
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError(t('dashboard.settings.security.changePasswordModal.allFieldsRequired'))
      return
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(t('dashboard.settings.security.changePasswordModal.passwordsNotMatch'))
      return
    }
    
    if (passwordForm.newPassword.length < 8) {
      setPasswordError(t('dashboard.settings.security.changePasswordModal.passwordTooShort'))
      return
    }
    
    try {
      setIsChangingPassword(true)
      
      // Make real API call to change password
      await apiService.changePassword(passwordForm.oldPassword, passwordForm.newPassword)
      
      // Reset form and close modal
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setShowChangePassword(false)
      setPasswordError('')
      
      // Show success message (you could use a toast notification here)
      alert(t('dashboard.settings.security.changePasswordModal.changeSuccess'))
      
    } catch (error: any) {
      console.error('Password change failed:', error)
      
      // Try to extract error message from backend response
      let errorMessage = t('dashboard.settings.security.changePasswordModal.changeError')
      
      if (error.response?.data?.error) {
        // Backend returned a specific error message
        const backendError = error.response.data.error
        
        // Map backend error messages to user-friendly messages
        if (backendError.includes('Current password is incorrect')) {
          errorMessage = t('dashboard.settings.security.changePasswordModal.currentPasswordIncorrect')
        } else if (backendError.includes('New password does not meet requirements')) {
          errorMessage = t('dashboard.settings.security.changePasswordModal.passwordRequirementsNotMet')
        } else if (backendError.includes('Both old_password and new_password are required')) {
          errorMessage = t('dashboard.settings.security.changePasswordModal.bothPasswordsRequired')
        } else {
          errorMessage = backendError
        }
      } else if (error.message) {
        // Network or other error
        errorMessage = error.message
      }
      
      setPasswordError(errorMessage)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const openChangePassword = () => {
    setShowChangePassword(true)
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    setPasswordError('')
  }

  const closeChangePassword = () => {
    setShowChangePassword(false)
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    setPasswordError('')
  }

  // Data will be fetched from backend and stored in state variables above

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'in transit': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-amber-100 text-amber-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'in transit': return <Truck className="h-4 w-4" />
      case 'processing': return <Clock className="h-4 w-4" />
      case 'pending': return <Package className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-700 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-amber-700 font-medium">Redirecting to login...</div>
        </div>
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
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-4 border-white">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-amber-700 text-white text-xl font-bold">
                  {userProfile.firstName[0]}{userProfile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-serif font-bold text-white">
                  {t('dashboard.welcome', { name: userProfile.firstName })}
                </h1>
                <p className="text-amber-100">
                  {t('dashboard.memberSince', { date: userProfile.joinDate })}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-white text-black hover:bg-white hover:text-amber-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('dashboard.logout')}
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-amber-50 border border-amber-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" />
              {t('dashboard.tabs.overview')}
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              {t('dashboard.tabs.orders')}
            </TabsTrigger>
            <TabsTrigger value="addresses" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <MapPin className="h-4 w-4 mr-2" />
              {t('dashboard.tabs.addresses')}
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Heart className="h-4 w-4 mr-2" />
              {t('dashboard.tabs.wishlist')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              {t('dashboard.tabs.settings')}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <Card className="border-amber-200">
                <CardContent className="p-6 text-center">
                  <Package className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-amber-900">12</div>
                  <div className="text-amber-700">{t('dashboard.stats.totalOrders')}</div>
                </CardContent>
              </Card>
              
              <Card className="border-amber-200">
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-amber-900">{wishlistItems.length}</div>
                  <div className="text-amber-700">{t('dashboard.stats.wishlistItems')}</div>
                </CardContent>
              </Card>
              
              <Card className="border-amber-200">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-amber-900">{savedAddresses.length}</div>
                  <div className="text-amber-700">{t('dashboard.stats.savedAddresses')}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">{t('dashboard.recentOrders.title')}</CardTitle>
                <CardDescription>{t('dashboard.recentOrders.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-amber-100 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={order.image} 
                          alt="Order item"
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <div className="font-semibold text-amber-900">{order.id}</div>
                          <div className="text-sm text-amber-700">{order.date} • {order.items} {t('dashboard.recentOrders.items')}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </Badge>
                        <div className="text-right">
                          <div className="font-bold text-amber-900">${order.total}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button 
                    variant="outline" 
                    className="border-amber-600 text-amber-600 hover:bg-amber-50"
                    onClick={() => setActiveTab('orders')}
                  >
                    {t('dashboard.recentOrders.viewAll')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">{t('dashboard.orders.title')}</CardTitle>
                <CardDescription>{t('dashboard.orders.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {isLoading && isAuthenticated ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                      <span className="ml-2 text-amber-700">Loading orders...</span>
                    </div>
                  ) : recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div key={order.id} className="border border-amber-200 rounded-lg p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-amber-900 text-lg">{order.order_number || order.id}</h3>
                            <p className="text-amber-700">{t('dashboard.orders.placedOn', { date: order.created_at || order.date })}</p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center">
                              <Package className="h-8 w-8 text-amber-600" />
                            </div>
                            <div>
                              <p className="text-amber-700">{order.items?.length || order.items || 0} {t('dashboard.orders.items')}</p>
                              <p className="font-bold text-amber-900 text-xl">${order.total_amount || order.total}</p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                              <Eye className="h-4 w-4 mr-1" />
                              {t('dashboard.orders.viewDetails')}
                            </Button>
                            {order.status?.toLowerCase() === 'delivered' && (
                              <Button variant="outline" size="sm" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                                <Download className="h-4 w-4 mr-1" />
                                {t('dashboard.orders.invoice')}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-amber-700">
                      <Package className="h-12 w-12 mx-auto mb-4 text-amber-400" />
                      <p className="text-lg font-medium">{t('dashboard.orders.noOrders')}</p>
                      <p className="text-sm">{t('dashboard.orders.noOrdersDescription')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif font-bold text-amber-900">{t('dashboard.addresses.title')}</h2>
                <p className="text-amber-700">{t('dashboard.addresses.description')}</p>
              </div>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                {t('dashboard.addresses.addNew')}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading && isAuthenticated ? (
                <div className="col-span-2 flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                  <span className="ml-2 text-amber-700">Loading addresses...</span>
                </div>
              ) : savedAddresses.length > 0 ? (
                savedAddresses.map((address) => (
                  <Card key={address.id} className="border-amber-200">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-2">
                          <Badge variant={address.is_default ? "default" : "secondary"} className={address.is_default ? "bg-amber-600" : ""}>
                            {address.address_type}
                          </Badge>
                          {address.is_default && (
                            <Badge variant="outline" className="border-green-600 text-green-600">
                              {t('dashboard.addresses.default')}
                            </Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="text-amber-600 hover:bg-amber-50">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-1 text-amber-700">
                        <p className="font-semibold text-amber-900">{address.first_name} {address.last_name}</p>
                        <p>{address.address_line_1}</p>
                        {address.address_line_2 && <p>{address.address_line_2}</p>}
                        <p>{address.city}, {address.state} {address.postal_code}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-amber-700">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-amber-400" />
                  <p className="text-lg font-medium">{t('dashboard.addresses.noAddresses')}</p>
                  <p className="text-sm">{t('dashboard.addresses.noAddressesDescription')}</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-amber-900 mb-2">{t('dashboard.wishlist.title')}</h2>
              <p className="text-amber-700">{t('dashboard.wishlist.description')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading && isAuthenticated ? (
                <div className="col-span-3 flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                  <span className="ml-2 text-amber-700">Loading wishlist...</span>
                </div>
              ) : wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                  <Card key={item.id} className="border-amber-200 group hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative">
                        {(item.images?.[0] || item.image) ? (
                          <img 
                            src={item.images?.[0] || item.image} 
                            alt={item.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        ) : (
                          <div className="w-full h-48 bg-amber-100 flex items-center justify-center rounded-t-lg">
                            <Package className="h-24 w-24 text-amber-400" />
                          </div>
                        )}
                        {!item.in_stock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                            <Badge variant="destructive">{t('dashboard.wishlist.outOfStock')}</Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-amber-900 mb-2">{item.name}</h3>
                        <p className="text-xl font-bold text-amber-800 mb-4">${item.price}</p>
                        <div className="flex space-x-2">
                          <Link to={`/ProductDetails/${item.id}`} className="flex-1">
                            <Button 
                              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                              disabled={!item.in_stock}
                            >
                              {item.in_stock ? t('dashboard.wishlist.addToCart') : t('dashboard.wishlist.notifyWhenAvailable')}
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <Heart className="h-16 w-16 text-amber-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-amber-900 mb-2">{t('dashboard.wishlist.empty.title')}</h3>
                  <p className="text-amber-700 mb-6">{t('dashboard.wishlist.empty.description')}</p>
                  <Link to="/Products">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                      {t('dashboard.wishlist.empty.browseProducts')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">{t('dashboard.settings.accountInfo.title')}</CardTitle>
                <CardDescription>{t('dashboard.settings.accountInfo.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-amber-900">{t('dashboard.settings.personalDetails')}</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="border-amber-600 text-amber-600 hover:bg-amber-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? t('dashboard.settings.cancel') : t('dashboard.settings.edit')}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-amber-900">{t('dashboard.settings.firstName')}</Label>
                    <Input
                      id="firstName"
                      value={userProfile.firstName}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                      className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-amber-900">{t('dashboard.settings.lastName')}</Label>
                    <Input
                      id="lastName"
                      value={userProfile.lastName}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                      className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-amber-900">{t('dashboard.settings.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-amber-900">{t('dashboard.settings.phone')}</Label>
                    <Input
                      id="phone"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-4">
                    <Button 
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={handleSaveProfile}
                    >
                      {t('dashboard.settings.saveChanges')}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      className="border-amber-600 text-amber-600 hover:bg-amber-50"
                    >
                      {t('dashboard.settings.cancel')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">{t('dashboard.settings.security.title')}</CardTitle>
                <CardDescription>{t('dashboard.settings.security.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-amber-900">{t('dashboard.settings.security.password')}</h4>
                    <p className="text-sm text-amber-700">{t('dashboard.settings.security.lastUpdated')}</p>
                  </div>
                                     <Button 
                     variant="outline" 
                     className="border-amber-600 text-amber-600 hover:bg-amber-50"
                     onClick={openChangePassword}
                   >
                     {t('dashboard.settings.security.changePassword')}
                   </Button>
                </div>
                {i18n.language === 'en' && (
                  <>
                    <Separator className="bg-amber-200" />
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-amber-900">{t('dashboard.settings.security.twoFactor')}</h4>
                        <p className="text-sm text-amber-700">{t('dashboard.settings.security.twoFactorDescription')}</p>
                      </div>
                      <Button variant="outline" className="border-amber-200 text-amber-600 hover:bg-amber-50">
                        {t('dashboard.settings.security.enable2FA')}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
                 </Tabs>
       </div>

       {/* Change Password Modal */}
       {showChangePassword && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-semibold text-amber-900">
                 {t('dashboard.settings.security.changePassword')}
               </h3>
               <button
                 onClick={closeChangePassword}
                 className="text-gray-400 hover:text-gray-600"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
             
                            <div className="space-y-4">
                 <div>
                   <Label htmlFor="oldPassword" className="text-amber-900">
                     {t('dashboard.settings.security.changePasswordModal.currentPassword')}
                   </Label>
                   <Input
                     id="oldPassword"
                     type="password"
                     value={passwordForm.oldPassword}
                     onChange={(e) => setPasswordForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                     className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                     placeholder={t('dashboard.settings.security.changePasswordModal.currentPasswordPlaceholder')}
                   />
                 </div>
                 
                 <div>
                   <Label htmlFor="newPassword" className="text-amber-900">
                     {t('dashboard.settings.security.changePasswordModal.newPassword')}
                   </Label>
                   <Input
                     id="newPassword"
                     type="password"
                     value={passwordForm.newPassword}
                     onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                     className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                     placeholder={t('dashboard.settings.security.changePasswordModal.newPasswordPlaceholder')}
                   />
                 </div>
                 
                 <div>
                   <Label htmlFor="confirmPassword" className="text-amber-900">
                     {t('dashboard.settings.security.changePasswordModal.confirmPassword')}
                   </Label>
                   <Input
                     id="confirmPassword"
                     type="password"
                     value={passwordForm.confirmPassword}
                     onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                     className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                     placeholder={t('dashboard.settings.security.changePasswordModal.confirmPasswordPlaceholder')}
                   />
                 </div>
               
               {passwordError && (
                 <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                   {passwordError}
                 </div>
               )}
               
               <div className="flex space-x-3 pt-4">
                 <Button
                   onClick={handleChangePassword}
                   disabled={isChangingPassword}
                   className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                 >
                   {isChangingPassword ? t('dashboard.settings.security.changePasswordModal.changing') : t('dashboard.settings.security.changePasswordModal.changeButton')}
                 </Button>
                 <Button
                   variant="outline"
                   onClick={closeChangePassword}
                   disabled={isChangingPassword}
                   className="flex-1 border-amber-600 text-amber-600 hover:bg-amber-50"
                 >
                   {t('dashboard.settings.security.changePasswordModal.cancel')}
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}
 
       <Components.Footer />
     </div>
   )
 }