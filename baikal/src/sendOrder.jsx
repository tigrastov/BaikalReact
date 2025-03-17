import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase"; // Импортируем Firestore

const sendOrder = async (orderData) => {
  try {
    const ordersCollection = collection(db, "orders");
    const docRef = await addDoc(ordersCollection, orderData);
    console.log("Order sent with ID:", docRef.id);
    return docRef.id; // Возвращаем ID заказа
  } catch (error) {
    console.error("Error sending order:", error);
    throw error;
  }
};

export default sendOrder;