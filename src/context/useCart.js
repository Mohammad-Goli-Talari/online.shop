import { useContext } from 'react';
import { CartContext } from './CartContextInstance';

export function useCart() {
  return useContext(CartContext);
}
