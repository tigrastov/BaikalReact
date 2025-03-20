import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { fetchUserOrders } from "../services/orderService";

function OrdersSidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для обновления заказов
  const refreshOrders = async () => {
    if (user) {
      setLoading(true);
      try {
        const orders = await fetchUserOrders(user.uid);
        setOrders(orders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again.");
        setLoading(false);
      }
    }
  };

  // Загружаем заказы при монтировании компонента
  useEffect(() => {
    if (isOpen) {
      refreshOrders();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className={`orders-sidebar ${isOpen ? "open" : ""}`}>
      <div className="orders-sidebar-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h1>Your Orders</h1>
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p>{error}</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-item">
                <h2>Order ID: {order.id}</h2>
                <p>Date: {order.date}</p>
                <p>Status: {order.status}</p>
                <p>Total Cost: {order.cost} din</p>
                <div className="order-positions">
                  <h3>Positions:</h3>
                  {order.positions.map((position) => (
                    <div key={position.id} className="position-item">
                      <p>Title: {position.title}</p>
                      <p>Price: {position.price} din</p>
                      <p>Quantity: {position.count}</p>
                      <p>Cost: {position.cost} din</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}


<div className="order-info" >
<p>To clarify the details of the order readiness, you can always contact us.
   All our contacts are in the "Information" section.</p>
</div>


      </div>
    </div>
  );
}

export default OrdersSidebar;