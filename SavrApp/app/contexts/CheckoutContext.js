import React, { createContext, useContext, useState } from 'react';
import request from '../utils/request';

// Cart context
export const CartContext = createContext();

// Custom hook to use cart context
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = async (product) => {
    if (product?.shopName === undefined) {
      const { response, data } = await request(`/shop/${product.shopId}`, 'GET');
      if (response.ok) {
        product.shopName = data.data.name;
      }
      else {
        console.error("Failed to fetch shop name:", response.statusText);
        return;
      }
    }

    if (cartItems.length > 0 && cartItems[0].shopId !== product.shopId) {
      alert("You can only add products from one shop at a time. Please remove the other products from your cart first.");
      return;
    }

    setCartItems(prevItems => {
      // Search if the shop already exists in the cart
      const shopIndex = prevItems.findIndex(shop => shop.shopId === product.shopId);
      
      if (shopIndex !== -1) {
        // Shop exists, check if the product exists in the shop
        const updatedItems = [...prevItems];
        const productIndex = updatedItems[shopIndex].items.findIndex(item => item.id === product.id);
        
        if (productIndex !== -1) {
          // Product exists, increase its quantity
          updatedItems[shopIndex].items[productIndex] = {
            ...updatedItems[shopIndex].items[productIndex],
            quantity: updatedItems[shopIndex].items[productIndex].quantity + 1
          };
        } else {
          // Product does not exist, add it to the shop
          updatedItems[shopIndex].items.push({
            ...product,
            quantity: 1
          });
        }
        
        return updatedItems;
      } else {
        // Shop does not exist, create a new entry for it
        return [
          ...prevItems,
          {
            shopId: product.shopId,
            shopName: product.shopName,
            pickupTime: product.pickupTime,
            items: [{ ...product, quantity: 1 }]
          }
        ];
      }
    });
  };

  const removeFromCart = (shopId, productId) => {
    setCartItems(prevItems => {
      // Find the index of the shop
      const shopIndex = prevItems.findIndex(shop => shop.shopId === shopId);
      
      if (shopIndex === -1) return prevItems;
      
      const updatedItems = [...prevItems];
      const productIndex = updatedItems[shopIndex].items.findIndex(item => item.id === productId);
      
      if (productIndex === -1) return prevItems;
      
      const currentProduct = updatedItems[shopIndex].items[productIndex];
      
      if (currentProduct.quantity > 1) {
        // Decrease the quantity of the product
        updatedItems[shopIndex].items[productIndex] = {
          ...currentProduct,
          quantity: currentProduct.quantity - 1
        };
      } else {
        // Remove the product from the shop
        updatedItems[shopIndex].items.splice(productIndex, 1);
        
        // If the shop has no products left, remove the shop from the cart
        if (updatedItems[shopIndex].items.length === 0) {
          updatedItems.splice(shopIndex, 1);
        }
      }
      
      return updatedItems;
    });
  };

  const removeItemCompletely = (shopId, productId) => {
    setCartItems(prevItems => {
      // Find the index of the shop
      const shopIndex = prevItems.findIndex(shop => shop.shopId === shopId);
      
      if (shopIndex === -1) return prevItems;
      
      const updatedItems = [...prevItems];
      
      // Filter to remove the product from the shop
      updatedItems[shopIndex].items = updatedItems[shopIndex].items.filter(item => item.id !== productId);
      
      // If the shop has no products left, remove the shop from the cart
      if (updatedItems[shopIndex].items.length === 0) {
        updatedItems.splice(shopIndex, 1);
      }
      
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, shop) => {
      return total + shop.items.reduce((shopTotal, item) => {
        return shopTotal + (item.price * item.quantity);
      }, 0);
    }, 0);
  };

  const getShopTotal = (shopId) => {
    const shop = cartItems.find(shop => shop.shopId === shopId);
    if (!shop) return 0;
    
    return shop.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getTotalItemCount = () => {
    return cartItems.reduce((count, shop) => {
      return count + shop.items.reduce((shopCount, item) => shopCount + item.quantity, 0);
    }, 0);
  };

  const checkout = () => {
    if (cartItems.length === 0) {
      return { success: false, message: "Cart is empty" };
    }
    
    const orderSummary = {
      shops: cartItems.map(shop => ({
        shopId: shop.shopId,
        shopName: shop.shopName,
        pickupTime: shop.pickupTime,
        items: [...shop.items],
        total: getShopTotal(shop.shopId)
      })),
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
    getShopTotal,
    checkout,
    itemCount: getTotalItemCount()
  };

  return ( 
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default useCart;