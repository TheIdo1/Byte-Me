import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartRestaurantId, setCartRestaurantId] = useState(null);

  function initCart(restaurantId) {
    if (cartRestaurantId !== restaurantId) {
      setCartItems([]);
      setCartRestaurantId(restaurantId);
    }
  }

  function addToCart(product, quantity, selectedExtras) {
    setCartItems((prev) => [...prev, { product, quantity, selectedExtras }]);
  }

  function removeFromCart(index) {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  }

  function clearCart() {
    setCartItems([]);
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, cartRestaurantId, totalItems, initCart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
