// src/hooks/useProductDetail.js
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ProductService from '../services/productService.js';
import CartService from '../services/cartService.js';
import { mockDataStore } from '../mocks/data/mockData.js';
import { isUsingMocks } from '../config/api.js';

function useProductDetail(rawProductId) {
  const { id: routeId } = useParams();
  const productId = Number(rawProductId ?? routeId);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [cartLoading, setCartLoading] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      let data;
      if (isUsingMocks()) {
        data = mockDataStore.getProductById(productId);
        if (!data) throw new Error('Product not found');
      } else {
        const response = await ProductService.getProductById(productId);
        data = response?.product;
      }
      if (!data) {
        setNotFound(true);
        setProduct(null);
        return;
      }
      setProduct(data);

      const related = data.relatedProducts
        ? data.relatedProducts
        : isUsingMocks()
          ? mockDataStore.getProductsByCategory(data.categoryId).filter(p => p.id !== data.id)
          : await ProductService.getProducts({ categoryId: data.categoryId, limit: 4, exclude: data.id });

      setRelatedProducts(related || []);
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
    if (!product || product.stock <= 0) return;
    setCartLoading(true);
    setCartSuccess(false);
    try {
      if (isUsingMocks()) {
        mockDataStore.addToCart(product.id, quantity);
      } else {
        await CartService.addToCart(product.id, quantity);
        const cart = await CartService.getCart();
        setCartCount(cart.totalCount);
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
    notFound,
    cartLoading,
    cartSuccess,
    cartCount,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    addToCart,
    refetch: fetchProduct
  };
}

export default useProductDetail;
