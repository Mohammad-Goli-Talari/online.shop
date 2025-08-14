/**
 * MSW (Mock Service Worker) Handlers
 * Intercepts API calls and returns mock data
 */

import { http, HttpResponse } from 'msw';
import {
  mockDataStore,
  generateProductDetail,
  generateDashboardStats,
  generateAddress,
  generatePaymentMethod,
  generateOrder,
  createPaginatedResponse,
  createApiResponse
} from '../data/mockData.js';

const API_BASE_URL = '/api';

// Helper function to create error responses
const createErrorResponse = (message, code, status = 400) => {
  const error = {
    status: false,
    message,
    code
  };
  return HttpResponse.json(error, { status });
};

// Helper function to simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const handlers = [
  // =============================================================================
  // AUTHENTICATION ENDPOINTS
  // =============================================================================
  
  // Login
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    await delay(800);
    
    try {
      const { email, password } = await request.json();
      
      if (!email || !password) {
        return createErrorResponse('Email and password are required', 'VAL_002', 400);
      }
      
      const user = mockDataStore.loginUser(email);
      
      if (!user) {
        return createErrorResponse('Invalid credentials', 'AUTH_001', 401);
      }
      
      const authResponse = {
        user,
        token: `mock_jwt_token_${user.id}_${Date.now()}`,
        expiresIn: 3600,
        refreshToken: `mock_refresh_token_${user.id}_${Date.now()}`
      };
      
      return HttpResponse.json(createApiResponse(authResponse, 'Login successful'));
    } catch {
      return createErrorResponse('Invalid request body', 'VAL_001', 400);
    }
  }),

  // Register
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    await delay(1000);
    
    try {
      const userData = await request.json();
      
      if (!userData.email || !userData.password) {
        return createErrorResponse('Email and password are required', 'VAL_002', 400);
      }
      
      if (userData.password !== userData.confirmPassword) {
        return createErrorResponse('Passwords do not match', 'VAL_003', 400);
      }
      
      // Check if user already exists
      const existingUser = mockDataStore.getUsers().find(u => u.email === userData.email);
      if (existingUser) {
        return createErrorResponse('User already exists', 'VAL_001', 409);
      }
      
      const user = mockDataStore.registerUser(userData);
      
      const authResponse = {
        user,
        token: `mock_jwt_token_${user.id}_${Date.now()}`,
        expiresIn: 3600,
        refreshToken: `mock_refresh_token_${user.id}_${Date.now()}`
      };
      
      return HttpResponse.json(createApiResponse(authResponse, 'Registration successful'));
    } catch {
      return createErrorResponse('Invalid request body', 'VAL_001', 400);
    }
  }),

  // Get current user
  http.get(`${API_BASE_URL}/auth/me`, async () => {
    await delay(300);
    
    const user = mockDataStore.getCurrentUser();
    if (!user) {
      return createErrorResponse('User not authenticated', 'AUTH_003', 401);
    }
    
    return HttpResponse.json(createApiResponse({ user }));
  }),

  // Logout
  http.post(`${API_BASE_URL}/auth/logout`, async () => {
    await delay(200);
    return HttpResponse.json(createApiResponse(null, 'Logout successful'));
  }),

  // =============================================================================
  // CATEGORY ENDPOINTS
  // =============================================================================
  
  // Get all categories
  http.get(`${API_BASE_URL}/categories`, async () => {
    await delay(400);
    const categories = mockDataStore.getCategories();
    return HttpResponse.json(createApiResponse({ categories }));
  }),

  // Get category by ID
  http.get(`${API_BASE_URL}/categories/:id`, async ({ params }) => {
    await delay(300);
    const id = parseInt(params.id);
    const category = mockDataStore.getCategories().find(c => c.id === id);
    
    if (!category) {
      return createErrorResponse('Category not found', 'NOT_FOUND', 404);
    }
    
    return HttpResponse.json(createApiResponse({ category }));
  }),

  // =============================================================================
  // PRODUCT ENDPOINTS
  // =============================================================================
  
  // Get products with filters and pagination
  http.get(`${API_BASE_URL}/products`, async ({ request }) => {
    await delay(600);
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const categoryId = url.searchParams.get('categoryId');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const inStock = url.searchParams.get('inStock') === 'true';
    
    let products = mockDataStore.getProducts();
    
    // Apply filters
    if (search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    if (categoryId) {
      products = products.filter(p => p.categoryId === parseInt(categoryId));
    }
    
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    if (inStock) {
      products = products.filter(p => p.stock > 0);
    }
    
    // Convert to ProductSummary format
    const productSummaries = products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      sku: p.sku,
      stock: p.stock,
      images: p.images,
      category: p.category,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      isActive: p.isActive
    }));
    
    const paginatedResponse = createPaginatedResponse(productSummaries, page, limit);
    return HttpResponse.json(createApiResponse(paginatedResponse));
  }),

  // Get product by ID
  http.get(`${API_BASE_URL}/products/:id`, async ({ params }) => {
    await delay(400);
    const id = parseInt(params.id);
    const product = mockDataStore.getProductById(id);
    
    if (!product) {
      return createErrorResponse('Product not found', 'NOT_FOUND', 404);
    }
    
    const productDetail = generateProductDetail();
    productDetail.id = product.id;
    productDetail.name = product.name;
    productDetail.description = product.description;
    productDetail.price = product.price;
    productDetail.sku = product.sku;
    productDetail.stock = product.stock;
    productDetail.images = product.images;
    productDetail.categoryId = product.categoryId;
    productDetail.category = product.category;
    productDetail.isActive = product.isActive;
    productDetail.createdAt = product.createdAt;
    productDetail.updatedAt = product.updatedAt;
    
    return HttpResponse.json(createApiResponse({ product: productDetail }));
  }),

  // Search products
  http.get(`${API_BASE_URL}/products/search`, async ({ request }) => {
    await delay(500);
    
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    const results = mockDataStore.searchProducts(query);
    const paginatedResponse = createPaginatedResponse(results, page, limit);
    
    const searchResponse = {
      query,
      results: paginatedResponse.items,
      pagination: paginatedResponse.pagination,
      filters: {
        categories: mockDataStore.getCategories().map(c => ({
          id: c.id,
          name: c.name,
          count: Math.floor(Math.random() * 20)
        })),
        priceRange: { min: 10, max: 1000 },
        avgRating: 4.2
      },
      suggestions: ['laptop', 'smartphone', 'headphones', 'tablet']
    };
    
    return HttpResponse.json(createApiResponse(searchResponse));
  }),

  // Create new product
  http.post(`${API_BASE_URL}/products`, async ({ request }) => {
    await delay(600);
    
    try {
      const productData = await request.json();
      
      // Validate required fields
      const requiredFields = ['name', 'price', 'sku', 'stock', 'categoryId'];
      const missingFields = requiredFields.filter(field => !productData[field] && productData[field] !== 0);
      
      if (missingFields.length > 0) {
        return createErrorResponse(
          `Missing required fields: ${missingFields.join(', ')}`, 
          'VAL_002', 
          400
        );
      }

      // Validate data types
      if (typeof productData.price !== 'number' || productData.price <= 0) {
        return createErrorResponse('Price must be a positive number', 'VAL_002', 400);
      }

      if (typeof productData.stock !== 'number' || productData.stock < 0) {
        return createErrorResponse('Stock must be a non-negative number', 'VAL_002', 400);
      }

      const newProduct = mockDataStore.createProduct(productData);
      
      return HttpResponse.json(
        createApiResponse({ product: newProduct }, 'Product created successfully'),
        { status: 201 }
      );
    } catch (error) {
      console.error('Error creating product:', error);
      return createErrorResponse('Failed to create product', 'SERVER_ERROR', 500);
    }
  }),

  // Update product
  http.put(`${API_BASE_URL}/products/:id`, async ({ params, request }) => {
    await delay(500);
    
    try {
      const id = parseInt(params.id);
      const productData = await request.json();
      
      const updatedProduct = mockDataStore.updateProduct(id, productData);
      
      return HttpResponse.json(
        createApiResponse({ product: updatedProduct }, 'Product updated successfully')
      );
    } catch (error) {
      console.error('Error updating product:', error);
      
      if (error.message === 'Product not found') {
        return createErrorResponse('Product not found', 'NOT_FOUND', 404);
      }
      
      return createErrorResponse('Failed to update product', 'SERVER_ERROR', 500);
    }
  }),

  // Delete product
  http.delete(`${API_BASE_URL}/products/:id`, async ({ params }) => {
    await delay(400);
    
    try {
      const id = parseInt(params.id);
      
      const deletedProduct = mockDataStore.deleteProduct(id);
      
      return HttpResponse.json(
        createApiResponse(
          { product: deletedProduct }, 
          'Product deleted successfully'
        )
      );
    } catch (error) {
      console.error('Error deleting product:', error);
      
      if (error.message === 'Product not found') {
        return createErrorResponse('Product not found', 'NOT_FOUND', 404);
      }
      
      return createErrorResponse('Failed to delete product', 'SERVER_ERROR', 500);
    }
  }),

  // =============================================================================
  // CART ENDPOINTS
  // =============================================================================
  
  // Get cart
  http.get(`${API_BASE_URL}/cart`, async () => {
    await delay(300);
    const cart = mockDataStore.getCart();
    return HttpResponse.json(createApiResponse({ cart }));
  }),

  // Add item to cart
  http.post(`${API_BASE_URL}/cart/items`, async ({ request }) => {
    await delay(400);
    
    try {
      const { productId, quantity } = await request.json();
      
      if (!productId || !quantity || quantity <= 0) {
        return createErrorResponse('Valid product ID and quantity are required', 'VAL_002', 400);
      }
      
      const cart = mockDataStore.addToCart(productId, quantity);
      return HttpResponse.json(createApiResponse({ cart }, 'Item added to cart'));
    } catch {
      return createErrorResponse('Product not found', 'NOT_FOUND', 404);
    }
  }),

  // Update cart item
  http.put(`${API_BASE_URL}/cart/items/:id`, async ({ request }) => {
    await delay(300);
    
    try {
      await request.json();
      const cart = mockDataStore.getCart();
      
      // Simulate updating cart item
      return HttpResponse.json(createApiResponse({ cart }, 'Cart item updated'));
    } catch {
      return createErrorResponse('Invalid request', 'VAL_001', 400);
    }
  }),

  // Remove cart item
  http.delete(`${API_BASE_URL}/cart/items/:id`, async () => {
    await delay(300);
    const cart = mockDataStore.getCart();
    return HttpResponse.json(createApiResponse({ cart }, 'Item removed from cart'));
  }),

  // Clear cart
  http.delete(`${API_BASE_URL}/cart`, async () => {
    await delay(300);
    const emptyCart = mockDataStore.getCart();
    emptyCart.items = [];
    emptyCart.subtotal = 0;
    emptyCart.tax = 0;
    emptyCart.total = 0;
    emptyCart.itemCount = 0;
    
    return HttpResponse.json(createApiResponse({ cart: emptyCart }, 'Cart cleared'));
  }),

  // =============================================================================
  // ORDER ENDPOINTS
  // =============================================================================
  
  // Get user orders
  http.get(`${API_BASE_URL}/orders`, async ({ request }) => {
    await delay(500);
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    const orders = mockDataStore.getOrders().map(o => ({
      id: o.id,
      orderNo: o.orderNo,
      status: o.status,
      total: o.total,
      itemCount: o.items.length,
      createdAt: o.createdAt
    }));
    
    const paginatedResponse = createPaginatedResponse(orders, page, limit);
    return HttpResponse.json(createApiResponse(paginatedResponse));
  }),

  // Get order by ID
  http.get(`${API_BASE_URL}/orders/:id`, async ({ params }) => {
    await delay(400);
    const id = parseInt(params.id);
    const order = mockDataStore.getOrders().find(o => o.id === id);
    
    if (!order) {
      return createErrorResponse('Order not found', 'NOT_FOUND', 404);
    }
    
    return HttpResponse.json(createApiResponse({ order }));
  }),

  // Create order (checkout)
  http.post(`${API_BASE_URL}/orders`, async ({ request }) => {
    await delay(1500); // Simulate checkout processing time
    
    try {
      await request.json();
      const order = generateOrder();
      
      return HttpResponse.json(createApiResponse({ order }, 'Order created successfully'));
    } catch {
      return createErrorResponse('Invalid checkout data', 'VAL_001', 400);
    }
  }),

  // =============================================================================
  // ADDRESS ENDPOINTS
  // =============================================================================
  
  // Get user addresses
  http.get(`${API_BASE_URL}/addresses`, async () => {
    await delay(300);
    const addresses = Array.from({ length: 3 }, () => generateAddress(1));
    return HttpResponse.json(createApiResponse({ addresses }));
  }),

  // Create address
  http.post(`${API_BASE_URL}/addresses`, async ({ request }) => {
    await delay(400);
    
    try {
      await request.json();
      const address = generateAddress(1);
      
      return HttpResponse.json(createApiResponse({ address }, 'Address created successfully'));
    } catch {
      return createErrorResponse('Invalid address data', 'VAL_001', 400);
    }
  }),

  // =============================================================================
  // PAYMENT ENDPOINTS
  // =============================================================================
  
  // Get payment methods
  http.get(`${API_BASE_URL}/payment-methods`, async () => {
    await delay(300);
    const paymentMethods = Array.from({ length: 2 }, generatePaymentMethod);
    return HttpResponse.json(createApiResponse({ paymentMethods }));
  }),

  // Add payment method
  http.post(`${API_BASE_URL}/payment-methods`, async ({ request }) => {
    await delay(600);
    
    try {
      await request.json();
      const paymentMethod = generatePaymentMethod();
      
      return HttpResponse.json(createApiResponse({ paymentMethod }, 'Payment method added successfully'));
    } catch {
      return createErrorResponse('Invalid payment method data', 'VAL_001', 400);
    }
  }),

  // =============================================================================
  // ADMIN ENDPOINTS
  // =============================================================================
  
  // Get dashboard stats
  http.get(`${API_BASE_URL}/admin/dashboard`, async () => {
    await delay(800);
    const stats = generateDashboardStats();
    return HttpResponse.json(createApiResponse(stats));
  }),

  // Get all users (admin)
  http.get(`${API_BASE_URL}/admin/users`, async ({ request }) => {
    await delay(600);
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    const users = mockDataStore.getUsers();
    const paginatedResponse = createPaginatedResponse(users, page, limit);
    return HttpResponse.json(createApiResponse(paginatedResponse));
  }),

  // Get all orders (admin)
  http.get(`${API_BASE_URL}/admin/orders`, async ({ request }) => {
    await delay(700);
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    const orders = mockDataStore.getOrders();
    const paginatedResponse = createPaginatedResponse(orders, page, limit);
    return HttpResponse.json(createApiResponse(paginatedResponse));
  }),

  // =============================================================================
  // HEALTH ENDPOINTS
  // =============================================================================
  
  // Health check
  http.get(`${API_BASE_URL}/health`, async () => {
    await delay(100);
    
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: {
        status: 'connected',
        responseTime: 45
      },
      redis: {
        status: 'connected',
        responseTime: 12
      },
      services: {
        payments: 'up',
        email: 'up',
        storage: 'up'
      }
    };
    
    return HttpResponse.json(createApiResponse(health));
  })
];
