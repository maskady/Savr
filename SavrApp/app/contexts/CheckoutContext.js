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
      // Chercher si le magasin existe déjà dans le panier
      const shopIndex = prevItems.findIndex(shop => shop.shopId === product.shopId);
      
      if (shopIndex !== -1) {
        // Le magasin existe, vérifier si le produit existe
        const updatedItems = [...prevItems];
        const productIndex = updatedItems[shopIndex].items.findIndex(item => item.id === product.id);
        
        if (productIndex !== -1) {
          // Le produit existe, augmenter la quantité
          updatedItems[shopIndex].items[productIndex] = {
            ...updatedItems[shopIndex].items[productIndex],
            quantity: updatedItems[shopIndex].items[productIndex].quantity + 1
          };
        } else {
          // Le produit n'existe pas, l'ajouter aux items du magasin
          updatedItems[shopIndex].items.push({
            ...product,
            quantity: 1
          });
        }
        
        return updatedItems;
      } else {
        // Le magasin n'existe pas, l'ajouter avec le produit
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
      // Trouver l'index du magasin
      const shopIndex = prevItems.findIndex(shop => shop.shopId === shopId);
      
      if (shopIndex === -1) return prevItems;
      
      const updatedItems = [...prevItems];
      const productIndex = updatedItems[shopIndex].items.findIndex(item => item.id === productId);
      
      if (productIndex === -1) return prevItems;
      
      const currentProduct = updatedItems[shopIndex].items[productIndex];
      
      if (currentProduct.quantity > 1) {
        // Réduire la quantité du produit
        updatedItems[shopIndex].items[productIndex] = {
          ...currentProduct,
          quantity: currentProduct.quantity - 1
        };
      } else {
        // Supprimer le produit
        updatedItems[shopIndex].items.splice(productIndex, 1);
        
        // Si le magasin n'a plus de produits, le supprimer également
        if (updatedItems[shopIndex].items.length === 0) {
          updatedItems.splice(shopIndex, 1);
        }
      }
      
      return updatedItems;
    });
  };

  const removeItemCompletely = (shopId, productId) => {
    setCartItems(prevItems => {
      // Trouver l'index du magasin
      const shopIndex = prevItems.findIndex(shop => shop.shopId === shopId);
      
      if (shopIndex === -1) return prevItems;
      
      const updatedItems = [...prevItems];
      
      // Filtrer pour supprimer complètement le produit
      updatedItems[shopIndex].items = updatedItems[shopIndex].items.filter(item => item.id !== productId);
      
      // Si le magasin n'a plus de produits, le supprimer également
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