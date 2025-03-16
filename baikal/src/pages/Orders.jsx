import React, { useEffect, useState } from "react";
import { fetchOrders } from "../services/firestore";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrders();
      setOrders(data);
    };
    loadOrders();
  }, []);

  return (
    <div>
      <h1>Список заказов</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.name} - {order.price} дин.
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;