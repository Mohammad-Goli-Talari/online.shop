// src/mocks/data/mockData.js
/**
 * Mock Data Generator for Telar eCommerce Platform
 * Uses Faker.js to generate realistic test data
 */

import { faker } from '@faker-js/faker';

// =============================================================================
// ENUMS (as constants)
// =============================================================================

export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

export const PaymentStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

export const PaymentMethodType = {
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  PAYPAL: 'PAYPAL',
  STRIPE: 'STRIPE'
};

export const AddressType = {
  SHIPPING: 'SHIPPING',
  BILLING: 'BILLING'
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// ID counters for ensuring unique IDs
let idCounters = {
  user: 1,
  category: 1,
  product: 1,
  order: 1,
  cartItem: 1,
  orderItem: 1,
  address: 1
};

function generateId(type = 'default') {
  if (idCounters[type]) {
    return idCounters[type]++;
  }
  return faker.number.int({ min: 1, max: 10000 });
}

function generateStringId() {
  return faker.string.uuid();
}

function randomFromArray(array) {
  return array[faker.number.int({ min: 0, max: array.length - 1 })];
}

function createPagination(page = 1, limit = 10, totalItems = 100) {
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.min(page, totalPages);
  
  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
    next: currentPage < totalPages ? `/api/endpoint?page=${currentPage + 1}&limit=${limit}` : undefined,
    previous: currentPage > 1 ? `/api/endpoint?page=${currentPage - 1}&limit=${limit}` : undefined
  };
}

// =============================================================================
// MOCK DATA GENERATORS
// =============================================================================

// This function creates generators that depend on other data sets
export const createDataGenerators = (categories = []) => {
  // Categories
  const generateCategory = () => ({
    id: generateId('category'),
    name: faker.commerce.department(),
    description: faker.lorem.paragraph(),
    slug: faker.helpers.slugify(faker.commerce.department()).toLowerCase(),
    isActive: faker.datatype.boolean(0.9),
    productCount: faker.number.int({ min: 0, max: 50 }),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString()
  });

  const generateCategories = (count = 8) => {
    return Array.from({ length: count }, generateCategory);
  };

  // Products - use existing categories
  const generateProductSummary = () => {
    const category = randomFromArray(categories); // Use existing categories
    return {
      id: generateId('product'),
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      sku: faker.string.alphanumeric(8).toUpperCase(),
      stock: faker.number.int({ min: 0, max: 100 }),
      images: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, (_, index) => 
        `https://picsum.photos/400/400?random=${Date.now()}-${index}`
      ),
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug
      }
    };
  };

  const generateProduct = () => {
    const summary = generateProductSummary();
    return {
      ...summary,
      description: faker.lorem.paragraphs(2),
      categoryId: summary.category.id,
      isActive: faker.datatype.boolean(0.85),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString()
    };
  };

  const generateProductDetail = () => {
    const product = generateProduct();
    return {
      ...product,
      relatedProducts: Array.from({ length: 4 }, generateProductSummary),
      averageRating: parseFloat(faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }).toFixed(1)),
      reviewCount: faker.number.int({ min: 0, max: 500 })
    };
  };

  const generateProducts = (count = 20) => {
    return Array.from({ length: count }, generateProduct);
  };

  return {
    generateCategory,
    generateCategories,
    generateProductSummary,
    generateProduct,
    generateProductDetail,
    generateProducts
  };
};

// Legacy generators (keep for backward compatibility)
// Categories
export const generateCategory = () => ({
  id: generateId('category'),
  name: faker.commerce.department(),
  description: faker.lorem.paragraph(),
  slug: faker.helpers.slugify(faker.commerce.department()).toLowerCase(),
  isActive: faker.datatype.boolean(0.9),
  productCount: faker.number.int({ min: 0, max: 50 }),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString()
});

export const generateCategories = (count = 8) => {
  return Array.from({ length: count }, generateCategory);
};

// Products - legacy version (generates random categories)
export const generateProductCategory = () => {
  const name = faker.commerce.department();
  return {
    id: generateId('category'),
    name,
    slug: faker.helpers.slugify(name).toLowerCase()
  };
};

export const generateProductSummary = () => ({
  id: generateId('product'),
  name: faker.commerce.productName(),
  price: parseFloat(faker.commerce.price()),
  sku: faker.string.alphanumeric(8).toUpperCase(),
  stock: faker.number.int({ min: 0, max: 100 }),
  images: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, (_, index) => 
    `https://picsum.photos/400/400?random=${Date.now()}-${index}`
  ),
  category: generateProductCategory()
});

export const generateProduct = () => {
  const summary = generateProductSummary();
  return {
    ...summary,
    description: faker.lorem.paragraphs(2),
    categoryId: summary.category.id,
    isActive: faker.datatype.boolean(0.85),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString()
  };
};

export const generateProductDetail = () => {
  const product = generateProduct();
  return {
    ...product,
    relatedProducts: Array.from({ length: 4 }, generateProductSummary),
    averageRating: parseFloat(faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }).toFixed(1)),
    reviewCount: faker.number.int({ min: 0, max: 500 })
  };
};

export const generateProducts = (count = 20) => {
  return Array.from({ length: count }, generateProductSummary);
};

// Users
export const generateUser = () => ({
  id: generateId('user'),
  email: faker.internet.email(),
  fullName: faker.person.fullName(),
  role: randomFromArray([UserRole.USER, UserRole.ADMIN]),
  isActive: faker.datatype.boolean(0.95),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString()
});

export const generateUserProfile = () => {
  const user = generateUser();
  return {
    ...user,
    orderCount: faker.number.int({ min: 0, max: 25 }),
    totalSpent: parseFloat(faker.commerce.price({ min: 0, max: 5000 })),
    lastLoginAt: faker.date.recent().toISOString()
  };
};

// Addresses
export const generateAddress = (userId) => ({
  id: generateId('address'),
  userId: userId || generateId('user'),
  type: randomFromArray([AddressType.SHIPPING, AddressType.BILLING]),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  company: faker.datatype.boolean(0.3) ? faker.company.name() : undefined,
  addressLine1: faker.location.streetAddress(),
  addressLine2: faker.datatype.boolean(0.4) ? faker.location.secondaryAddress() : undefined,
  city: faker.location.city(),
  state: faker.location.state(),
  postalCode: faker.location.zipCode(),
  country: faker.location.country(),
  phoneNumber: faker.phone.number(),
  isDefault: faker.datatype.boolean(0.2),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString()
});

// Payment Methods
export const generatePaymentMethod = () => {
  const type = randomFromArray([
    PaymentMethodType.CREDIT_CARD,
    PaymentMethodType.DEBIT_CARD,
    PaymentMethodType.PAYPAL,
    PaymentMethodType.STRIPE
  ]);
  
  const isCard = type === PaymentMethodType.CREDIT_CARD || type === PaymentMethodType.DEBIT_CARD;
  
  return {
    id: generateStringId(),
    type,
    provider: type === PaymentMethodType.PAYPAL ? 'PayPal' : 'Stripe',
    last4: isCard ? faker.finance.creditCardNumber().slice(-4) : undefined,
    expiryMonth: isCard ? faker.number.int({ min: 1, max: 12 }) : undefined,
    expiryYear: isCard ? faker.number.int({ min: 2024, max: 2030 }) : undefined,
    cardBrand: isCard ? randomFromArray(['Visa', 'Mastercard', 'American Express']) : undefined,
    isDefault: faker.datatype.boolean(0.3)
  };
};

// Cart Items
export const generateCartItem = () => {
  const product = generateProductSummary();
  const quantity = faker.number.int({ min: 1, max: 5 });
  const unitPrice = product.price;
  
  return {
    id: generateId('cartItem'),
    productId: product.id,
    product,
    quantity,
    unitPrice,
    totalPrice: unitPrice * quantity
  };
};

// Cart
export const generateCart = (userId) => {
  const items = Array.from({ length: faker.number.int({ min: 0, max: 6 }) }, generateCartItem);
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.08; // 8% tax
  
  return {
    id: generateStringId(),
    userId,
    items,
    subtotal,
    tax,
    total: subtotal + tax,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    updatedAt: faker.date.recent().toISOString()
  };
};

// Orders
export const generateOrderItem = () => {
  const product = generateProductSummary();
  const quantity = faker.number.int({ min: 1, max: 3 });
  const unitPrice = product.price;
  
  return {
    id: generateId('orderItem'),
    productId: product.id,
    product,
    quantity,
    unitPrice,
    totalPrice: unitPrice * quantity
  };
};

export const generateOrderSummary = () => ({
  id: generateId('order'),
  orderNo: `ORD-${faker.string.alphanumeric(8).toUpperCase()}`,
  status: randomFromArray([
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED
  ]),
  total: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
  itemCount: faker.number.int({ min: 1, max: 5 }),
  createdAt: faker.date.past().toISOString()
});

export const generateOrder = () => {
  const summary = generateOrderSummary();
  const items = Array.from({ length: summary.itemCount }, generateOrderItem);
  
  return {
    ...summary,
    userId: generateId('user'),
    items,
    total: items.reduce((sum, item) => sum + item.totalPrice, 0),
    shippingAddress: generateAddress(),
    billingAddress: generateAddress(),
    paymentMethod: generatePaymentMethod(),
    updatedAt: faker.date.recent().toISOString()
  };
};

// Payments
export const generatePayment = () => ({
  id: generateStringId(),
  orderId: generateId('order'),
  amount: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
  currency: 'USD',
  status: randomFromArray([
    PaymentStatus.PENDING,
    PaymentStatus.PROCESSING,
    PaymentStatus.COMPLETED,
    PaymentStatus.FAILED,
    PaymentStatus.REFUNDED
  ]),
  paymentMethod: generatePaymentMethod(),
  transactionId: faker.string.alphanumeric(16).toUpperCase(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString()
});

// Dashboard Stats
export const generateDashboardStats = () => ({
  totalUsers: faker.number.int({ min: 1000, max: 10000 }),
  totalOrders: faker.number.int({ min: 500, max: 5000 }),
  totalRevenue: parseFloat(faker.commerce.price({ min: 50000, max: 500000 })),
  totalProducts: faker.number.int({ min: 100, max: 1000 }),
  recentOrders: Array.from({ length: 10 }, generateOrderSummary),
  topProducts: Array.from({ length: 8 }, generateProductSummary),
  salesChart: Array.from({ length: 12 }, () => ({
    period: faker.date.month({ abbreviated: true }),
    revenue: parseFloat(faker.commerce.price({ min: 5000, max: 50000 })),
    orders: faker.number.int({ min: 50, max: 500 })
  }))
});

// =============================================================================
// DATA STORAGE
// =============================================================================

class MockDataStore {
  constructor() {
    // Reset ID counters to ensure clean state
    idCounters = {
      user: 1,
      category: 1,
      product: 1, // Still keep this counter for other potential uses
      order: 1,
      cartItem: 1,
      address: 1
    };
    
    this.users = [];
    this.categories = [];
    this.products = [];
    this.orders = [];
    this.cart = null;
    this.currentUser = null;
    this.initializeData();
  }

  initializeData() {
    // Set a default user (admin) first with a reserved ID
    this.currentUser = {
      id: 1,
      email: 'admin@telar.dev',
      fullName: 'Admin User',
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Reserve ID 1 for admin by starting user counter at 2
    idCounters.user = 2;
    
    // Generate categories first
    this.categories = generateCategories(12);
    
    // Create data generators that use the existing categories
    const dataGenerators = createDataGenerators(this.categories);
    
    // Generate initial data with consistent categories
    this.users = [this.currentUser, ...Array.from({ length: 49 }, generateUser)];
    this.products = dataGenerators.generateProducts(100);
    this.orders = Array.from({ length: 200 }, generateOrder);
  }

  // Getters
  getUsers = () => this.users;
  getCategories = () => this.categories;
  getProducts = () => this.products;
  getOrders = () => this.orders;
  getCurrentUser = () => this.currentUser;
  getCart = () => this.cart || generateCart(this.currentUser?.id);

  // User methods
  loginUser = (email) => {
    const user = this.users.find(u => u.email === email);
    if (user && user.isActive) {
      this.currentUser = user;
      return user;
    }
    return null;
  };

  registerUser = (userData) => {
    const newUser = {
      id: Math.max(...this.users.map(u => u.id)) + 1,
      email: userData.email,
      fullName: userData.fullName || null,
      role: UserRole.USER,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.users.push(newUser);
    this.currentUser = newUser;
    return newUser;
  };

  // Product methods
  getProductById = (id) => {
    return this.products.find(p => p.id === id) || null;
  };

  searchProducts = (query, filters = {}) => {
    let results = this.products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
    );

    if (filters.categoryId) {
      results = results.filter(p => p.categoryId === filters.categoryId);
    }

    if (filters.minPrice) {
      results = results.filter(p => p.price >= filters.minPrice);
    }

    if (filters.maxPrice) {
      results = results.filter(p => p.price <= filters.maxPrice);
    }

    if (filters.inStock) {
      results = results.filter(p => p.stock > 0);
    }

    return results.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      sku: p.sku,
      stock: p.stock,
      images: p.images,
      category: p.category
    }));
  };

  // Product CRUD methods
  createProduct = (productData) => {
    // Find the category to create the category object
    const category = this.categories.find(c => c.id === productData.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    const newProduct = {
      id: generateId('product'),
      name: productData.name,
      description: productData.description || null,
      price: productData.price,
      sku: productData.sku,
      stock: productData.stock || 0,
      isActive: productData.isActive !== undefined ? productData.isActive : true,
      images: productData.images || [],
      categoryId: productData.categoryId,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.products.push(newProduct);
    return newProduct;
  };

  updateProduct = (productId, productData) => {
    const index = this.products.findIndex(p => p.id === productId);
    if (index === -1) throw new Error('Product not found');
    
    const currentProduct = this.products[index];
    let updatedProduct = { ...currentProduct };

    // Update basic fields
    if (productData.name !== undefined) updatedProduct.name = productData.name;
    if (productData.description !== undefined) updatedProduct.description = productData.description;
    if (productData.price !== undefined) updatedProduct.price = productData.price;
    if (productData.sku !== undefined) updatedProduct.sku = productData.sku;
    if (productData.stock !== undefined) updatedProduct.stock = productData.stock;
    if (productData.isActive !== undefined) updatedProduct.isActive = productData.isActive;
    if (productData.images !== undefined) updatedProduct.images = productData.images;

    // Handle category update
    if (productData.categoryId !== undefined && productData.categoryId !== currentProduct.categoryId) {
      const category = this.categories.find(c => c.id === productData.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      updatedProduct.categoryId = productData.categoryId;
      updatedProduct.category = {
        id: category.id,
        name: category.name,
        slug: category.slug
      };
    }

    updatedProduct.updatedAt = new Date().toISOString();
    
    this.products[index] = updatedProduct;
    return updatedProduct;
  };

  deleteProduct = (productId) => {
    const index = this.products.findIndex(p => p.id === productId);
    if (index === -1) throw new Error('Product not found');
    
    const deletedProduct = this.products[index];
    this.products.splice(index, 1);
    return deletedProduct;
  };

  // Cart methods
  addToCart = (productId, quantity) => {
    const product = this.getProductById(productId);
    if (!product) throw new Error('Product not found');

    if (!this.cart) {
      this.cart = generateCart(this.currentUser?.id);
      this.cart.items = [];
    }

    const existingItem = this.cart.items.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity;
    } else {
      const newItem = {
        id: generateId('cartItem'),
        productId,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          sku: product.sku,
          stock: product.stock,
          images: product.images,
          category: product.category
        },
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity
      };
      this.cart.items.push(newItem);
    }

    this.updateCartTotals();
    return this.cart;
  };

  updateCartTotals = () => {
    if (!this.cart) return;
    
    this.cart.subtotal = this.cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.cart.tax = this.cart.subtotal * 0.08;
    this.cart.total = this.cart.subtotal + this.cart.tax;
    this.cart.itemCount = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    this.cart.updatedAt = new Date().toISOString();
  };
}

// Export singleton instance
export const mockDataStore = new MockDataStore();

// Helper functions for creating paginated responses
export const createPaginatedResponse = (items, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);
  
  return {
    items: paginatedItems,
    pagination: createPagination(page, limit, items.length)
  };
};

export const createApiResponse = (data, message) => ({
  status: true,
  data,
  message
});
