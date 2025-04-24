import React, { createContext, useState, useEffect } from "react";


export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  const addToCart = (product) => {
    const cartItem = {
      ...product,
      cartId: `${product.id}-${Date.now()}`, 
    };
    setCart([...cart, cartItem]);
  };


  const removeFromCart = (cartId) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };


  const clearCart = () => {
    setCart([]); 
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }} 
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;