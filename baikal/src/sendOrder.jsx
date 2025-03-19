import { db } from "./firebase"; // Импортируем инициализированный Firestore
import { collection, addDoc } from "firebase/firestore"; // Импортируем необходимые функции
import { Order } from "./models/models"; // Импортируем класс Order

const sendOrder = async (orderData) => {
  try {
    const ordersCollection = collection(db, "orders");

    // Форматируем дату заказа
    const date = new Date().toLocaleString("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });

    // Создаем объект Order
    const order = new Order(
      orderData.id || Date.now().toString(), // Уникальный ID заказа
      orderData.userID, // ID пользователя
      orderData.positions, // Массив позиций
      date, // Дата заказа (строка)
      orderData.status || "New", // Статус заказа
      orderData.cost // Общая стоимость заказа
    );

    // Логируем данные перед отправкой
    console.log("Order data to be sent:", order.toFirestore());

    // Отправляем заказ в Firestore
    const docRef = await addDoc(ordersCollection, order.toFirestore());
    console.log("Order sent with ID:", docRef.id);
    return docRef.id; // Возвращаем ID заказа
  } catch (error) {
    console.error("Error sending order:", error);
    throw error;
  }
};

export default sendOrder; // Исправленный экспорт