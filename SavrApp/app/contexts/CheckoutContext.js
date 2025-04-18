import React, { createContext, useContext, useState } from 'react';

// Cart context
export const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === productId);
      
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        const currentItem = updatedItems[existingItemIndex];
        
        if (currentItem.quantity > 1) {
          updatedItems[existingItemIndex] = {
            ...currentItem,
            quantity: currentItem.quantity - 1
          };
        } else {
          updatedItems.splice(existingItemIndex, 1);
        }
        
        return updatedItems;
      }
      
      return prevItems;
    });
  };

  const removeItemCompletely = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const checkout = () => {
    if (cartItems.length === 0) {
      return { success: false, message: "Cart is empty" };
    }
    
    const orderSummary = {
      items: [...cartItems],
      total: getCartTotal(),
      date: new Date().toISOString()
    };
    
    clearCart();
    
    return { 
      success: true, 
      message: "Order placed successfully", 
      order: orderSummary 
    };
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    removeItemCompletely,
    clearCart,
    getCartTotal,
    checkout,
    itemCount: cartItems.reduce((count, item) => count + item.quantity, 0)
  };

  return ( 
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};