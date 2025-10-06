/**
 * API Demo Page
 * Demonstrates the real backend API functionality
 */

import React, { useState, useEffect } from 'react';
import AuthService from '../services/authService.js';
import ProductService from '../services/productService.js';
import CartService from '../services/cartService.js';
import { useTranslation } from '../hooks/useTranslation.js';


const ApiDemo = () => {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      if (AuthService.isAuthenticated()) {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user.user);
      }
      
      const productsData = await ProductService.getProducts({ limit: 6 });
      setProducts(productsData.products || []); // Changed from productsData.items to productsData.products
      
      const cartData = await CartService.getCart();
      setCart(cartData.cart);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      const result = await AuthService.login('admin@telar.dev', 'password');
      setCurrentUser(result.user);
      setMessage('✅ Login successful!');
      
      const cartData = await CartService.getCart();
      setCart(cartData.cart);
    } catch (error) {
      setMessage(`❌ Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      setCurrentUser(null);
      setCart(null);
      setMessage('✅ Logout successful!');
    } catch (error) {
      setMessage(`❌ Logout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      setLoading(true);
      const result = await CartService.addToCart(productId, 1);
      setCart(result.cart);
      setMessage(`✅ Product added to cart!`);
    } catch (error) {
      setMessage(`❌ Failed to add to cart: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎭 Mock API Demo
          </h1>
          <p className="text-lg text-gray-600">
            Demonstrating the mock API system with realistic data
          </p>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('ui.apiStatus')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">🟢</div>
              <div className="font-medium">{t('ui.mockApiActive')}</div>
              <div className="text-sm text-gray-600">{t('ui.mswIntercepting')}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium">100+ Products</div>
              <div className="text-sm text-gray-600">Generated with Faker.js</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">🔄</div>
              <div className="font-medium">Real-time Switching</div>
              <div className="text-sm text-gray-600">Mock ↔ Real API</div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        {/* Authentication Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('ui.authenticationDemo')}</h2>
          
          {currentUser ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg">Welcome, <strong>{currentUser.fullName || currentUser.email}</strong>!</p>
                <p className="text-sm text-gray-600">Role: {currentUser.role}</p>
              </div>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg">{t('ui.notLoggedIn')}</p>
                <p className="text-sm text-gray-600">{t('placeholders.loginPrompt')}</p>
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login as Admin'}
              </button>
            </div>
          )}
        </div>

        {/* Cart Section */}
        {cart && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Cart Demo ({cart.itemCount} items)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-lg font-semibold">${cart.subtotal.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{t('ui.subtotal')}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-lg font-semibold">${cart.tax.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{t('ui.tax')}</div>
              </div>
              <div className="p-4 bg-green-50 rounded">
                <div className="text-lg font-semibold text-green-600">${cart.total.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{t('ui.total')}</div>
              </div>
            </div>

            {cart.items.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">{t('ui.cartItems')}</h3>
                <div className="space-y-2">
                  {cart.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">{item.product.name}</span>
                      <span className="text-sm font-medium">
                        {item.quantity} × ${item.unitPrice} = ${item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {cart.items.length > 3 && (
                    <div className="text-sm text-gray-500 text-center">
                      ... and {cart.items.length - 3} more items
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('ui.productsDemo')}</h2>
          <p className="text-gray-600 mb-6">{t('ui.sampleProducts')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 rounded mb-3 overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {t('ui.noImage')}
                    </div>
                  )}
                </div>
                
                <h3 className="font-medium text-lg mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category?.name}</p>
                <p className="text-lg font-bold text-blue-600 mb-3">${product.price}</p>
                
                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={loading}
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
                >
                  {loading ? t('loading.adding') : t('ui.addToCart')}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">{t('ui.developerControls')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">{t('ui.apiMode')}</h3>
              <p className="text-sm text-gray-600 mb-3">
                Current: <strong>{window.__TELAR_DEV__?.currentConfig().USE_MOCKS ? 'Mock API' : 'Real API'}</strong>
              </p>
              
              <div className="space-x-2">
                <button
                  onClick={() => window.__TELAR_DEV__?.enableMocks()}
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                >
                  {t('ui.useMocks')}
                </button>
                <button
                  onClick={() => window.__TELAR_DEV__?.enableRealApi()}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  {t('ui.useRealApi')}
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">{t('ui.consoleCommands')}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><code>window.__TELAR_DEV__.enableMocks()</code></div>
                <div><code>window.__TELAR_DEV__.enableRealApi()</code></div>
                <div><code>window.__TELAR_DEV__.currentConfig()</code></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h4 className="font-medium mb-2">{t('ui.mockDataSummary')}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>👥 <strong>50+</strong> {t('ui.users')}</div>
              <div>🏷️ <strong>12</strong> {t('ui.categories')}</div>
              <div>🛍️ <strong>100+</strong> {t('ui.products')}</div>
              <div>📦 <strong>200+</strong> {t('ui.orders')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDemo;
