import { db } from "./firebase"; // Импортируем инициализированный Firestore
import { collection, addDoc, doc, setDoc, Timestamp } from "firebase/firestore"; // Импортируем необходимые функции
import { Order } from "./models/models"; // Импортируем класс Order

const sendOrder = async (orderData) => {
  try {
    const ordersCollection = collection(db, "orders");

    // Используем Timestamp для сохранения даты
    const date = Timestamp.fromDate(new Date());

    // Создаем объект Order
    const order = new Order(
      orderData.id || Date.now().toString(), // Уникальный ID заказа
      orderData.userID, // ID пользователя
      orderData.positions, // Массив позиций
      date, // Дата заказа (Timestamp)
      orderData.status || "New", // Статус заказа
      orderData.cost // Общая стоимость заказа
    );

    // Логируем данные перед отправкой
    console.log("Order data to be sent:", order.toFirestore());

    // Проверяем данные заказа
    if (!order.id || !order.userID || !order.positions || !order.date || !order.status || !order.cost) {
      throw new Error("Invalid order data");
    }

    // Создаем документ заказа
    const orderRef = doc(ordersCollection, order.id);
    await setDoc(orderRef, {
      id: order.id,
      userID: order.userID,
      date: order.date, // Сохраняем как Timestamp
      status: order.status,
      cost: order.cost,
    });

    // Создаем вложенную коллекцию position
    const positionCollection = collection(orderRef, "position");
    for (const position of order.positions) {
      // Проверяем данные позиции
      if (!position.id || !position.cost || !position.count || !position.product || !position.product.price || !position.product.title) {
        console.error("Invalid position data:", position);
        continue; // Пропускаем некорректные позиции
      }

      // Сохраняем позицию
      await addDoc(positionCollection, {
        id: position.id,
        cost: position.cost,
        count: position.count,
        price: position.product.price, // Берем price из product
        title: position.product.title, // Берем title из product
      });
    }

    console.log("Order sent with ID:", order.id);
    return order.id; // Возвращаем ID заказа
  } catch (error) {
    console.error("Error sending order:", error);
    throw error;
  }
};

export default sendOrder;