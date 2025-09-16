// src/hooks/useProductDetail.js
import { useState, useEffect, useCallback } from 'react';
import ProductService from '../services/productService.js';
import CartService from '../services/cartService.js';
import { mockDataStore } from '../mocks/data/mockData.js';
import { isUsingMocks } from '../config/api.js';

export function useProductDetail(rawProductId) {
  const productId = Number(rawProductId);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (isUsingMocks()) {
        data = mockDataStore.getProductById(productId);
        if (!data) throw new Error('Product not found');
        data.relatedProducts = data.relatedProducts || [];
      } else {
        const response = await ProductService.getProductById(productId);
        // Handle the response structure - it might be wrapped in { product: ... }
        data = response.product;
      }
      setProduct(data);

      if (data?.categoryId) {
        const related = isUsingMocks()
          ? mockDataStore.getProductsByCategory(data.categoryId).filter(p => p.id !== data.id)
          : await ProductService.getProducts({ categoryId: data.categoryId, limit: 4 });
        setRelatedProducts(related);
      } else {
        setRelatedProducts([]);
      }
    } catch (err) {
      console.error('Product detail fetch error:', err);
      setError(err.message || 'Error fetching product');
      setProduct(null);
      setRelatedProducts([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const addToCart = async () => {
    if (!product) return;
    setCartLoading(true);
    setCartSuccess(false);
    try {
      if (isUsingMocks()) {
        mockDataStore.addToCart(product.id, quantity);
      } else {
        await CartService.addToCart(product.id, quantity);
      }
      setCartSuccess(true);
    } catch (err) {
      console.error('Add to cart error:', err);
      setError(err.message || 'Error adding to cart');
    } finally {
      setCartLoading(false);
    }
  };

  return {
    product,
    relatedProducts,
    quantity,
    loading,
    error,
    cartLoading,
    cartSuccess,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    addToCart,
    refetch: fetchProduct
  };
}

export default useProductDetail;
