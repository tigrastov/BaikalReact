import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Импортируем Firestore
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const AdminPanel = () => {
  const [orders, setOrders] = useState([]); // Состояние для хранения заказов
  const [loading, setLoading] = useState(true); // Состояние для отображения загрузки
  const [error, setError] = useState(null); // Состояние для отображения ошибок

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Получаем все заказы из коллекции "orders"
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const ordersData = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Для каждого заказа получаем информацию о пользователе
        const ordersWithUsers = await Promise.all(
          ordersData.map(async (order) => {
            const userDoc = await getDoc(doc(db, "users", order.userID));
            const userData = userDoc.data();
            return {
              ...order,
              user: userData, // Добавляем данные о пользователе
            };
          })
        );

        setOrders(ordersWithUsers); // Обновляем состояние
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Отображаем загрузку, пока данные не загружены
  }

  if (error) {
    return <p>{error}</p>; // Отображаем ошибку, если она есть
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome to the admin panel!</p>

      {/* Таблица с заказами */}
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Products</th>
            <th>Total Cost</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user?.name || "N/A"}</td>
              <td>{order.user?.email || "N/A"}</td>
              <td>{order.user?.phone || "N/A"}</td>
              <td>{order.user?.address || "N/A"}</td>
              <td>
                {order.positions ? (
                  <ul>
                    {order.positions.map((position) => (
                      <li key={position.id}>
                        <strong>{position.title}</strong> (x{position.count}) -{" "}
                        {position.cost} din
                      </li>
                    ))}
                  </ul>
                ) : (
                  "N/A"
                )}
              </td>
              <td>{order.cost || "N/A"} din</td>
              <td>{order.status || "N/A"}</td>
              <td>
                {order.date
                  ? new Date(order.date.seconds * 1000).toLocaleString() // Преобразуем Timestamp в дату
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;