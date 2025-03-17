import React, { useContext } from "react";
import { CartContext } from "../CartContext"; // Импортируем контекст корзины
import { useAuth } from "../AuthContext"; // Импортируем useAuth
import sendOrder from "../sendOrder";// Импортируем функцию отправки заказа

function Cart() {
  // Используем контекст корзины
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  // Используем контекст авторизации
  const { user, isAuthenticated } = useAuth();

  // Функция для оформления заказа
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert("Please log in to place an order.");
      return;
    }

    // Подготовка данных заказа
    const orderData = {
      userId: user.uid, // ID текущего пользователя
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price, 0), // Сумма заказа
      status: "pending", // Статус заказа
      createdAt: new Date().toISOString(), // Дата создания заказа
    };

    try {
      // Отправка заказа
      const orderId = await sendOrder(orderData);
      alert(`Order placed successfully! Order ID: ${orderId}`);
      clearCart(); // Очищаем корзину после успешного оформления
    } catch (error) {
      alert("Failed to place order. Please try again.");
    }
  };

  // Логируем содержимое корзины для отладки
  console.log("Cart items:", cart);

  return (
    <div className="cart">
      <h1>Cart</h1>

      {/* Кнопка оформления заказа */}
      {cart.length > 0 && (
        <button onClick={handleCheckout} className="checkout-button">
          Place Order
        </button>
      )}

      {/* Отображение содержимого корзины */}
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.cartId} className="cart-item">
              {/* Изображение товара */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="cart-item-image"
              />

              {/* Детали товара */}
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.title}</h3>
                <p className="cart-item-price">{item.price} din</p>
                <p className="cart-item-description">{item.descript}</p>
              </div>

              {/* Кнопка удаления товара */}
              <button
                className="cart-item-remove"
                onClick={() => removeFromCart(item.cartId)} // Удаляем товар из корзины
                aria-label={`Remove ${item.title} from cart`}
              >
                <p>Delete</p>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;