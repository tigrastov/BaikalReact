import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext"; // Импортируем контекст авторизации
import { fetchUserOrders } from "../services/orderService";
function OrdersPage() {
  const { user } = useAuth(); // Получаем текущего пользователя
  const [orders, setOrders] = useState([]); // Состояние для хранения заказов
  const [loading, setLoading] = useState(true); // Состояние для отображения загрузки
  const [error, setError] = useState(null); // Состояние для отображения ошибок

  // Загружаем заказы при монтировании компонента
  useEffect(() => {
    if (user) {
      fetchUserOrders(user.uid)
        .then((orders) => {
          setOrders(orders);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
          setError("Failed to load orders. Please try again.");
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
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
    </div>
  );
}

export default OrdersPage;