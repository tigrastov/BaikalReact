import React from "react";
// Cart.jsx
// Catalog.jsx
import CartContext from '../CartContext'; // Импорт по умолчанию

function Cart({ cart, removeFromCart }) {
  return (
    <div className="cart">
      <h1>Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-price">{item.price}</p>
                <p className="cart-item-description">{item.description}</p>
              </div>
              <button
                className="cart-item-remove"
                onClick={() => removeFromCart(item.id)} // Удаляем товар
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