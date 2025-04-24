import React, { useContext, useState } from "react";
import { CartContext } from "../CartContext";
import { useAuth } from "../AuthContext";
import sendOrder from "../sendOrder";
import { Order, Position } from "../models/models";
import ConfirmationModal from "../components/ConfirmationModal"; 

function Cart({ openAuthModal }) {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { user, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const totalCost = cart.reduce((sum, item) => {
    const price = Number(item.price); 
    const quantity = Number(item.quantity || 1); 
    return sum + price * quantity;
  }, 0);


  console.log("Cart items:", cart);
console.log("Prices:", cart.map(item => item.price));
console.log("Quantities:", cart.map(item => item.quantity || 1));


  const handleCheckout = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (!user?.uid) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    
    setIsModalOpen(true);
  };

  const handleConfirmOrder = async () => {
    setIsModalOpen(false); 

    const positions = cart.map(
      (item) =>
        new Position(
          `${item.id}-${Date.now()}`,
          {
            id: item.id,
            title: item.title,
            price: item.price,
            imageUrl: item.imageUrl,
            descript: item.descript,
          },
          item.quantity || 1
        )
    );

    const orderData = {
      userID: user.uid,
      positions: positions,
      cost: totalCost,
    };

    try {
      const orderId = await sendOrder(orderData);
      alert(`Order placed successfully! Order ID: ${orderId}`);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const handleCancelOrder = () => {
    setIsModalOpen(false); 
    console.log("Order canceled");
  };

  return (
    <div className="cart">
      <h1>Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-summary">
            <p>Total Cost: {`${totalCost} din`}</p>
            <div className="cart-actions">
              <button onClick={handleCheckout} className="checkout-button">
                Place Order
              </button>
              <button onClick={clearCart} className="clear-cart-button">
                Clear Cart
              </button>
            </div>
          </div>

          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.cartId} className="cart-item">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.title}</h3>
                  <p className="cart-item-price">{item.price} din</p>
                  <p className="cart-item-description">{item.descript}</p>
                  <p className="cart-item-quantity">Quantity: {item.quantity || 1}</p>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.cartId)}
                  aria-label={`Remove ${item.title} from cart`}
                >
                  <p>Delete</p>
                </button>
              </div>
            ))}
          </div>
        </>
      )}


      {isModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to place this order?"
          onConfirm={handleConfirmOrder}
          onCancel={handleCancelOrder}
        />
      )}
    </div>
  );
}

export default Cart;