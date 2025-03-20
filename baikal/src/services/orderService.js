import { db } from "../firebase"; // Импортируем инициализированный Firestore
import { collection, query, where, getDocs } from "firebase/firestore";

export const fetchUserOrders = async (userId) => {
  try {
    const ordersCollection = collection(db, "orders");
    const q = query(ordersCollection, where("userID", "==", userId)); // Запрос заказов по userID
    const querySnapshot = await getDocs(q);

    const orders = [];
    for (const doc of querySnapshot.docs) {
      const orderData = doc.data();

      // Получаем позиции заказа из вложенной коллекции position
      const positionsCollection = collection(doc.ref, "position");
      const positionsSnapshot = await getDocs(positionsCollection);
      const positions = positionsSnapshot.docs.map((posDoc) => posDoc.data());

      orders.push({
        id: orderData.id,
        userID: orderData.userID,
        date: orderData.date,
        status: orderData.status,
        cost: orderData.cost,
        positions: positions,
      });
    }

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};