import { Routes, Route } from 'react-router'
import { lazy, Suspense } from 'react'
import HomePage from './HomePage.js'
import screens from './screens/index.js'
import { ApiTest } from './components/ApiTest'
import { Link } from '@/lib'

// Lazy load Landing component
const Landing = lazy(() => import('./screens/Landing.js'))

// Loading component
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-amber-700 font-medium">Loading Sacred Crafts...</p>
      </div>
    </div>
  )
}

// Simple test component
const TestComponent = () => <div>Test Route Working!</div>

export default function App() {
	return (
		<Routes>
			<Route path="/" element={
				<Suspense fallback={<LoadingSpinner />}>
					<Landing />
				</Suspense>
			} />
			<Route path="/home" element={<HomePage />} />
			<Route path="/test" element={<TestComponent />} />
			
			{/* Explicitly define ProductDetails route */}
			<Route path="/ProductDetails/:id" element={<screens.ProductDetails />} />
			<Route path="/ProductDetails" element={<screens.ProductDetails />} />
			<Route path="/product-details/:id" element={<screens.ProductDetails />} />
			<Route path="/product-details" element={<screens.ProductDetails />} />
			
			{/* Test route to verify routing is working */}
			<Route path="/test-product/:id" element={<div>Test Product Route Working!</div>} />
			
			{Object.entries(screens).map(([screenName, ScreenComponent]) => {
				// Skip ProductDetails as it's handled above
				if (screenName === 'ProductDetails') {
					return null
				}
				// Default route for other screens
				return (
					<Route
						key={screenName}
						path={`/${screenName}`}
						element={<ScreenComponent />}
					/>
				)
			})}
			<Route path="/api-test" element={<ApiTest />} />
			
			{/* Catch-all route for 404 errors */}
			<Route path="*" element={
				<div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
					<div className="text-center">
						<h1 className="text-4xl font-serif font-bold text-amber-900 mb-4">Page Not Found</h1>
						<p className="text-amber-700 mb-6 text-lg">The page you're looking for doesn't exist.</p>
						<Link to="/" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg inline-block">
							Return Home
						</Link>
					</div>
				</div>
			} />
		</Routes>
	)
}
