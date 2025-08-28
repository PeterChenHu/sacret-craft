'use client'

import React from 'react'
import { Link } from '@/lib'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { ShoppingCart, Menu, X, User, LogOut, Settings, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useUser } from '../contexts/UserContext.js'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LanguageSwitcher } from './LanguageSwitcher.js'
import { useTranslation } from 'react-i18next'
import { useCart } from '../contexts/CartContext.js'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useUser()
  const { getCartCount } = useCart()
  const { t } = useTranslation()

  const handleLogout = () => {
    logout()
    // You could add navigation here if needed
  }

  return (
    <header className="bg-white shadow-sm border-b border-amber-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">✝</span>
            </div>
            <span className="text-xl font-serif font-bold text-amber-900">{t('header.brand')}</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-amber-50 hover:text-amber-900 focus:bg-amber-50 focus:text-amber-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-amber-50/50 data-[state=open]:bg-amber-50/50">
                    {t('navigation.home')}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/Products" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-amber-50 hover:text-amber-900 focus:bg-amber-50 focus:text-amber-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-amber-50/50 data-[state=open]:bg-amber-50/50">
                    {t('navigation.products')}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/About" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-amber-50 hover:text-amber-900 focus:bg-amber-50 focus:text-amber-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-amber-50/50 data-[state=open]:bg-amber-50/50">
                    {t('navigation.about')}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/FAQ" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-amber-50 hover:text-amber-900 focus:bg-amber-50 focus:text-amber-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-amber-50/50 data-[state=open]:bg-amber-50/50">
                    {t('navigation.faq')}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Cart, Language Switcher, and User Menu */}
          <div className="flex items-center space-x-4">
            <Link to="/Cart">
              <Button variant="ghost" size="sm" className="relative hover:bg-amber-50">
                <ShoppingCart className="h-5 w-5 text-amber-900" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Button>
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-amber-50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={`${user?.firstName} ${user?.lastName}`} />
                      <AvatarFallback className="bg-amber-100 text-amber-900 font-semibold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/UserDashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('navigation.dashboard')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/Wishlist" className="flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>{t('header.wishlist')}</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* dropped user settings from dropdown menu */}

                  {/* <DropdownMenuItem asChild>
                    <Link to="/UserDashboard" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t('navigation.settings')}</span>
                    </Link>
                  </DropdownMenuItem> */}

                  {/* dropped user settings from dropdown menu */}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('header.logOut')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/Login">
                  <Button variant="ghost" size="sm" className="hover:bg-amber-50 text-amber-900">
                    {t('header.signIn')}
                  </Button>
                </Link>
                <Link to="/Register">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                    {t('header.register')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-amber-100 py-4">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50 rounded-md transition-colors">
                {t('navigation.home')}
              </Link>
              <Link to="/Products" className="px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50 rounded-md transition-colors">
                {t('navigation.products')}
              </Link>
              <Link to="/About" className="px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50 rounded-md transition-colors">
                {t('navigation.about')}
              </Link>
              <Link to="/FAQ" className="px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50 rounded-md transition-colors">
                {t('navigation.faq')}
              </Link>
              {!isAuthenticated && (
                <>
                  <div className="border-t border-amber-100 my-2"></div>
                  <Link to="/Login" className="px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50 rounded-md transition-colors">
                    {t('header.signIn')}
                  </Link>
                  <Link to="/Register" className="px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50 rounded-md transition-colors">
                    {t('header.register')}
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <>
                  <div className="border-t border-amber-100 my-2"></div>
                  <Link to="/UserDashboard" className="px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50 rounded-md transition-colors">
                    {t('navigation.dashboard')}
                  </Link>
                  <Link to="/Wishlist" className="px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50 rounded-md transition-colors">
                    {t('header.wishlist')}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors text-left"
                  >
                    {t('header.logOut')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}