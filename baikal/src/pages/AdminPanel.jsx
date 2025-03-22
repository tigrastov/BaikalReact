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

        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const ordersData = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Для каждого заказа получаем информацию о пользователе и позициях
        const ordersWithDetails = await Promise.all(
          ordersData.map(async (order) => {
            // Получаем данные о пользователе
            const userDoc = await getDoc(doc(db, "users", order.userID));
            const userData = userDoc.data();

            // Получаем позиции заказа из вложенной коллекции "position"
            const positionsCollection = collection(db, "orders", order.id, "position");
            const positionsSnapshot = await getDocs(positionsCollection);
            const positionsData = positionsSnapshot.docs.map((posDoc) => posDoc.data());

            return {
              ...order,
              user: userData, // Добавляем данные о пользователе
              positions: positionsData, // Добавляем данные о позициях
            };
          })
        );

        setOrders(ordersWithDetails); // Обновляем состояние
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
          {orders.map((order) => {
            // Преобразуем дату в читаемый формат
            let displayDate = "N/A";
            if (order.date) {
              // Если date — это объект Timestamp
              if (typeof order.date.toDate === "function") {
                displayDate = order.date.toDate().toLocaleString();
              }
              // Если date — это строка
              else if (typeof order.date === "string") {
                const parsedDate = new Date(order.date);
                if (!isNaN(parsedDate.getTime())) {
                  displayDate = parsedDate.toLocaleString();
                }
              }
            }

            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user?.name || "N/A"}</td>
                <td>{order.user?.email || "N/A"}</td>
                <td>{order.user?.phone || "N/A"}</td>
                <td>{order.user?.address || "N/A"}</td>
                <td>
                  {/* Проверяем, существует ли positions */}
                  {order.positions && order.positions.length > 0 ? (
                    <ul>
                      {order.positions.map((position) => (
                        <li key={position.id}>
                          {/* Проверяем, существует ли product и его поля */}
                          {position.product ? (
                            <>
                              <strong>{position.product.title}</strong> (x{position.count}) -{" "}
                              {position.cost} din
                            </>
                          ) : (
                            <>
                              <strong>{position.title}</strong> (x{position.count}) -{" "}
                              {position.cost} din
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No positions found."
                  )}
                </td>
                <td>{order.cost || "N/A"} din</td>
                <td>{order.status || "N/A"}</td>
                <td>{displayDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;