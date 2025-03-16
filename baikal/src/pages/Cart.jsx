import React, { useContext } from "react";
import { CartContext } from "../CartContext"; // Импортируем контекст корзины

function Cart() {
  // Используем контекст корзины
  const { cart, removeFromCart } = useContext(CartContext);

  return (
    <div className="cart">
      <h1>Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.cartId} className="cart-item">
              <img src={item.imageUrl} alt={item.title} className="cart-item-image" />
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.title}</h3>
                <p className="cart-item-price">{item.price} din</p>
                <p className="cart-item-description">{item.descript}</p>
              </div>
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