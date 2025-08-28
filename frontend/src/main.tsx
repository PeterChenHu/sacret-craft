import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/index.js'
import App from './App.js'
// import Landing from './screens/Landing.js'
import { BrowserRouter } from 'react-router'
import { UserProvider } from './contexts/UserContext.js'
import { CartProvider } from './contexts/CartContext.js'
import { WishlistProvider } from './contexts/WishlistContext.js'
import { ErrorBoundary } from './components/ErrorBoundary.js'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ErrorBoundary>
			<BrowserRouter>
				<UserProvider>
					<CartProvider>
						<WishlistProvider>
							<App />
						</WishlistProvider>
					</CartProvider>
				</UserProvider>
			</BrowserRouter>
		</ErrorBoundary>
	</StrictMode>
)
