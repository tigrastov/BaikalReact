import React, { createContext, useState, useEffect } from "react";

// Создаем контекст для корзины
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Загружаем корзину из localStorage при инициализации
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Сохраняем корзину в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Функция для добавления товара в корзину
  const addToCart = (product) => {
    const cartItem = {
      ...product,
      cartId: `${product.id}-${Date.now()}`, // Уникальный идентификатор
    };
    setCart([...cart, cartItem]);
  };

  // Функция для удаления товара из корзины
  const removeFromCart = (cartId) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  // Функция для очистки корзины
  const clearCart = () => {
    setCart([]); // Очищаем корзину
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }} // Добавляем clearCart в value
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;