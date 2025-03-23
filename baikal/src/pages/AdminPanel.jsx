import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Импортируем Firestore
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";


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

  // Функция для преобразования даты в читаемый формат
  const formatDate = (date) => {
    if (!date) return "N/A";

    // Если date — это объект Timestamp
    if (typeof date.toDate === "function") {
      return date.toDate().toLocaleString();
    }
    // Если date — это строка в формате ISO
    else if (typeof date === "string") {
      try {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toLocaleString();
        }
      } catch (error) {
        console.log("Error parsing date:", error);
      }
    }
    // Если date — это объект Date
    else if (date instanceof Date) {
      return date.toLocaleString();
    }
    // Если date — это число (timestamp в миллисекундах)
    else if (typeof date === "number") {
      return new Date(date).toLocaleString();
    }

    return "N/A";
  };

  // Функция для обновления статуса заказа
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      // Обновляем состояние заказов
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      console.log("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Сортируем заказы по дате (новые сверху)
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
    const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
    return dateB - dateA; // Сортировка по убыванию (новые сверху)
  });

  if (loading) {
    return <p>Loading...</p>; // Отображаем загрузку, пока данные не загружены
  }

  if (error) {
    return <p>{error}</p>; // Отображаем ошибку, если она есть
  }

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>


      {/* Таблица с заказами */}
      <table className="orders-table">
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
            <th>Actions</th> {/* Новая колонка для действий */}
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user?.name || "N/A"}</td>
              <td>{order.user?.email || "N/A"}</td>
              <td>{order.user?.phone || "N/A"}</td>
              <td>{order.user?.address || "N/A"}</td>
              <td>
                {order.positions && order.positions.length > 0 ? (
                  <ul className="products-list">
                    {order.positions.map((position, index) => (
                      <li key={index}>
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
              <td>
                <span className={`status-${order.status.toLowerCase().replace(" ", "-")}`}>
                  {order.status || "N/A"}
                </span>
              </td>
              <td>{formatDate(order.date)}</td>
              <td>
                {/* Выпадающий список для смены статуса */}
                <select
                  value={order.status || "New"}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="In progress">In progress</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;